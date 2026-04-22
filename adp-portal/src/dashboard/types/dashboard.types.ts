import { AdpWorkflowStep } from "src/common/enums/enums";

export type PipelineTab = 'UNAPPROVED' | 'UNDER_REVISION';

export type PipelineColumnConfig = {
    key: string;
    title: string;
    steps: AdpWorkflowStep[];
};

export const UNAPPROVED_PIPELINE_COLUMNS: PipelineColumnConfig[] = [
    {
        key: 'PROPOSAL_AND_FEASIBILITY',
        title: 'Proposal & Feasibility',
        steps: [
            AdpWorkflowStep.SUBMIT_PROPOSAL,
            AdpWorkflowStep.REVIEW_AND_ROUTE,
            AdpWorkflowStep.SUBMIT_FOR_ENDORSEMENT,
            AdpWorkflowStep.ENDORSE,
        ],
    },
    {
        key: 'ADP_DRAFTING',
        title: 'Final Approved ADP Draft',
        steps: [
            AdpWorkflowStep.CREATE_ADP_DRAFT,
            AdpWorkflowStep.PND_FEEDBACK,
            AdpWorkflowStep.REVISE_DRAFT,
        ],
    },
    {
        key: 'MODULE_A_COSTS',
        title: 'PC-1 Civil Work (Capital)',
        steps: [AdpWorkflowStep.MODULE_A_COSTS],
    },
    {
        key: 'MODULE_B_COSTS',
        title: 'PC-1 Machinery, Equipment (Revenue)',
        steps: [AdpWorkflowStep.MODULE_B_COSTS],
    },
    {
        key: 'INTERNAL_SCRUTINY',
        title: 'PC-1 Completion',
        steps: [AdpWorkflowStep.INTERNAL_SCRUTINY],
    },
    {
        key: 'DDWP_PRE_PDWP_PDWP_APPROVAL',
        title: 'Approval from DDWP/PDWP/CDWP',
        steps: [AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL],
    },
    {
        key: 'ISSUE_NOC',
        title: 'P&D NOC',
        steps: [AdpWorkflowStep.ISSUE_NOC],
    },
    {
        key: 'AUTH_LETTER_TO_FINANCE',
        title: 'Finance Dept Administrative Approval',
        steps: [AdpWorkflowStep.AUTH_LETTER_TO_FINANCE],
    },
];

export const UNDER_REVISION_PIPELINE_COLUMNS: PipelineColumnConfig[] = [
    {
        key: 'MODULE_A_COSTS_REVISION',
        title: 'Modified PC-1 Civil Work (Capital)',
        steps: [AdpWorkflowStep.MODULE_A_COSTS],
    },
    {
        key: 'MODULE_B_COSTS_REVISION',
        title: 'Modified PC-1 Machinery, Equipment',
        steps: [AdpWorkflowStep.MODULE_B_COSTS],
    },
    {
        key: 'INTERNAL_SCRUTINY_REVISION',
        title: 'Modified PC-1 Completion',
        steps: [AdpWorkflowStep.INTERNAL_SCRUTINY],
    },
    {
        key: 'DDWP_PRE_PDWP_PDWP_APPROVAL_REVISION',
        title: 'Re-Approval from DDWP/PDWP/CDWP',
        steps: [AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL],
    },
    {
        key: 'ISSUE_NOC_REVISION',
        title: 'P&D NOC (Revised)',
        steps: [AdpWorkflowStep.ISSUE_NOC],
    },
    {
        key: 'AUTH_LETTER_TO_FINANCE_REVISION',
        title: 'Finance Dept Approval (Revised)',
        steps: [AdpWorkflowStep.AUTH_LETTER_TO_FINANCE],
    },
];