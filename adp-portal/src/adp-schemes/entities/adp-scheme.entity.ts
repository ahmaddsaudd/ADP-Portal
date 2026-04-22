import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AdpApprovalStatus,
  AdpExecutionStatus,
  AdpSchemeType,
  AdpWorkflowStage,
  AdpWorkflowStep,
} from '../../common/enums/enums';
import { AdpSchemeDocument } from './adp-scheme-document.entity';
import { AdpSchemeComment } from './adp-scheme-comment.entity';
import { AdpSchemeCosting } from './adp-scheme-costing.entity';
import { AdpSchemeWorkflowLog } from './adp-scheme-workflow-log.entity';

@Entity('adp_schemes')
export class AdpScheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'adp_no', type: 'varchar', length: 100 })
  adpNo: string;

  @Column({ name: 'scheme_name', type: 'varchar', length: 500 })
  schemeName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  district: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  sector: string | null;

  @Column({
    type: 'enum',
    enum: AdpSchemeType,
    nullable: true,
  })
  type: AdpSchemeType | null;

  @Column({ name: 'sub_type', type: 'varchar', length: 200, nullable: true })
  subType: string | null;

  @Column({
    name: 'approval_status',
    type: 'enum',
    enum: AdpApprovalStatus,
    default: AdpApprovalStatus.DRAFT,
  })
  approvalStatus: AdpApprovalStatus;

  @Column({
    name: 'execution_status',
    type: 'enum',
    enum: AdpExecutionStatus,
    default: AdpExecutionStatus.NOT_STARTED,
  })
  executionStatus: AdpExecutionStatus;

  @Column({ name: 'initial_approval_date', type: 'date', nullable: true })
  initialApprovalDate: string | null;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // workflow fields
  @Column({
    name: 'current_stage',
    type: 'enum',
    enum: AdpWorkflowStage,
    default: AdpWorkflowStage.PROPOSAL_AND_FEASIBILITY,
  })
  currentStage: AdpWorkflowStage;

  @Column({
    name: 'current_step',
    type: 'enum',
    enum: AdpWorkflowStep,
    default: AdpWorkflowStep.SUBMIT_PROPOSAL,
  })
  currentStep: AdpWorkflowStep;

  @Column({ name: 'current_step_updated_at', type: 'timestamp', nullable: true })
  currentStepUpdatedAt: Date | null;

  @Column({ name: 'workflow_completed_at', type: 'timestamp', nullable: true })
  workflowCompletedAt: Date | null;

  @OneToMany(() => AdpSchemeDocument, (document) => document.adpScheme, {
    cascade: false,
  })
  documents: AdpSchemeDocument[];

  @OneToMany(() => AdpSchemeComment, (comment) => comment.adpScheme, {
    cascade: false,
  })
  comments: AdpSchemeComment[];

  @OneToMany(() => AdpSchemeCosting, (costing) => costing.adpScheme, {
    cascade: false,
  })
  costings: AdpSchemeCosting[];

  @OneToMany(() => AdpSchemeWorkflowLog, (log) => log.scheme, {
    cascade: false,
  })
  workflowLogs: AdpSchemeWorkflowLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}