import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAuditLog } from './auditController';

const prisma = new PrismaClient();

const generateTokens = (userId: number, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Store refresh token in DB (for revocation/logout)
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 mins
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/auth/refresh' }); // 7 days

    // Log the login event
    await createAuditLog(user.id, user.role, 'USER_LOGIN', null, null, req);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    // Verify token structure and signature
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    // Ensure user exists and token matches what is stored in DB
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id, user.role);

    // Update refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Set new cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/auth/refresh' });

    res.json({ success: true, message: 'Token refreshed successfully' });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ success: false, message: 'Server error during token refresh' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (user && user.userId) {
      // Log the logout action
      await createAuditLog(user.userId, user.role, 'USER_LOGOUT', null, null, req);

      // Clear refresh token from DB using userId
      await prisma.user.updateMany({
        where: { id: user.userId },
        data: { refreshToken: null },
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user is populated by authenticateToken middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};
