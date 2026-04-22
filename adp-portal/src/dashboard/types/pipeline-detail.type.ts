export type PipelineStageStatus = 'DONE' | 'CURRENT' | 'UPCOMING';

export type PipelineStageItem = {
  key: string;
  title: string;
  status: PipelineStageStatus;
  completedDate?: string | null;
  pendingWith?: string | null;
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
  estimatedCost: number;
  priorExpLastFy: number;
  throwForward: number;
  allocationCfy: number;
  revAllocationCfy: number;
  releasesCfy: number;
  expenditureCfy: number;

  statusNote: string | null;
  pipelineStages: PipelineStageItem[];
};