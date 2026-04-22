import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { AdpScheme } from './adp-scheme.entity';
import { User } from '../../users/entities/user.entity';
import { AdpWorkflowStage, AdpWorkflowStep } from '../../common/enums/enums';

@Entity('adp_scheme_workflow_logs')
export class AdpSchemeWorkflowLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'scheme_id' })
  schemeId: string;

  @ManyToOne(() => AdpScheme, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheme_id' })
  scheme: AdpScheme;

  @Column({ name: 'acted_by_user_id', nullable: true })
  actedByUserId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'acted_by_user_id' })
  actedBy: User;

  @Column({
    type: 'enum',
    enum: AdpWorkflowStage ,
  })
  fromStage: AdpWorkflowStage;

  @Column({
    type: 'enum',
    enum: AdpWorkflowStage ,
  })
  toStage: AdpWorkflowStage;

  @Column({
    type: 'enum',
    enum: AdpWorkflowStep,
  })
  fromStep: AdpWorkflowStep;

  @Column({
    type: 'enum',
    enum: AdpWorkflowStep,
  })
  toStep: AdpWorkflowStep;

  @Column({ type: 'text', nullable: true })
  remarks?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}