export type StageStatus = "DONE" | "CURRENT" | "UPCOMING";

export type PipelineStageItem = {
  key: string;
  title: string;
  status: StageStatus;
  completedDate?: string | null;
  pendingWith?: string | null;
};

export type PipelineSchemeDetail = {
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
  scopeOfScheme?: string | null;
  estimatedCost?: number;
  priorExpLastFy?: number;
  throwForward?: number;
  allocationCfy?: number;
  revAllocationCfy?: number;
  releasesCfy?: number;
  expenditureCfy?: number;
  statusNote?: string | null;
  pipelineStages: PipelineStageItem[];
};

export type PhysicalProgressRemark = {
  id: string;
  text: string;
  createdAt: string | null;
};

export type PhysicalProgressResponse = {
  overallCompletionPercentage: number;
  completedSteps: number;
  totalSteps: number;
  remarks: PhysicalProgressRemark[];
};

export type MonthlyFinancialRow = {
  month: string;
  releaseCap: number;
  releaseRev: number;
  expenditureCap: number;
  expenditureRev: number;
};

export type MonthlyFinancialsResponse = {
  months: MonthlyFinancialRow[];
  totals: {
    releaseCap: number;
    releaseRev: number;
    expenditureCap: number;
    expenditureRev: number;
  };
};

export type GalleryItem = {
  id: string;
  imageUrl: string;
  uploadedBy: string;
  uploadedAt: string | null;
  caption: string | null;
};

export type GalleryResponse = {
  items: GalleryItem[];
};