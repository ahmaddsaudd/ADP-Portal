import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdpScheme } from '../adp-schemes/entities/adp-scheme.entity';
import {
  AdpApprovalStatus,
  AdpExecutionStatus,
  AdpSchemeStep,
  AdpWorkflowStage,
  AdpWorkflowStep,
} from '../common/enums/enums';
import { PipelineColumnConfig, PipelineTab, UNAPPROVED_PIPELINE_COLUMNS } from './types/dashboard.types';
import { filter } from 'rxjs';
import { AdpSchemeComment } from 'src/adp-schemes/entities/adp-scheme-comment.entity';
import { GlobalMonthlyFinancialRow, GlobalMonthlyFinancialsResponse, GlobalPhysicalProgressResponse } from './types/reports.type';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(AdpScheme)
    private readonly adpSchemeRepository: Repository<AdpScheme>,

    @InjectRepository(AdpSchemeComment)
    private readonly commentRepository: Repository<AdpSchemeComment>,
  ) { }

  async getOverview() {
    const schemes = await this.adpSchemeRepository.find();

    const totalSchemes = schemes.length;

    const totalAllocationCfy = schemes.reduce(
      (sum, scheme: any) => sum + Number(scheme.totalAllocationCfy ?? 0),
      0,
    );

    const totalReleasesCfy = schemes.reduce(
      (sum, scheme: any) => sum + Number(scheme.totalReleasesCfy ?? 0),
      0,
    );

    const totalExpenditureCfy = schemes.reduce(
      (sum, scheme: any) => sum + Number(scheme.totalExpenditureCfy ?? 0),
      0,
    );

    const approvedSchemes = schemes.filter(
      (scheme) => scheme.approvalStatus === AdpApprovalStatus.APPROVED,
    );

    const underRevisionSchemes = schemes.filter(
      (scheme) => scheme.approvalStatus === AdpApprovalStatus.UNDER_REVISION,
    );

    const unapprovedSchemes = schemes.filter(
      (scheme) =>
        scheme.approvalStatus === AdpApprovalStatus.DRAFT ||
        scheme.approvalStatus === AdpApprovalStatus.UNAPPROVED,
    );

    const stalledSchemes = schemes
      .filter((scheme) => this.isStalledScheme(scheme))
      .slice(0, 10)
      .map((scheme) => ({
        id: scheme.id,
        adpNo: scheme.adpNo,
        schemeName: scheme.schemeName,
        approvalStatus: scheme.approvalStatus,
        pendingWith: this.getPendingWithFromStep(scheme.currentStep),
        currentStage: scheme.currentStage,
        currentStep: scheme.currentStep,
      }));

    return {
      summary: {
        totalSchemes,
        totalAllocationCfy,
        totalReleasesCfy,
        totalExpenditureCfy,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      breakdown: {
        approved: {
          total: approvedSchemes.length,
          onTrackOrContinue: approvedSchemes.filter(
            (scheme) => scheme.executionStatus !== AdpExecutionStatus.UNSATISFACTORY,
          ).length,
          unsatisfactory: approvedSchemes.filter(
            (scheme) => scheme.executionStatus === AdpExecutionStatus.UNSATISFACTORY,
          ).length,
        },
        underRevision: {
          total: underRevisionSchemes.length,
          standardProcessing: underRevisionSchemes.filter(
            (scheme) => scheme.executionStatus !== AdpExecutionStatus.UNSATISFACTORY,
          ).length,
          unsatisfactory: underRevisionSchemes.filter(
            (scheme) => scheme.executionStatus === AdpExecutionStatus.UNSATISFACTORY,
          ).length,
        },
        unapproved: {
          total: unapprovedSchemes.length,
          proposedDrafts: unapprovedSchemes.filter(
            (scheme) =>
              scheme.currentStep === AdpWorkflowStep.SUBMIT_PROPOSAL ||
              scheme.currentStep === AdpWorkflowStep.REVIEW_AND_ROUTE ||
              scheme.currentStep === AdpWorkflowStep.SUBMIT_FOR_ENDORSEMENT,
          ).length,
          formulatingPc1: unapprovedSchemes.filter(
            (scheme) =>
              scheme.currentStep === AdpWorkflowStep.CREATE_ADP_DRAFT ||
              scheme.currentStep === AdpWorkflowStep.PND_FEEDBACK ||
              scheme.currentStep === AdpWorkflowStep.REVISE_DRAFT ||
              scheme.currentStep === AdpWorkflowStep.INITIATE_PC1 ||
              scheme.currentStep === AdpWorkflowStep.MODULE_A_COSTS ||
              scheme.currentStep === AdpWorkflowStep.MODULE_B_COSTS,
          ).length,
        },
      },
      stalledSchemes,
    };
  }

  async getPipelineBoard(tab: PipelineTab) {
    const schemes = await this.adpSchemeRepository.find({
      order: {
        updatedAt: 'DESC',
      },
    });
    const filteredSchemes = schemes.filter(
      (scheme) => this.getPipelineTab(scheme) === tab,
    );

    const columnsConfig =
      tab === 'UNDER_REVISION'
        ? this.getUnderRevisionColumns()
        : UNAPPROVED_PIPELINE_COLUMNS;

    const columns = columnsConfig.map((column) => {
      const items = filteredSchemes
        .filter((scheme) => column.steps.includes(scheme.currentStep))
        .map((scheme) => ({
          id: scheme.id,
          adpNo: scheme.adpNo,
          schemeName: scheme.schemeName,
          district: scheme.district,
          sector: scheme.sector,
          approvalStatus: scheme.approvalStatus,
          executionStatus: scheme.executionStatus,
          currentStage: scheme.currentStage,
          currentStep: scheme.currentStep,
          pendingWith: this.getPendingWithFromStep(scheme.currentStep),
          isStalled:
            scheme.executionStatus === AdpExecutionStatus.UNSATISFACTORY,
          currentStepUpdatedAt: scheme.currentStepUpdatedAt,
          updatedAt: scheme.updatedAt,
        }));

      return {
        key: column.key,
        title: column.title,
        count: items.length,
        items,
      };
    });

    return {
      tab,
      columns,
    };
  }

  async getGlobalMonthlyFinancials(): Promise<GlobalMonthlyFinancialsResponse> {
    const schemes = await this.adpSchemeRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    const rows: GlobalMonthlyFinancialRow[] = schemes.map((scheme) => ({
      id: scheme.id,
      adpNo: scheme.adpNo,
      schemeName: scheme.schemeName,
      monthly: {
        jul: { rel: null, exp: null },
        aug: { rel: null, exp: null },
        sep: { rel: null, exp: null },
        oct: { rel: null, exp: null },
        nov: { rel: null, exp: null },
        dec: { rel: null, exp: null },
        jan: { rel: null, exp: null },
        feb: { rel: null, exp: null },
        mar: { rel: null, exp: null },
        apr: { rel: null, exp: null },
        may: { rel: null, exp: null },
        jun: { rel: null, exp: null },
      },
      totalCfy: {
        rel: 0,
        exp: 0,
      },
    }));

    return { rows };
  }

  async getGlobalPhysicalProgress(): Promise<GlobalPhysicalProgressResponse> {
    const schemes = await this.adpSchemeRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    const comments = await this.commentRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['adpScheme'],
    });

    const latestCommentBySchemeId = new Map<string, AdpSchemeComment>();

    for (const comment of comments) {
      const schemeId =
        (comment as any).adpScheme?.id ||
        (comment as any).adpSchemeId ||
        (comment as any).schemeId;

      if (schemeId && !latestCommentBySchemeId.has(schemeId)) {
        latestCommentBySchemeId.set(schemeId, comment);
      }
    }

    const rows = schemes.map((scheme) => {
      const latestComment = latestCommentBySchemeId.get(scheme.id);
      const completionPercentage = this.getCompletionPercentageFromStep(
        scheme.currentStep,
      );

      return {
        id: scheme.id,
        adpNo: scheme.adpNo,
        schemeName: scheme.schemeName,
        sector: scheme.sector,
        approvalStatus: this.humanizeEnum(scheme.approvalStatus),
        executionStatus: scheme.executionStatus,
        completionPercentage,
        latestPhysicalRemark: latestComment
          ? this.extractCommentText(latestComment)
          : null,
        updatedBy: latestComment ? this.extractUpdatedBy(latestComment) : null,
        updatedAt: latestComment
          ? this.formatDate(latestComment.createdAt)
          : null,
      };
    });

    return { rows };
  }

  private getCompletionPercentageFromStep(step: AdpWorkflowStep): number {
    const totalSteps = 7;
    const completedSteps = this.getCompletedVisualStepsCount(step);

    return Math.round((completedSteps / totalSteps) * 100);
  }

  private getCompletedVisualStepsCount(step: AdpWorkflowStep): number {
    switch (step) {
      case AdpWorkflowStep.SUBMIT_PROPOSAL:
      case AdpWorkflowStep.REVIEW_AND_ROUTE:
      case AdpWorkflowStep.SUBMIT_FOR_ENDORSEMENT:
      case AdpWorkflowStep.ENDORSE:
      case AdpWorkflowStep.CREATE_ADP_DRAFT:
      case AdpWorkflowStep.PND_FEEDBACK:
      case AdpWorkflowStep.REVISE_DRAFT:
        return 0;

      case AdpWorkflowStep.MODULE_A_COSTS:
        return 1;

      case AdpWorkflowStep.MODULE_B_COSTS:
        return 2;

      case AdpWorkflowStep.INTERNAL_SCRUTINY:
        return 3;

      case AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL:
        return 4;

      case AdpWorkflowStep.ISSUE_NOC:
        return 5;

      case AdpWorkflowStep.AUTH_LETTER_TO_FINANCE:
      case AdpWorkflowStep.RELEASE_FUNDS:
      case AdpWorkflowStep.UPDATE_FUND_RELEASE_STATUS:
        return 6;

      case AdpWorkflowStep.COMPLETED:
        return 7;

      default:
        return 0;
    }
  }

  private extractCommentText(comment: AdpSchemeComment): string | null {
    const anyComment = comment as any;
    return (
      anyComment.comment ||
      anyComment.remarks ||
      anyComment.text ||
      null
    );
  }

  private extractUpdatedBy(comment: AdpSchemeComment): string | null {
    const anyComment = comment as any;

    return (
      anyComment.createdByName ||
      anyComment.updatedByName ||
      anyComment.authorName ||
      null
    );
  }

  private humanizeEnum(value: string | null | undefined): string {
    if (!value) return '—';

    return value
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private formatDate(date?: Date | null): string | null {
    if (!date) return null;

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  private getPipelineTab(scheme: AdpScheme): PipelineTab | null {
    if (
      scheme.approvalStatus === AdpApprovalStatus.UNDER_REVISION ||
      scheme.executionStatus === AdpExecutionStatus.UNSATISFACTORY
    ) {
      return 'UNDER_REVISION';
    }

    if (
      scheme.approvalStatus === AdpApprovalStatus.DRAFT ||
      scheme.approvalStatus === AdpApprovalStatus.PENDING ||
      scheme.approvalStatus === AdpApprovalStatus.UNAPPROVED ||
      scheme.approvalStatus === AdpApprovalStatus.APPROVAL_PENDING
    ) {
      return 'UNAPPROVED';
    }

    return null;
  }

  private getPendingWithFromStep(step: AdpWorkflowStep): string {
    switch (step) {
      case AdpWorkflowStep.SUBMIT_PROPOSAL:
      case AdpWorkflowStep.REVIEW_AND_ROUTE:
      case AdpWorkflowStep.SUBMIT_FOR_ENDORSEMENT:
      case AdpWorkflowStep.CREATE_ADP_DRAFT:
      case AdpWorkflowStep.REVISE_DRAFT:
      case AdpWorkflowStep.MODULE_B_COSTS:
      case AdpWorkflowStep.INTERNAL_SCRUTINY:
      case AdpWorkflowStep.AUTH_LETTER_TO_FINANCE:
        return 'DEVELOPMENT_WING';

      case AdpWorkflowStep.MODULE_A_COSTS:
        return 'WORKS_AND_SERVICES';

      case AdpWorkflowStep.PND_FEEDBACK:
      case AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL:
      case AdpWorkflowStep.ISSUE_NOC:
        return 'PND_WING';

      case AdpWorkflowStep.RELEASE_FUNDS:
      case AdpWorkflowStep.UPDATE_FUND_RELEASE_STATUS:
        return 'FINANCE_DEPARTMENT';

      case AdpWorkflowStep.ENDORSE:
        return 'COMPETENT_AUTHORITY';

      default:
        return 'N/A';
    }
  }

  private getUnderRevisionColumns(): PipelineColumnConfig[] {
    return [
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
  }

  private isStalledScheme(scheme: AdpScheme): boolean {
    return (
      scheme.executionStatus === AdpExecutionStatus.UNSATISFACTORY ||
      scheme.approvalStatus === AdpApprovalStatus.UNDER_REVISION ||
      scheme.approvalStatus === AdpApprovalStatus.UNAPPROVED
    );
  }
}