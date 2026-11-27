/**
 * Multi-Criteria Decision Analysis (MCDA) Scoring Engine
 * Implements Simple Additive Weighting (SAW) with AHP-justified tracks.
 */

export type McdaTrackKey = 'needs-based' | 'merit' | 'balanced' | 'custom';

export interface McdaWeights {
  readonly gwaWeight: number;
  readonly incomeWeight: number;
  readonly householdWeight: number;
  readonly priorityWeight: number;
}

export interface McdaTrackDefinition {
  readonly key: McdaTrackKey;
  readonly label: string;
  readonly description: string;
  readonly weights: McdaWeights;
}

export interface RawApplicantMetrics {
  readonly gwa: number | null;
  readonly gwaInverted: number;
  readonly monthlyIncome: number;
  readonly householdSize: number;
  readonly priorityPoints: number;
  readonly priorityTags: string[];
}

export interface NormalizedScores {
  readonly gwa: number;
  readonly income: number;
  readonly household: number;
  readonly priority: number;
}

export interface WeightedPoints {
  readonly gwa: number;
  readonly income: number;
  readonly household: number;
  readonly priority: number;
}

export interface PersistedMcdaDecision {
  readonly decision: string;
  readonly remarks: string;
  readonly trackKey: string;
  readonly compositeScore: number;
  readonly decidedAt: string;
}

export interface RankedApplicant {
  readonly rank: number;
  readonly applicationId: number;
  readonly referenceNumber: string;
  readonly studentId: string;
  readonly fullName: string;
  readonly college: string;
  readonly course: string;
  readonly status: string;
  readonly isFlagged: boolean;
  readonly flagReasons: string[];
  readonly metrics: RawApplicantMetrics;
  readonly normalized: NormalizedScores;
  readonly weightedPoints: WeightedPoints;
  readonly compositeScore: number;
  readonly recommendation: 'Recommended for Award' | 'Waitlisted' | 'Flagged Hold';
  readonly decision: PersistedMcdaDecision | null;
}

export interface ScoringApplicationInput {
  readonly id: number;
  readonly referenceNumber: string;
  readonly studentId: string;
  readonly lastName: string;
  readonly givenName: string;
  readonly middleName: string | null;
  readonly college: string;
  readonly course: string;
  readonly status: string;
  readonly createdAt: Date;
  readonly householdInfo: unknown;
  readonly parentGuardianInfo: unknown;
  readonly householdMembers: unknown;
  readonly academicInfo: unknown;
  readonly specialCircumstances: unknown;
  readonly flags?: ReadonlyArray<{ readonly matchReason: string; readonly isResolved: boolean }>;
  readonly mcdaDecision?: {
    readonly decision: string;
    readonly remarks: string;
    readonly trackKey: string;
    readonly compositeScore: number;
    readonly decidedAt: Date;
  } | null;
}

export const DEFAULT_MCDA_TRACKS: Readonly<Record<Exclude<McdaTrackKey, 'custom'>, McdaTrackDefinition>> = {
  'needs-based': {
    key: 'needs-based',
    label: 'Needs-Based / Equity',
    description: 'Prioritizes socio-economic need, household dependency, and affirmative-action sectors.',
    weights: {
      gwaWeight: 10,
      incomeWeight: 45,
      householdWeight: 15,
      priorityWeight: 30,
    },
  },
  merit: {
    key: 'merit',
    label: 'Merit / Academic',
    description: 'Emphasizes General Weighted Average (GWA) with moderate socio-economic weighting.',
    weights: {
      gwaWeight: 60,
      incomeWeight: 20,
      householdWeight: 10,
      priorityWeight: 10,
    },
  },
  balanced: {
    key: 'balanced',
    label: 'Balanced Composite',
    description: 'Balances academic standing and financial need across all four evaluation criteria.',
    weights: {
      gwaWeight: 35,
      incomeWeight: 30,
      householdWeight: 15,
      priorityWeight: 20,
    },
  },
};

const parseJsonObject = (value: unknown): Record<string, unknown> => {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const parseJsonArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const isAffirmative = (val: unknown): boolean => {
  if (val === true) return true;
  if (typeof val === 'string') {
    const normalized = val.trim().toLowerCase();
    return normalized === 'yes' || normalized === 'true' || normalized === '1';
  }
  return false;
};

/**
 * Parses household monthly income from form bracket labels or raw numeric values into PHP.
 */
export const parseMonthlyIncome = (rawValue: unknown): number => {
  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    return Math.max(0, rawValue);
  }
  if (!rawValue) return 20000;

  const str = String(rawValue).toLowerCase().trim();
  if (!str) return 20000;

  if (str.includes('no income')) return 0;
  if (str.includes('less than') || str.includes('< 10') || str.includes('< 11')) return 8000;
  if (str.includes('11,000') || str.includes('21,999') || str.includes('11000')) return 16500;
  if (str.includes('22,000') || str.includes('43,999') || str.includes('22000')) return 33000;
  if (str.includes('44,000') || str.includes('76,999') || str.includes('44000')) return 60000;
  if (str.includes('77,000') || str.includes('131,999') || str.includes('77000')) return 104000;
  if (str.includes('132,000') || str.includes('219,999') || str.includes('132000')) return 175000;
  if (str.includes('220,000') || str.includes('above')) return 250000;

  const matches = str.match(/\d[\d,]*(?:\.\d+)?/g);
  if (matches && matches.length > 0) {
    const parsedNums = matches
      .map((m) => Number.parseFloat(m.replace(/,/g, '')))
      .filter((n) => Number.isFinite(n));
    const first = parsedNums[0];
    const second = parsedNums[1];
    if (first !== undefined && second !== undefined) {
      return Math.round((first + second) / 2);
    }
    if (first !== undefined) {
      return Math.max(0, first);
    }
  }

  return 20000;
};

/**
 * Parses GWA on the Philippine 1.00 (highest) to 5.00 (lowest) scale and inverts it for SAW benefit scoring.
 */
export const parseGwa = (rawGwa: unknown): { gwa: number | null; gwaInverted: number } => {
  if (rawGwa === null || rawGwa === undefined || rawGwa === '') {
    return { gwa: null, gwaInverted: 2.5 };
  }
  const num = Number.parseFloat(String(rawGwa).trim());
  if (!Number.isFinite(num) || num <= 0) {
    return { gwa: null, gwaInverted: 2.5 };
  }

  // Handle percentage-style grades (e.g. 92 -> approx 1.50) if encountered
  const normalizedGwa = num > 5 ? Math.max(1, Math.min(5, 5 - ((num - 75) / 25) * 4)) : Math.max(1, Math.min(5, num));
  const roundedGwa = Math.round(normalizedGwa * 100) / 100;
  const gwaInverted = Math.round(Math.max(0, Math.min(4, 5 - roundedGwa)) * 1000) / 1000;

  return { gwa: roundedGwa, gwaInverted };
};

export const extractApplicantMetrics = (app: ScoringApplicationInput): RawApplicantMetrics => {
  const academic = parseJsonObject(app.academicInfo);
  const household = parseJsonObject(app.householdInfo);
  const parentGuardian = parseJsonObject(app.parentGuardianInfo);
  const special = parseJsonObject(app.specialCircumstances);
  const membersArr = parseJsonArray(app.householdMembers);

  const { gwa, gwaInverted } = parseGwa(academic.previousGwa);

  const father = parseJsonObject(parentGuardian.father);
  const mother = parseJsonObject(parentGuardian.mother);
  const rawIncome = household.monthlyIncome || father.monthlyIncome || mother.monthlyIncome;
  const monthlyIncome = parseMonthlyIncome(rawIncome);

  const parsedMembers = Number.parseInt(String(household.totalMembers ?? ''), 10);
  const householdSize =
    Number.isFinite(parsedMembers) && parsedMembers > 0
      ? parsedMembers
      : Math.max(1, membersArr.length + 1);

  let priorityPoints = 0;
  const priorityTags: string[] = [];

  const govAssistance = String(household.govAssistance ?? '').toLowerCase();
  if (isAffirmative(special.isIndigent) || govAssistance.includes('4ps')) {
    priorityPoints += 35;
    priorityTags.push('Indigent / 4Ps');
  }
  if (isAffirmative(special.isPwd)) {
    priorityPoints += 25;
    priorityTags.push('PWD');
  }
  if (isAffirmative(special.isSoloParent)) {
    priorityPoints += 20;
    priorityTags.push('Solo Parent');
  }
  if (isAffirmative(special.isIp)) {
    priorityPoints += 15;
    priorityTags.push('Indigenous Peoples');
  }
  if (isAffirmative(special.isAthleteArtist)) {
    priorityPoints += 10;
    priorityTags.push('Sports & Arts');
  }

  return {
    gwa,
    gwaInverted,
    monthlyIncome,
    householdSize,
    priorityPoints: Math.min(100, priorityPoints),
    priorityTags,
  };
};

export const validateWeights = (weights: McdaWeights): { valid: boolean; error?: string } => {
  const values = [
    weights.gwaWeight,
    weights.incomeWeight,
    weights.householdWeight,
    weights.priorityWeight,
  ];

  if (values.some((w) => typeof w !== 'number' || !Number.isFinite(w) || w < 0 || w > 100)) {
    return { valid: false, error: 'Each weight must be a finite number between 0 and 100.' };
  }

  const total = values.reduce((acc, w) => acc + w, 0);
  if (Math.abs(total - 100) > 0.01) {
    return { valid: false, error: `Weights must sum to 100%. Current total: ${total.toFixed(2)}%.` };
  }

  return { valid: true };
};

const normalizeBenefit = (value: number, min: number, max: number): number => {
  if (max === min) {
    return value > 0 ? 1 : 0;
  }
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

const normalizeCost = (value: number, min: number, max: number): number => {
  if (max === min) {
    return 1;
  }
  return Math.max(0, Math.min(1, (max - value) / (max - min)));
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Computes SAW rankings for all eligible applicants and assigns quota recommendations.
 */
export const computeMcdaRankings = (
  applications: ReadonlyArray<ScoringApplicationInput>,
  weights: McdaWeights,
  quota: number
): {
  rankings: RankedApplicant[];
  flaggedHold: RankedApplicant[];
  summary: {
    totalEvaluated: number;
    recommendedCount: number;
    waitlistedCount: number;
    flaggedCount: number;
    averageScore: number;
  };
} => {
  const safeQuota = Math.max(1, Math.floor(quota));

  const enriched = applications.map((app) => {
    const unresolvedFlags = (app.flags ?? []).filter((f) => !f.isResolved);
    const isFlagged = app.status === 'Flagged' || unresolvedFlags.length > 0;
    const flagReasons = unresolvedFlags.map((f) => f.matchReason);
    if (isFlagged && flagReasons.length === 0) {
      flagReasons.push('Flagged for cross-reference verification');
    }

    const fullName = `${app.lastName}, ${app.givenName}${app.middleName ? ` ${app.middleName[0]}.` : ''}`.trim();
    const metrics = extractApplicantMetrics(app);

    return {
      app,
      fullName,
      isFlagged,
      flagReasons,
      metrics,
    };
  });

  const qualified = enriched.filter((item) => !item.isFlagged);
  const flaggedItems = enriched.filter((item) => item.isFlagged);

  // Compute min/max bounds across the qualified cohort (fallback to full cohort if none qualified)
  const boundsPool = qualified.length > 0 ? qualified : enriched;

  const gwaValues = boundsPool.map((i) => i.metrics.gwaInverted);
  const incomeValues = boundsPool.map((i) => i.metrics.monthlyIncome);
  const householdValues = boundsPool.map((i) => i.metrics.householdSize);
  const priorityValues = boundsPool.map((i) => i.metrics.priorityPoints);

  const bounds = {
    gwaMin: gwaValues.length ? Math.min(...gwaValues) : 0,
    gwaMax: gwaValues.length ? Math.max(...gwaValues) : 4,
    incomeMin: incomeValues.length ? Math.min(...incomeValues) : 0,
    incomeMax: incomeValues.length ? Math.max(...incomeValues) : 100000,
    householdMin: householdValues.length ? Math.min(...householdValues) : 1,
    householdMax: householdValues.length ? Math.max(...householdValues) : 10,
    priorityMin: priorityValues.length ? Math.min(...priorityValues) : 0,
    priorityMax: priorityValues.length ? Math.max(...priorityValues) : 100,
  };

  const scoreItem = (item: (typeof enriched)[number]) => {
    const normalized: NormalizedScores = {
      gwa: round2(normalizeBenefit(item.metrics.gwaInverted, bounds.gwaMin, bounds.gwaMax)),
      income: round2(normalizeCost(item.metrics.monthlyIncome, bounds.incomeMin, bounds.incomeMax)),
      household: round2(normalizeBenefit(item.metrics.householdSize, bounds.householdMin, bounds.householdMax)),
      priority: round2(normalizeBenefit(item.metrics.priorityPoints, bounds.priorityMin, bounds.priorityMax)),
    };

    const gwaRaw = normalizeBenefit(item.metrics.gwaInverted, bounds.gwaMin, bounds.gwaMax);
    const incomeRaw = normalizeCost(item.metrics.monthlyIncome, bounds.incomeMin, bounds.incomeMax);
    const householdRaw = normalizeBenefit(item.metrics.householdSize, bounds.householdMin, bounds.householdMax);
    const priorityRaw = normalizeBenefit(item.metrics.priorityPoints, bounds.priorityMin, bounds.priorityMax);

    const weightedPoints: WeightedPoints = {
      gwa: round2(weights.gwaWeight * gwaRaw),
      income: round2(weights.incomeWeight * incomeRaw),
      household: round2(weights.householdWeight * householdRaw),
      priority: round2(weights.priorityWeight * priorityRaw),
    };

    const compositeScore = round2(
      weights.gwaWeight * gwaRaw +
        weights.incomeWeight * incomeRaw +
        weights.householdWeight * householdRaw +
        weights.priorityWeight * priorityRaw
    );

    const decision: PersistedMcdaDecision | null = item.app.mcdaDecision
      ? {
          decision: item.app.mcdaDecision.decision,
          remarks: item.app.mcdaDecision.remarks,
          trackKey: item.app.mcdaDecision.trackKey,
          compositeScore: item.app.mcdaDecision.compositeScore,
          decidedAt: item.app.mcdaDecision.decidedAt.toISOString(),
        }
      : null;

    return {
      ...item,
      normalized,
      weightedPoints,
      compositeScore,
      decision,
    };
  };

  const scoredQualified = qualified
    .map(scoreItem)
    .sort((a, b) => {
      if (b.compositeScore !== a.compositeScore) return b.compositeScore - a.compositeScore;
      if (a.metrics.monthlyIncome !== b.metrics.monthlyIncome) {
        return a.metrics.monthlyIncome - b.metrics.monthlyIncome;
      }
      if (b.metrics.gwaInverted !== a.metrics.gwaInverted) {
        return b.metrics.gwaInverted - a.metrics.gwaInverted;
      }
      return a.app.createdAt.getTime() - b.app.createdAt.getTime();
    });

  const rankings: RankedApplicant[] = scoredQualified.map((item, idx) => {
    const rank = idx + 1;
    return {
      rank,
      applicationId: item.app.id,
      referenceNumber: item.app.referenceNumber,
      studentId: item.app.studentId,
      fullName: item.fullName,
      college: item.app.college,
      course: item.app.course,
      status: item.app.status,
      isFlagged: false,
      flagReasons: [],
      metrics: item.metrics,
      normalized: item.normalized,
      weightedPoints: item.weightedPoints,
      compositeScore: item.compositeScore,
      recommendation: rank <= safeQuota ? 'Recommended for Award' : 'Waitlisted',
      decision: item.decision,
    };
  });

  const flaggedHold: RankedApplicant[] = flaggedItems.map(scoreItem).map((item, idx) => ({
    rank: idx + 1,
    applicationId: item.app.id,
    referenceNumber: item.app.referenceNumber,
    studentId: item.app.studentId,
    fullName: item.fullName,
    college: item.app.college,
    course: item.app.course,
    status: item.app.status,
    isFlagged: true,
    flagReasons: item.flagReasons,
    metrics: item.metrics,
    normalized: item.normalized,
    weightedPoints: item.weightedPoints,
    compositeScore: item.compositeScore,
    recommendation: 'Flagged Hold',
    decision: item.decision,
  }));

  const recommendedCount = rankings.filter((r) => r.recommendation === 'Recommended for Award').length;
  const waitlistedCount = rankings.length - recommendedCount;
  const averageScore =
    rankings.length > 0
      ? round2(rankings.reduce((sum, r) => sum + r.compositeScore, 0) / rankings.length)
      : 0;

  return {
    rankings,
    flaggedHold,
    summary: {
      totalEvaluated: rankings.length,
      recommendedCount,
      waitlistedCount,
      flaggedCount: flaggedHold.length,
      averageScore,
    },
  };
};
