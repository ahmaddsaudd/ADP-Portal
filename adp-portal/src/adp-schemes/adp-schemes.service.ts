import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdpScheme } from './entities/adp-scheme.entity';
import { AdpSchemeCosting } from './entities/adp-scheme-costing.entity';
import { AdpSchemeComment } from './entities/adp-scheme-comment.entity';
import { AdpSchemeDocument } from './entities/adp-scheme-document.entity';
import { CreateAdpSchemeDto } from './dto/create-adp-scheme.dto';
import { UpdateAdpSchemeDto } from './dto/update-adp-scheme.dto';
import { CreateAdpSchemeCostingDto } from './dto/create-adp-scheme-costing.dto';
import { UpdateAdpSchemeCostingDto } from './dto/update-adp-scheme-costing.dto';
import { CreateAdpSchemeCommentDto } from './dto/create-adp-scheme-comment.dto';
import { CreateAdpSchemeDocumentDto } from './dto/create-adp-scheme-document.dto';
import { AdpSchemeDocumentType, AdpWorkflowStep } from 'src/common/enums/enums';
import { AdpSchemeWorkflowLog } from './entities/adp-scheme-workflow-log.entity';
import { MonthlyFinancialRow, PipelineDetailResponse, PipelineStageItem } from './types/pipeline-detail.type';
import { PhysicalProgressResponse } from './types/physical-progress.type';
import { MonthlyFinancialsResponse } from './types/montly-financials.type';
import { GalleryResponse } from './types/gallery.type';
import { UploadGalleryImageDto } from './dto/upload-gallery-image.dto';

@Injectable()
export class AdpSchemesService {
  constructor(
    @InjectRepository(AdpScheme)
    private readonly adpSchemeRepo: Repository<AdpScheme>,

    @InjectRepository(AdpSchemeCosting)
    private readonly costingRepo: Repository<AdpSchemeCosting>,

    @InjectRepository(AdpSchemeComment)
    private readonly commentRepo: Repository<AdpSchemeComment>,

    @InjectRepository(AdpSchemeDocument)
    private readonly documentRepo: Repository<AdpSchemeDocument>,

    @InjectRepository(AdpSchemeWorkflowLog)
    private readonly adpSchemeWorkflowLogRepository: Repository<AdpSchemeWorkflowLog>,
  ) { }

  async create(createDto: CreateAdpSchemeDto) {
    const exists = await this.adpSchemeRepo.findOne({
      where: { adpNo: createDto.adpNo },
      select: ['id', 'adpNo'],
    });

    if (exists) {
      throw new BadRequestException('ADP number already exists');
    }

    const entity = this.adpSchemeRepo.create(createDto);
    return this.adpSchemeRepo.save(entity);
  }

  async findAll() {
    return this.adpSchemeRepo.find({
      order: { createdAt: 'DESC' },
      relations: {
        // documents: true,
        // comments: true,
        costings: true,
      },
    });
  }

  async findOne(id: string) {
    const scheme = await this.adpSchemeRepo.findOne({
      where: { id },
      relations: {
        documents: true,
        comments: true,
        costings: true,
      },
    });

    if (!scheme) throw new NotFoundException('ADP scheme not found');
    return scheme;
  }

  async update(id: string, updateDto: UpdateAdpSchemeDto) {
    const scheme = await this.adpSchemeRepo.findOne({ where: { id } });
    if (!scheme) throw new NotFoundException('ADP scheme not found');

    Object.assign(scheme, updateDto);
    return this.adpSchemeRepo.save(scheme);
  }

  async remove(id: string) {
    const scheme = await this.adpSchemeRepo.findOne({ where: { id } });
    if (!scheme) throw new NotFoundException('ADP scheme not found');

    await this.adpSchemeRepo.remove(scheme);
    return { message: 'ADP scheme deleted successfully' };
  }

  async createCosting(adpSchemeId: string, dto: CreateAdpSchemeCostingDto) {
    await this.ensureSchemeExists(adpSchemeId);

    const existing = await this.costingRepo.findOne({
      where: { adpSchemeId, financialYear: dto.financialYear },
    });

    if (existing) {
      throw new BadRequestException(
        `Costing already exists for scheme and financial year ${dto.financialYear}`,
      );
    }

    const entity = this.costingRepo.create({
      adpSchemeId,
      financialYear: dto.financialYear,
      estimatedCostCap: dto.estimatedCostCap ?? '0',
      estimatedCostRev: dto.estimatedCostRev ?? '0',
      estimatedCostTotal: this.sum(dto.estimatedCostCap, dto.estimatedCostRev),

      priorExpCap: dto.priorExpCap ?? '0',
      priorExpRev: dto.priorExpRev ?? '0',
      priorExpTotal: this.sum(dto.priorExpCap, dto.priorExpRev),

      throwForwardCap: dto.throwForwardCap ?? '0',
      throwForwardRev: dto.throwForwardRev ?? '0',
      throwForwardTotal: this.sum(dto.throwForwardCap, dto.throwForwardRev),

      allocCfyCap: dto.allocCfyCap ?? '0',
      allocCfyRev: dto.allocCfyRev ?? '0',
      allocCfyTotal: this.sum(dto.allocCfyCap, dto.allocCfyRev),

      revAllocCfyCap: dto.revAllocCfyCap ?? '0',
      revAllocCfyRev: dto.revAllocCfyRev ?? '0',
      revAllocCfyTotal: this.sum(dto.revAllocCfyCap, dto.revAllocCfyRev),

      releasesCfyCap: dto.releasesCfyCap ?? '0',
      releasesCfyRev: dto.releasesCfyRev ?? '0',
      releasesCfyTotal: this.sum(dto.releasesCfyCap, dto.releasesCfyRev),

      moduleACap: dto.moduleACap ?? '0',
      moduleARev: dto.moduleARev ?? '0',
      moduleATotal: this.sum(dto.moduleACap, dto.moduleARev),

      moduleBCap: dto.moduleBCap ?? '0',
      moduleBRev: dto.moduleBRev ?? '0',
      moduleBTotal: this.sum(dto.moduleBCap, dto.moduleBRev),
    });

    return this.costingRepo.save(entity);
  }

  async updateCosting(id: string, dto: UpdateAdpSchemeCostingDto) {
    const costing = await this.costingRepo.findOne({ where: { id } });
    if (!costing) throw new NotFoundException('Costing not found');

    Object.assign(costing, dto);

    costing.estimatedCostTotal = this.sum(costing.estimatedCostCap, costing.estimatedCostRev);
    costing.priorExpTotal = this.sum(costing.priorExpCap, costing.priorExpRev);
    costing.throwForwardTotal = this.sum(costing.throwForwardCap, costing.throwForwardRev);
    costing.allocCfyTotal = this.sum(costing.allocCfyCap, costing.allocCfyRev);
    costing.revAllocCfyTotal = this.sum(costing.revAllocCfyCap, costing.revAllocCfyRev);
    costing.releasesCfyTotal = this.sum(costing.releasesCfyCap, costing.releasesCfyRev);
    costing.moduleATotal = this.sum(costing.moduleACap, costing.moduleARev);
    costing.moduleBTotal = this.sum(costing.moduleBCap, costing.moduleBRev);

    return this.costingRepo.save(costing);
  }

  async addComment(adpSchemeId: string, dto: CreateAdpSchemeCommentDto) {
    await this.ensureSchemeExists(adpSchemeId);
    const entity = this.commentRepo.create({ ...dto, adpSchemeId });
    return this.commentRepo.save(entity);
  }

  async addDocument(
    adpSchemeId: string,
    dto: CreateAdpSchemeDocumentDto,
    file: Express.Multer.File,
  ) {
    await this.ensureSchemeExists(adpSchemeId);

    const entity = this.documentRepo.create({
      adpSchemeId,
      documentType: dto.documentType ?? AdpSchemeDocumentType.OTHER,
      documentName: dto.documentName,
      documentPath: file.path,
      mimeType: file.mimetype,
      fileSize: file.size,
      remarks: dto.remarks ?? null,
    });

    return this.documentRepo.save(entity);
  }

  async getPipelineDetail(id: string): Promise<PipelineDetailResponse> {
    const scheme = await this.adpSchemeRepo.findOne({
      where: { id },
    });

    if (!scheme) {
      throw new NotFoundException('ADP scheme not found');
    }

    const [comments, documents, costings, workflowLogs] = await Promise.all([
      this.commentRepo.find({
        where: {
          adpScheme: { id },
        } as any,
        order: { createdAt: 'DESC' },
      }),
      this.documentRepo.find({
        where: {
          adpScheme: { id },
        } as any,
        order: { createdAt: 'DESC' },
      }),
      this.costingRepo.find({
        where: {
          adpScheme: { id },
        } as any,
        order: { createdAt: 'DESC' },
      }),
      this.adpSchemeWorkflowLogRepository.find({
        where: {
          schemeId: id,
        },
        order: { createdAt: 'ASC' },
      }),
    ]);

    const pipelineStages = this.buildPipelineStages(scheme, workflowLogs);

    const remarks = comments.map((comment: any) => ({
      id: comment.id,
      text:
        comment.comment ||
        comment.remarks ||
        comment.text ||
        'No remark text available',
      createdAt: this.formatDateTime(comment.createdAt),
    }));

    const gallery = documents
      .filter((document: any) => this.isImageFile(document.filePath || document.path || document.url))
      .map((document: any) => ({
        id: document.id,
        imageUrl: document.filePath || document.path || document.url || '',
        uploadedAt: this.formatDateTime(document.createdAt),
        uploadedBy: 'Uploaded User',
      }));

    const monthlyFinancials = this.buildMonthlyFinancials();
    const costingTotals = this.buildCostingTotals(costings);
    return {
      id: scheme.id,
      adpNo: scheme.adpNo,
      schemeName: scheme.schemeName,
      district: scheme.district,
      sector: scheme.sector,
      type: scheme.type,
      subType: scheme.subType,
      approvalStatus: scheme.approvalStatus,
      executionStatus: scheme.executionStatus,
      initialApprovalDate: scheme.initialApprovalDate,
      targetDate: scheme.targetDate,

      scopeOfScheme: this.getScopeOfScheme(scheme),
      statusNote:
        this.getLatestRemarkText(comments) ??
        this.getDefaultStatusNoteFromStep(scheme.currentStep),
      physicalProgressPercentage: 0,

      estimatedCost: costingTotals.estimatedCost,
      priorExpLastFy: 0,
      throwForward: costingTotals.throwForward,
      allocationCfy: 0,
      revAllocationCfy: 0,
      releasesCfy: 0,
      expenditureCfy: 0,

      pipelineStages,
      remarks,
      gallery,
      monthlyFinancials,
    };
  }

  async getPhysicalProgress(id: string): Promise<PhysicalProgressResponse> {
    const scheme = await this.adpSchemeRepo.findOne({
      where: { id },
    });

    if (!scheme) {
      throw new NotFoundException('ADP scheme not found');
    }

    const comments = await this.commentRepo.find({
      where: {
        adpScheme: { id },
      } as any,
      order: { createdAt: 'DESC' },
    });

    const totalSteps = 7;
    const completedSteps = this.getCompletedVisualStepsCount(scheme.currentStep);

    const overallCompletionPercentage = Math.round(
      (completedSteps / totalSteps) * 100,
    );

    return {
      overallCompletionPercentage,
      completedSteps,
      totalSteps,
      remarks: comments.map((comment: any) => ({
        id: comment.id,
        text:
          comment.comment ||
          comment.remarks ||
          comment.text ||
          'No remark text available',
        createdAt: this.formatDateTime(comment.createdAt),
      })),
    };
  }

  async getMonthlyFinancials(id: string): Promise<MonthlyFinancialsResponse> {
    const scheme = await this.adpSchemeRepo.findOne({
      where: { id },
    });

    if (!scheme) {
      throw new NotFoundException('ADP scheme not found');
    }

    const months = [
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
    ];

    const rows = months.map((month) => ({
      month,
      releaseCap: 0,
      releaseRev: 0,
      expenditureCap: 0,
      expenditureRev: 0,
    }));

    return {
      months: rows,
      totals: {
        releaseCap: 0,
        releaseRev: 0,
        expenditureCap: 0,
        expenditureRev: 0,
      },
    };
  }

  async getGallery(id: string): Promise<GalleryResponse> {
    const scheme = await this.adpSchemeRepo.findOne({
      where: { id },
    });

    if (!scheme) {
      throw new NotFoundException('ADP scheme not found');
    }

    const documents = await this.documentRepo.find({
      where: {
        adpScheme: { id },
      } as any,
      order: { createdAt: 'DESC' },
    });

    const items = documents
      .filter((document: any) =>
        this.isImageFile(document.filePath || document.documentPath || document.url),
      )
      .map((document: any) => ({
        id: document.id,
        imageUrl: document.filePath || document.documentPath || document.url || '',
        uploadedBy: 'Uploaded User',
        uploadedAt: this.formatDateTime(document.createdAt),
        caption:
          document.title ||
          document.caption ||
          document.documentTitle ||
          null,
      }));

    return { items };
  }

  async uploadGalleryImage(
    id: string,
    file: Express.Multer.File,
    dto: UploadGalleryImageDto,
    userId?: string,
  ) {
    const scheme = await this.adpSchemeRepo.findOne({
      where: { id },
    });

    if (!scheme) {
      throw new NotFoundException('ADP scheme not found');
    }

    if (!file) {
      throw new NotFoundException('Image file is required');
    }

    const relativePath = `uploads/gallery/${file.filename}`;

    const document = this.documentRepo.create({
      adpScheme: scheme,
      documentType: AdpSchemeDocumentType.OTHER,
      title: dto.caption || file.originalname,
      caption: dto.caption,
      filePath: relativePath,
      documentName: file.originalname,
      documentPath: relativePath,
      ...(userId ? { uploadedByUserId: userId } : {}),
    } as any);

    const saved = await this.documentRepo.save(document) as any as AdpSchemeDocument;

    return {
      id: saved.id,
      imageUrl: `/${relativePath}`,
      caption: saved.caption,
      uploadedAt: saved.createdAt,
    };
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

  private buildPipelineStages(
    scheme: AdpScheme,
    workflowLogs: AdpSchemeWorkflowLog[],
  ): PipelineStageItem[] {
    const orderedStages: Array<{ key: AdpWorkflowStep; title: string }> = [
      {
        key: AdpWorkflowStep.CREATE_ADP_DRAFT,
        title: 'Final Approved ADP Draft',
      },
      {
        key: AdpWorkflowStep.MODULE_A_COSTS,
        title: 'PC-1 Civil Work (Capital)',
      },
      {
        key: AdpWorkflowStep.MODULE_B_COSTS,
        title: 'PC-1 Machinery, equipment (revenue)',
      },
      {
        key: AdpWorkflowStep.INTERNAL_SCRUTINY,
        title: 'PC-1 Completion',
      },
      {
        key: AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL,
        title: 'Approval from DDWP/PDWP/CDWP',
      },
      {
        key: AdpWorkflowStep.ISSUE_NOC,
        title: 'P&D NOC',
      },
      {
        key: AdpWorkflowStep.AUTH_LETTER_TO_FINANCE,
        title: 'Finance Dept Administrative Approval',
      },
    ];

    const currentStepIndex = this.getPipelineVisualIndex(scheme.currentStep);

    return orderedStages.map((stage, index) => {
      if (index < currentStepIndex) {
        const matchingLog = workflowLogs.find((log) => log.toStep === stage.key);

        return {
          key: stage.key,
          title: stage.title,
          status: 'DONE',
          completedDate: this.formatDate(matchingLog?.createdAt ?? scheme.updatedAt),
        };
      }

      if (index === currentStepIndex) {
        return {
          key: stage.key,
          title: stage.title,
          status: 'CURRENT',
          pendingWith: this.getPendingWithFromStep(stage.key),
        };
      }

      return {
        key: stage.key,
        title: stage.title,
        status: 'UPCOMING',
      };
    });
  }

  private getPipelineVisualIndex(step: AdpWorkflowStep): number {
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
      case AdpWorkflowStep.COMPLETED:
        return 6;

      default:
        return 0;
    }
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

  private getDefaultStatusNoteFromStep(step: AdpWorkflowStep): string {
    switch (step) {
      case AdpWorkflowStep.MODULE_A_COSTS:
        return 'PC-1 Civil estimates pending input from consultants.';
      case AdpWorkflowStep.MODULE_B_COSTS:
        return 'Machinery and equipment costing is under preparation.';
      case AdpWorkflowStep.INTERNAL_SCRUTINY:
        return 'Scheme is under internal scrutiny.';
      case AdpWorkflowStep.DDWP_PRE_PDWP_PDWP_APPROVAL:
        return 'Scheme is awaiting DDWP/PDWP/CDWP approval.';
      case AdpWorkflowStep.ISSUE_NOC:
        return 'P&D NOC is pending.';
      case AdpWorkflowStep.AUTH_LETTER_TO_FINANCE:
        return 'Administrative approval letter is pending transmission to Finance.';
      default:
        return 'No active bottleneck note available.';
    }
  }

  private getLatestRemarkText(comments: AdpSchemeComment[]): string | null {
    if (!comments.length) return null;

    const latest = comments[0] as any;
    return latest.comment || latest.remarks || latest.text || null;
  }

  private buildCostingTotals(costings: AdpSchemeCosting[]) {
    const total = costings.reduce((sum, costing: any) => {
      const amount =
        Number(
          costing.totalAmount ??
          costing.amount ??
          costing.cost ??
          costing.estimatedCost ??
          0,
        ) || 0;

      return sum + amount;
    }, 0);

    return {
      estimatedCost: total,
      throwForward: total,
    };
  }

  private buildMonthlyFinancials(): {
    months: MonthlyFinancialRow[];
    totals: {
      releaseCap: number;
      releaseRev: number;
      expenditureCap: number;
      expenditureRev: number;
    };
  } {
    const months = [
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
    ];

    return {
      months: months.map((month) => ({
        month,
        releaseCap: 0,
        releaseRev: 0,
        expenditureCap: 0,
        expenditureRev: 0,
      })),
      totals: {
        releaseCap: 0,
        releaseRev: 0,
        expenditureCap: 0,
        expenditureRev: 0,
      },
    };
  }

  private getScopeOfScheme(scheme: AdpScheme): string | null {
    return (
      (scheme as any).scopeOfScheme ??
      (scheme as any).description ??
      (scheme as any).scope ??
      null
    );
  }

  private isImageFile(path?: string | null): boolean {
    if (!path) return false;

    const lower = path.toLowerCase();
    return (
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.webp') ||
      lower.endsWith('.gif') ||
      lower.endsWith('.pdf')
    );
  }

  private formatDate(date?: Date | null): string | null {
    if (!date) return null;

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  private formatDateTime(date?: Date | null): string | null {
    if (!date) return null;

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  private async ensureSchemeExists(id: string) {
    const exists = await this.adpSchemeRepo.exist({ where: { id } });
    if (!exists) throw new NotFoundException('ADP scheme not found');
  }

  private sum(a?: string, b?: string): string {
    const x = Number(a ?? 0);
    const y = Number(b ?? 0);
    return (x + y).toFixed(2);
  }
}