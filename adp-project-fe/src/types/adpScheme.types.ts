export interface AdpSchemeListItem {
  id: string;
  adpNo: string;
  schemeName: string;
  district?: string;
  sector?: string;
  type?: string;
  subType?: string;
  scope?: string;
  approvalStatus?: string;
  executionStatus?: string;
  initialApprovalDate?: string;
  targetDate?: string;

  estimatedCostCap?: number | string;
  estimatedCostRev?: number | string;
  estimatedCostTotal?: number | string;

  priorExpCap?: number | string;
  priorExpRev?: number | string;
  priorExpTotal?: number | string;

  throwForwardCap?: number | string;
  throwForwardRev?: number | string;
  throwForwardTotal?: number | string;

  allocCfyCap?: number | string;
  allocCfyRev?: number | string;
  allocCfyTotal?: number | string;

  revAllocCfyCap?: number | string;
  revAllocCfyRev?: number | string;
  revAllocCfyTotal?: number | string;

  releasesCfyCap?: number | string;
  releasesCfyRev?: number | string;
  releasesCfyTotal?: number | string;
}

export type AdpSchemeFormValues = {
  adpNo: string;
  schemeName: string;
  district: string;
  sector: string;
  type: string;
  subType: string;
  approvalStatus: string;
  executionStatus: string;
  initialApprovalDate: string;
  targetDate: string;
};

export type AdpSchemeCostingFormValues = {
  financialYear: string;
  estimatedCostCap: string;
  estimatedCostRev: string;
  priorExpCap: string;
  priorExpRev: string;
  throwForwardCap: string;
  throwForwardRev: string;
  allocCfyCap: string;
  allocCfyRev: string;
  revAllocCfyCap: string;
  revAllocCfyRev: string;
  releasesCfyCap: string;
  releasesCfyRev: string;
  moduleACap: string;
  moduleARev: string;
  moduleBCap: string;
  moduleBRev: string;
};

export interface AdpSchemeDocument {
  id: string;
  adpSchemeId: string;
  documentType: string;
  documentName: string;
  documentPath: string;
  mimeType: string;
  fileSize: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdpSchemeComment {
  id?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdpSchemeCosting {
  id: string;
  adpSchemeId: string;
  financialYear: string;

  estimatedCostCap: string;
  estimatedCostRev: string;
  estimatedCostTotal: string;

  priorExpCap: string;
  priorExpRev: string;
  priorExpTotal: string;

  throwForwardCap: string;
  throwForwardRev: string;
  throwForwardTotal: string;

  allocCfyCap: string;
  allocCfyRev: string;
  allocCfyTotal: string;

  revAllocCfyCap: string;
  revAllocCfyRev: string;
  revAllocCfyTotal: string;

  releasesCfyCap: string;
  releasesCfyRev: string;
  releasesCfyTotal: string;

  moduleACap: string;
  moduleARev: string;
  moduleATotal: string;

  moduleBCap: string;
  moduleBRev: string;
  moduleBTotal: string;

  createdAt: string;
  updatedAt: string;
}

export interface AdpSchemeDetail {
  id: string;
  adpNo: string;
  schemeName: string;
  district?: string;
  sector?: string;
  type?: string;
  subType?: string;
  approvalStatus?: string;
  executionStatus?: string;
  initialApprovalDate?: string;
  targetDate?: string;
  isActive: boolean;
  currentStage?: string;
  currentStep?: string;
  currentStepUpdatedAt?: string | null;
  workflowCompletedAt?: string | null;
  documents: AdpSchemeDocument[];
  comments: AdpSchemeComment[];
  costings: AdpSchemeCosting[];
  createdAt: string;
  updatedAt: string;
}