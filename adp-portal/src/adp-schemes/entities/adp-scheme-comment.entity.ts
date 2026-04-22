import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdpScheme } from './adp-scheme.entity';

@Entity('adp_scheme_comments')
export class AdpSchemeComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'adp_scheme_id', type: 'uuid' })
  adpSchemeId: string;

  @ManyToOne(() => AdpScheme, (scheme) => scheme.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adp_scheme_id' })
  adpScheme: AdpScheme;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'commented_by', type: 'uuid', nullable: true })
  commentedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}