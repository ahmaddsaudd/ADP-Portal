export type PipelineTab = 'UNAPPROVED' | 'UNDER_REVISION';

export type PipelineItem = {
  id: string;
  adpNo: string;
  schemeName: string;
  district: string | null;
  sector: string | null;
  approvalStatus: string;
  executionStatus: string;
  currentStage: string;
  currentStep: string;
  pendingWith: string;
  isStalled: boolean;
  currentStepUpdatedAt: string | null;
  updatedAt: string;
};

export type PipelineColumn = {
  key: string;
  title: string;
  count: number;
  items: PipelineItem[];
};

export type PipelineBoardResponse = {
  tab: PipelineTab;
  columns: PipelineColumn[];
};