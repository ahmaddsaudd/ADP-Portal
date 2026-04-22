export type PipelineStageStatus = 'DONE' | 'CURRENT' | 'UPCOMING';

export type PipelineStageItem = {
  key: string;
  title: string;
  status: PipelineStageStatus;
  completedDate?: string | null;
  pendingWith?: string | null;
};

export type PipelineRemarkItem = {
  id: string;
  text: string;
  createdAt: string | null;
};

export type PipelineGalleryItem = {
  id: string;
  imageUrl: string;
  uploadedAt: string | null;
  uploadedBy: string;
};

export type MonthlyFinancialRow = {
  month: string;
  releaseCap: number;
  releaseRev: number;
  expenditureCap: number;
  expenditureRev: number;
};

export type PipelineDetailResponse = {
  id: string;
  adpNo: string;
  schemeName: string;
  district: string | null;
  sector: string | null;
  type: string | null;
  subType: string | null;
  approvalStatus: string;
  executionStatus: string;
  initialApprovalDate: string | null;
  targetDate: string | null;

  scopeOfScheme: string | null;
  statusNote: string | null;
  physicalProgressPercentage: number;

  estimatedCost: number;
  priorExpLastFy: number;
  throwForward: number;
  allocationCfy: number;
  revAllocationCfy: number;
  releasesCfy: number;
  expenditureCfy: number;

  pipelineStages: PipelineStageItem[];
  remarks: PipelineRemarkItem[];
  gallery: PipelineGalleryItem[];
  monthlyFinancials: {
    months: MonthlyFinancialRow[];
    totals: {
      releaseCap: number;
      releaseRev: number;
      expenditureCap: number;
      expenditureRev: number;
    };
  };
};