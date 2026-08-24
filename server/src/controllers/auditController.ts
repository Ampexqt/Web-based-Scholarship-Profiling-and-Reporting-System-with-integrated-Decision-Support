import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to extract device and OS from User-Agent
const parseUserAgent = (ua: string) => {
  let os = 'Unknown';
  let deviceType = 'Desktop';

  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'Smartphone';
  } else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'Tablet';
  }

  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac OS/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iOS|iPhone|iPad/.test(ua)) os = 'iOS';

  return { os, deviceType };
};

// Create an audit log
export const createAuditLog = async (
  userId: number | null,
  userRole: string | null,
  action: string,
  targetAppId: string | null,
  targetDoc: string | null,
  req: Request,
  duration?: number,
  notes?: string
) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || 'Unknown';
    const userAgentStr = req.headers['user-agent'] || '';
    const { os, deviceType } = parseUserAgent(userAgentStr);

    await prisma.auditLog.create({
      data: {
        userId,
        userRole,
        action,
        targetAppId,
        targetDoc,
        ipAddress,
        userAgent: userAgentStr,
        deviceType,
        os,
        duration,
        notes
      }
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
};

// Log duration endpoint (called by frontend when leaving review page)
export const logDuration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetAppId, duration, notes } = req.body;
    const user = (req as any).user;

    await createAuditLog(
      user.userId,
      user.role,
      'APP_VIEW_END',
      targetAppId,
      null,
      req,
      duration,
      notes
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Generic log event endpoint (for DOC_VIEW, etc.)
export const logEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, targetAppId, targetDoc, notes } = req.body;
    const user = (req as any).user;

    await createAuditLog(
      user.userId,
      user.role,
      action,
      targetAppId,
      targetDoc,
      req,
      undefined,
      notes
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch audit logs for the admin table
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      take: 1000 
    });

    res.status(200).json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
