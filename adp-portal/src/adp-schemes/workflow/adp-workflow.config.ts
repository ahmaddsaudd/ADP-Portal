import { AdpWorkflowStage, AdpWorkflowStep, UserRole } from "src/common/enums/enums";


export const ADP_WORKFLOW_MAP: Record<
  AdpWorkflowStep,
  {
    nextStep: AdpWorkflowStep;
    nextStage: AdpWorkflowStage;
    allowedRoles: UserRole[];
  }
> = {
  [AdpWorkflowStep.SUBMIT_PROPOSAL]: {
    nextStep: AdpWorkflowStep.REVIEW_AND_ROUTE,
    nextStage: AdpWorkflowStage.PROPOSAL_AND_FEASIBILITY,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.REVIEW_AND_ROUTE]: {
    nextStep: AdpWorkflowStep.SUBMIT_FOR_ENDORSEMENT,
    nextStage: AdpWorkflowStage.PROPOSAL_AND_FEASIBILITY,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.SUBMIT_FOR_ENDORSEMENT]: {
    nextStep: AdpWorkflowStep.ENDORSE,
    nextStage: AdpWorkflowStage.PROPOSAL_AND_FEASIBILITY,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.ENDORSE]: {
    nextStep: AdpWorkflowStep.CREATE_ADP_DRAFT,
    nextStage: AdpWorkflowStage.ADP_DRAFTING,
    allowedRoles: [UserRole.COMPETENT_AUTHORITY],
  },

  [AdpWorkflowStep.CREATE_ADP_DRAFT]: {
    nextStep: AdpWorkflowStep.PND_FEEDBACK,
    nextStage: AdpWorkflowStage.ADP_DRAFTING,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.PND_FEEDBACK]: {
    nextStep: AdpWorkflowStep.REVISE_DRAFT,
    nextStage: AdpWorkflowStage.ADP_DRAFTING,
    allowedRoles: [UserRole.PND_WING],
  },

  [AdpWorkflowStep.REVISE_DRAFT]: {
    nextStep: AdpWorkflowStep.INITIATE_PC1,
    nextStage: AdpWorkflowStage.PC1_COSTING,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.INITIATE_PC1]: {
    nextStep: AdpWorkflowStep.MODULE_A_COSTS,
    nextStage: AdpWorkflowStage.PC1_COSTING,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.MODULE_A_COSTS]: {
    nextStep: AdpWorkflowStep.MODULE_B_COSTS,
    nextStage: AdpWorkflowStage.PC1_COSTING,
    allowedRoles: [UserRole.WORKS_AND_SERVICES],
  },

  [AdpWorkflowStep.MODULE_B_COSTS]: {
    nextStep: AdpWorkflowStep.INTERNAL_SCRUTINY,
    nextStage: AdpWorkflowStage.SCRUTINY,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.INTERNAL_SCRUTINY]: {
    nextStep: AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL,
    nextStage: AdpWorkflowStage.SCRUTINY,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL]: {
    nextStep: AdpWorkflowStep.ISSUE_NOC,
    nextStage: AdpWorkflowStage.PND_AND_APPROVALS,
    allowedRoles: [UserRole.PND_WING],
  },

  [AdpWorkflowStep.ISSUE_NOC]: {
    nextStep: AdpWorkflowStep.AUTH_LETTER_TO_FINANCE,
    nextStage: AdpWorkflowStage.PND_AND_APPROVALS,
    allowedRoles: [UserRole.PND_WING],
  },

  [AdpWorkflowStep.AUTH_LETTER_TO_FINANCE]: {
    nextStep: AdpWorkflowStep.RELEASE_FUNDS,
    nextStage: AdpWorkflowStage.FINANCE_RELEASE,
    allowedRoles: [UserRole.DEVELOPMENT_WING],
  },

  [AdpWorkflowStep.RELEASE_FUNDS]: {
    nextStep: AdpWorkflowStep.UPDATE_FUND_RELEASE_STATUS,
    nextStage: AdpWorkflowStage.FINANCE_RELEASE,
    allowedRoles: [UserRole.FINANCE_DEPARTMENT],
  },

  [AdpWorkflowStep.UPDATE_FUND_RELEASE_STATUS]: {
    nextStep: AdpWorkflowStep.COMPLETED,
    nextStage: AdpWorkflowStage.COMPLETED,
    allowedRoles: [UserRole.FINANCE_DEPARTMENT],
  },

  [AdpWorkflowStep.COMPLETED]: {
    nextStep: AdpWorkflowStep.COMPLETED,
    nextStage: AdpWorkflowStage.COMPLETED,
    allowedRoles: [],
  },
};