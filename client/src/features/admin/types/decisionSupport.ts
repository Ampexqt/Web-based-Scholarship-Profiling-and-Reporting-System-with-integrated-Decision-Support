export type McdaTrackKey = 'needs-based' | 'merit' | 'balanced' | 'custom'

export interface McdaWeights {
  gwaWeight: number
  incomeWeight: number
  householdWeight: number
  priorityWeight: number
}

export interface McdaTrackOption {
  key: McdaTrackKey
  label: string
  description: string
  isActive: boolean
  weights: McdaWeights
  updatedAt: string | null
}

export interface RankedApplicant {
  rank: number
  applicationId: number
  referenceNumber: string
  studentId: string
  fullName: string
  college: string
  course: string
  status: string
  isFlagged: boolean
  flagReasons: string[]
  metrics: {
    gwa: number | null
    gwaInverted: number
    monthlyIncome: number
    householdSize: number
    priorityPoints: number
    priorityTags: string[]
  }
  normalized: {
    gwa: number
    income: number
    household: number
    priority: number
  }
  weightedPoints: {
    gwa: number
    income: number
    household: number
    priority: number
  }
  compositeScore: number
  recommendation: 'Recommended for Award' | 'Waitlisted' | 'Flagged Hold'
  decision: {
    decision: string
    remarks: string
    trackKey: string
    compositeScore: number
    decidedAt: string
  } | null
}

export interface McdaRankingsResponse {
  success: boolean
  track: {
    key: McdaTrackKey
    label: string
  }
  quota: number
  weights: McdaWeights
  summary: {
    totalEvaluated: number
    recommendedCount: number
    waitlistedCount: number
    flaggedCount: number
    averageScore: number
  }
  rankings: RankedApplicant[]
  flaggedHold: RankedApplicant[]
}

export interface McdaWeightsResponse {
  success: boolean
  activeTrack: McdaTrackKey
  activeWeights: McdaWeights
  tracks: McdaTrackOption[]
}

export interface OfficialUploadRecord {
  id: number
  fileName: string
  uploadDate: string
  recordCount: number
}

export interface FlaggedApplicationRecord {
  id: number
  dateFlagged: string
  matchReason: string
  application: {
    id?: number
    referenceNumber: string
    lastName: string
    givenName: string
  }
  officialRecord: {
    listReference?: string | null
    scholarshipProgram: string
  }
}
