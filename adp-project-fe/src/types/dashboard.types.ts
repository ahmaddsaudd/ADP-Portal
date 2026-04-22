export interface DashboardSummary {
  totalSchemes: number;
  totalAllocationCfy: number;
  totalReleasesCfy: number;
  totalExpenditureCfy: number;
  lastUpdated: string;
}

export interface ApprovedBreakdown {
  total: number;
  onTrackOrContinue: number;
  unsatisfactory: number;
}

export interface UnderRevisionBreakdown {
  total: number;
  standardProcessing: number;
  unsatisfactory: number;
}

export interface UnapprovedBreakdown {
  total: number;
  proposedDrafts: number;
  formulatingPc1: number;
}

export interface StalledScheme {
  id?: string;
  schemeName?: string;
  adpNo?: string;
  status?: string;
  pendingWith?: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  breakdown: {
    approved: ApprovedBreakdown;
    underRevision: UnderRevisionBreakdown;
    unapproved: UnapprovedBreakdown;
  };
  stalledSchemes: StalledScheme[];
}