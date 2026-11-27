import { Request, Response } from 'express';
import { McdaWeightConfig, Prisma } from '@prisma/client';
import prisma from '../config/db';
import { createAuditLog } from './auditController';
import {
  DEFAULT_MCDA_TRACKS,
  McdaTrackKey,
  McdaWeights,
  computeMcdaRankings,
  validateWeights,
} from '../services/decisionSupportScoring';
import { resolveCollegeFilters } from '../utils/collegeMapper';

const VALID_TRACK_KEYS: ReadonlyArray<McdaTrackKey> = ['needs-based', 'merit', 'balanced', 'custom'];

const VALID_DECISIONS = new Set([
  'CONFIRMED_AWARD',
  'OVERRIDE_AWARD',
  'OVERRIDE_WAITLIST',
  'OVERRIDE_REJECT',
]);

const resolveTrackWeights = async (
  requestedTrack?: string
): Promise<{ trackKey: McdaTrackKey; label: string; weights: McdaWeights }> => {
  const savedConfigs: McdaWeightConfig[] = await prisma.mcdaWeightConfig.findMany();
  const configByKey = new Map<string, McdaWeightConfig>(
    savedConfigs.map((cfg: McdaWeightConfig) => [cfg.trackKey, cfg])
  );

  let resolvedKey: McdaTrackKey = 'balanced';
  if (requestedTrack && VALID_TRACK_KEYS.includes(requestedTrack as McdaTrackKey)) {
    resolvedKey = requestedTrack as McdaTrackKey;
  } else {
    const activeCfg = savedConfigs.find((cfg: McdaWeightConfig) => cfg.isActive);
    if (activeCfg && VALID_TRACK_KEYS.includes(activeCfg.trackKey as McdaTrackKey)) {
      resolvedKey = activeCfg.trackKey as McdaTrackKey;
    }
  }

  const saved = configByKey.get(resolvedKey);
  if (saved) {
    return {
      trackKey: resolvedKey,
      label: saved.label,
      weights: {
        gwaWeight: saved.gwaWeight,
        incomeWeight: saved.incomeWeight,
        householdWeight: saved.householdWeight,
        priorityWeight: saved.priorityWeight,
      },
    };
  }

  if (resolvedKey === 'custom') {
    const fallback = DEFAULT_MCDA_TRACKS.balanced;
    return {
      trackKey: 'custom',
      label: 'Custom Weighted Track',
      weights: fallback.weights,
    };
  }

  const preset = DEFAULT_MCDA_TRACKS[resolvedKey];
  return {
    trackKey: preset.key,
    label: preset.label,
    weights: preset.weights,
  };
};

/**
 * GET /api/decision-support/rankings
 * Computes MCDA (SAW) scores and quota recommendations for scholarship applicants.
 */
export const getMcdaRankings = async (req: Request, res: Response): Promise<void> => {
  try {
    const trackParam = typeof req.query.track === 'string' ? req.query.track.trim().toLowerCase() : undefined;
    const quotaParam = Number.parseInt(String(req.query.quota ?? '50'), 10);
    const quota = Number.isFinite(quotaParam) && quotaParam > 0 ? Math.min(quotaParam, 5000) : 50;
    const includeRejected = req.query.includeRejected === 'true';

    const { trackKey, label, weights } = await resolveTrackWeights(trackParam);
    const collegeFilter = resolveCollegeFilters(req.query.college);

    const whereClause: Record<string, unknown> = {};
    if (!includeRejected) {
      whereClause.status = { not: 'Rejected' };
    }
    if (!collegeFilter.isAllSelected && collegeFilter.matchValues.length > 0) {
      whereClause.college = { in: collegeFilter.matchValues };
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        flags: {
          select: {
            matchReason: true,
            isResolved: true,
          },
        },
        mcdaDecision: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const result = computeMcdaRankings(applications, weights, quota);

    res.status(200).json({
      success: true,
      track: {
        key: trackKey,
        label,
      },
      quota,
      weights,
      summary: result.summary,
      rankings: result.rankings,
      flaggedHold: result.flaggedHold,
    });
  } catch (error) {
    console.error('Error computing MCDA rankings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute MCDA applicant rankings',
    });
  }
};

/**
 * GET /api/decision-support/weights
 * Returns preset AHP tracks, active track, and any persisted custom weights.
 */
export const getMcdaWeights = async (_req: Request, res: Response): Promise<void> => {
  try {
    const savedConfigs: McdaWeightConfig[] = await prisma.mcdaWeightConfig.findMany();
    const configByKey = new Map<string, McdaWeightConfig>(
      savedConfigs.map((cfg: McdaWeightConfig) => [cfg.trackKey, cfg])
    );

    const activeSaved = savedConfigs.find((cfg: McdaWeightConfig) => cfg.isActive);
    const activeTrack: McdaTrackKey =
      activeSaved && VALID_TRACK_KEYS.includes(activeSaved.trackKey as McdaTrackKey)
        ? (activeSaved.trackKey as McdaTrackKey)
        : 'balanced';

    const tracks = (['needs-based', 'merit', 'balanced'] as const).map((key) => {
      const preset = DEFAULT_MCDA_TRACKS[key];
      const saved = configByKey.get(key);
      return {
        key,
        label: saved?.label ?? preset.label,
        description: preset.description,
        isActive: activeTrack === key,
        weights: saved
          ? {
              gwaWeight: saved.gwaWeight,
              incomeWeight: saved.incomeWeight,
              householdWeight: saved.householdWeight,
              priorityWeight: saved.priorityWeight,
            }
          : preset.weights,
        updatedAt: saved?.updatedAt?.toISOString() ?? null,
      };
    });

    const savedCustom = configByKey.get('custom');
    const customTrack = {
      key: 'custom' as const,
      label: savedCustom?.label ?? 'Custom Institutional Track',
      description: 'Administrator-defined criteria weights tailored to a specific grant mandate.',
      isActive: activeTrack === 'custom',
      weights: savedCustom
        ? {
            gwaWeight: savedCustom.gwaWeight,
            incomeWeight: savedCustom.incomeWeight,
            householdWeight: savedCustom.householdWeight,
            priorityWeight: savedCustom.priorityWeight,
          }
        : DEFAULT_MCDA_TRACKS.balanced.weights,
      updatedAt: savedCustom?.updatedAt?.toISOString() ?? null,
    };

    const allTracks = [...tracks, customTrack];
    const activeTrackDef = allTracks.find((t) => t.key === activeTrack) ?? customTrack;

    res.status(200).json({
      success: true,
      activeTrack,
      activeWeights: activeTrackDef.weights,
      tracks: allTracks,
    });
  } catch (error) {
    console.error('Error fetching MCDA weights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve MCDA weight configurations',
    });
  }
};

/**
 * POST /api/decision-support/weights
 * Saves criteria weights for a track (defaulting to 'custom') and marks it active if requested.
 */
export const updateMcdaWeights = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawTrackKey = typeof req.body.trackKey === 'string' ? req.body.trackKey.trim().toLowerCase() : 'custom';
    const trackKey: McdaTrackKey = VALID_TRACK_KEYS.includes(rawTrackKey as McdaTrackKey)
      ? (rawTrackKey as McdaTrackKey)
      : 'custom';

    const weights: McdaWeights = {
      gwaWeight: Number(req.body.gwaWeight),
      incomeWeight: Number(req.body.incomeWeight),
      householdWeight: Number(req.body.householdWeight),
      priorityWeight: Number(req.body.priorityWeight),
    };

    const validation = validateWeights(weights);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: validation.error,
      });
      return;
    }

    const setAsActive = req.body.setAsActive !== false;
    const defaultLabel =
      trackKey === 'custom' ? 'Custom Institutional Track' : DEFAULT_MCDA_TRACKS[trackKey].label;
    const label = typeof req.body.label === 'string' && req.body.label.trim() ? req.body.label.trim() : defaultLabel;

    const user = req.user;

    const saved = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (setAsActive) {
        await tx.mcdaWeightConfig.updateMany({
          data: { isActive: false },
        });
      }

      return tx.mcdaWeightConfig.upsert({
        where: { trackKey },
        update: {
          label,
          gwaWeight: weights.gwaWeight,
          incomeWeight: weights.incomeWeight,
          householdWeight: weights.householdWeight,
          priorityWeight: weights.priorityWeight,
          isActive: setAsActive,
          updatedById: user?.userId ?? null,
        },
        create: {
          trackKey,
          label,
          gwaWeight: weights.gwaWeight,
          incomeWeight: weights.incomeWeight,
          householdWeight: weights.householdWeight,
          priorityWeight: weights.priorityWeight,
          isActive: setAsActive,
          updatedById: user?.userId ?? null,
        },
      });
    });

    if (user) {
      await createAuditLog(
        user.userId,
        user.role,
        'MCDA_WEIGHTS_UPDATE',
        null,
        trackKey,
        req,
        undefined,
        `Updated MCDA weights (${label}): GWA ${weights.gwaWeight}%, Income ${weights.incomeWeight}%, Household ${weights.householdWeight}%, Priority ${weights.priorityWeight}%`
      );
    }

    res.status(200).json({
      success: true,
      message: 'MCDA weights updated successfully',
      config: saved,
    });
  } catch (error) {
    console.error('Error updating MCDA weights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update MCDA weights',
    });
  }
};

/**
 * POST /api/decision-support/override
 * Records human-in-the-loop confirmation or override of an MCDA recommendation with AuditLog trail.
 */
export const recordMcdaDecision = async (req: Request, res: Response): Promise<void> => {
  try {
    const { referenceNumber, decision, trackKey, compositeScore, remarks, syncApplicationStatus } = req.body;

    if (!referenceNumber || typeof referenceNumber !== 'string') {
      res.status(400).json({ success: false, message: 'Application referenceNumber is required.' });
      return;
    }

    if (!decision || !VALID_DECISIONS.has(decision)) {
      res.status(400).json({
        success: false,
        message: 'Invalid decision type. Must be CONFIRMED_AWARD, OVERRIDE_AWARD, OVERRIDE_WAITLIST, or OVERRIDE_REJECT.',
      });
      return;
    }

    const trimmedRemarks = typeof remarks === 'string' ? remarks.trim() : '';
    const isOverride = decision.startsWith('OVERRIDE_');
    if (isOverride && trimmedRemarks.length < 5) {
      res.status(400).json({
        success: false,
        message: 'Justification remarks (at least 5 characters) are required when overriding an MCDA recommendation.',
      });
      return;
    }

    const application = await prisma.application.findUnique({
      where: { referenceNumber },
    });

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const user = req.user;
    const safeTrack = typeof trackKey === 'string' && trackKey.trim() ? trackKey.trim() : 'balanced';
    const safeScore = Number.isFinite(Number(compositeScore)) ? Number(compositeScore) : 0;
    const finalRemarks = trimmedRemarks || `Confirmed MCDA recommendation (${safeTrack}, score ${safeScore.toFixed(2)}).`;

    const savedDecision = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const record = await tx.mcdaDecision.upsert({
        where: { applicationId: application.id },
        update: {
          decision,
          trackKey: safeTrack,
          compositeScore: safeScore,
          remarks: finalRemarks,
          decidedById: user?.userId ?? null,
          decidedAt: new Date(),
        },
        create: {
          applicationId: application.id,
          decision,
          trackKey: safeTrack,
          compositeScore: safeScore,
          remarks: finalRemarks,
          decidedById: user?.userId ?? null,
        },
      });

      if (syncApplicationStatus !== false) {
        let nextStatus: string | null = null;
        if (decision === 'CONFIRMED_AWARD' || decision === 'OVERRIDE_AWARD') {
          nextStatus = 'Approved';
        } else if (decision === 'OVERRIDE_REJECT') {
          nextStatus = 'Rejected';
        } else if (decision === 'OVERRIDE_WAITLIST') {
          nextStatus = 'Pending Review';
        }

        if (nextStatus) {
          await tx.application.update({
            where: { id: application.id },
            data: {
              status: nextStatus,
              remarks: finalRemarks,
            },
          });
        }
      }

      return record;
    });

    if (user) {
      const auditAction = isOverride ? 'MCDA_OVERRIDE' : 'MCDA_CONFIRM';
      await createAuditLog(
        user.userId,
        user.role,
        auditAction,
        application.referenceNumber,
        safeTrack,
        req,
        undefined,
        `[${decision}] Score: ${safeScore.toFixed(2)} | ${finalRemarks}`
      );
    }

    res.status(200).json({
      success: true,
      message: isOverride
        ? 'Override decision recorded and logged.'
        : 'MCDA recommendation confirmed and logged.',
      decision: savedDecision,
    });
  } catch (error) {
    console.error('Error recording MCDA decision:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record MCDA decision',
    });
  }
};
