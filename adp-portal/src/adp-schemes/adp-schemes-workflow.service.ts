import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdpScheme } from './entities/adp-scheme.entity';
import { AdpSchemeWorkflowLog } from './entities/adp-scheme-workflow-log.entity';
import { ADP_WORKFLOW_MAP } from './workflow/adp-workflow.config';
import { AdpSchemeCosting } from './entities/adp-scheme-costing.entity';
import { AdpWorkflowStep } from 'src/common/enums/enums';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdpSchemesWorkflowService {
  constructor(
    @InjectRepository(AdpScheme)
    private readonly adpSchemeRepository: Repository<AdpScheme>,

    @InjectRepository(AdpSchemeWorkflowLog)
    private readonly workflowLogRepository: Repository<AdpSchemeWorkflowLog>,

    @InjectRepository(AdpSchemeCosting)
    private readonly adpSchemeCostingRepository: Repository<AdpSchemeCosting>,
  ) { }

  async moveToNextStep(
    adpSchemeId: string,
    actedByUserId?: string,
    remarks?: string,
  ): Promise<AdpScheme> {
    const adpScheme = await this.adpSchemeRepository.findOne({
      where: { id: adpSchemeId },
    });

    const currentUser = await this.workflowLogRepository.manager.findOne(User, {
      where: { id: actedByUserId },
    });

    if(!currentUser) {
      throw new BadRequestException('Acting user not found');
    }

    if (!adpScheme) {
      throw new NotFoundException('ADP scheme not found');
    }

    if (adpScheme.currentStep === AdpWorkflowStep.COMPLETED) {
      throw new BadRequestException('ADP scheme workflow is already completed');
    }

    await this.validateBeforeMove(adpScheme);

    const workflowRule = ADP_WORKFLOW_MAP[adpScheme.currentStep];

    if (!workflowRule.allowedRoles.includes(currentUser.role)) {
      throw new ForbiddenException(
        `Role ${currentUser.role} cannot move this step (${adpScheme.currentStep})`,
      );
    }

    if (!workflowRule) {
      throw new BadRequestException(
        `No workflow rule found for current step: ${adpScheme.currentStep}`,
      );
    }

    const fromStage = adpScheme.currentStage;
    const fromStep = adpScheme.currentStep;

    adpScheme.currentStage = workflowRule.nextStage;
    adpScheme.currentStep = workflowRule.nextStep;
    adpScheme.currentStepUpdatedAt = new Date();

    if (workflowRule.nextStep === AdpWorkflowStep.COMPLETED) {
      adpScheme.workflowCompletedAt = new Date();
    }

    const savedScheme = await this.adpSchemeRepository.save(adpScheme);

    if (!actedByUserId) {
      throw new BadRequestException('Acted by user id is required');
    }

    const workflowLog = this.workflowLogRepository.create({
      scheme: { id: savedScheme.id },
      fromStage,
      toStage: savedScheme.currentStage,
      fromStep,
      toStep: savedScheme.currentStep,
      actedByUserId: actedByUserId,
      actedBy: { id: actedByUserId },
      remarks: remarks ?? null,
    });

    await this.workflowLogRepository.save(workflowLog);

    return savedScheme;
  }

  private async validateBeforeMove(adpScheme: AdpScheme): Promise<void> {
    switch (adpScheme.currentStep) {
      case AdpWorkflowStep.MODULE_A_COSTS: {
        const moduleACostingExists = await this.adpSchemeCostingRepository.exist({
          where: {
            adpScheme: { id: adpScheme.id },
          },
        });

        if (!moduleACostingExists) {
          throw new BadRequestException(
            'Cannot move to next step because costing data is missing',
          );
        }

        break;
      }

      case AdpWorkflowStep.MODULE_B_COSTS: {
        const costingExists = await this.adpSchemeCostingRepository.exist({
          where: {
            adpScheme: { id: adpScheme.id },
          },
        });

        if (!costingExists) {
          throw new BadRequestException(
            'Cannot move to next step because costing data is missing',
          );
        }

        break;
      }

      default:
        break;
    }
  }
}