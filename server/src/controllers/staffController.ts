import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createAuditLog } from './auditController';

const prisma = new PrismaClient();

// Get all staff members
export const getStaff = async (req: Request, res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: 'staff' },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff members' });
  }
};

// Create a new staff member
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, password, gender, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        phone,
        role: 'staff',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        phone: true,
        isActive: true,
        createdAt: true,
      }
    });

    // Add audit log
    const adminUser = (req as any).user;
    if (adminUser) {
      await createAuditLog(
        adminUser.userId,
        adminUser.role,
        'CREATE_STAFF_ACCOUNT',
        null,
        newStaff.email,
        req,
        undefined,
        `Created staff account for ${newStaff.name}`
      );
    }

    res.status(201).json(newStaff);
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
};

// Update staff details
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, gender, phone } = req.body;

    const updatedStaff = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, gender, phone },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        phone: true,
        isActive: true,
        updatedAt: true,
      }
    });

    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ error: 'Failed to update staff details' });
  }
};

// Toggle staff account status (Suspend/Reactivate)
export const toggleStaffStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedStaff = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isActive },
      select: {
        id: true,
        name: true,
        isActive: true,
      }
    });

    // Add audit log
    const adminUser = (req as any).user;
    if (adminUser) {
      await createAuditLog(
        adminUser.userId,
        adminUser.role,
        updatedStaff.isActive ? 'ACTIVATE_STAFF_ACCOUNT' : 'SUSPEND_STAFF_ACCOUNT',
        null,
        updatedStaff.name,
        req,
        undefined,
        `${updatedStaff.isActive ? 'Activated' : 'Suspended'} account for ${updatedStaff.name}`
      );
    }

    res.json(updatedStaff);
  } catch (error) {
    console.error('Error toggling staff status:', error);
    res.status(500).json({ error: 'Failed to update staff status' });
  }
};

// Reset staff password
export const resetStaffPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword },
    });

    // Add audit log
    const adminUser = (req as any).user;
    if (adminUser) {
      await createAuditLog(
        adminUser.userId,
        adminUser.role,
        'RESET_STAFF_PASSWORD',
        null,
        updatedUser.name,
        req,
        undefined,
        `Reset password for staff member ${updatedUser.name}`
      );
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
