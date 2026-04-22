import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdpSchemeDocumentType } from '../../common/enums/enums';
import { AdpScheme } from './adp-scheme.entity';

@Entity('adp_scheme_documents')
export class AdpSchemeDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'adp_scheme_id', type: 'uuid' })
  adpSchemeId: string;

  @ManyToOne(() => AdpScheme, (scheme) => scheme.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adp_scheme_id' })
  adpScheme: AdpScheme;

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: AdpSchemeDocumentType,
    default: AdpSchemeDocumentType.OTHER,
  })
  documentType: AdpSchemeDocumentType;

  @Column({ name: 'document_name', type: 'varchar', length: 255 })
  documentName: string;

  @Column({ name: 'caption', type: 'varchar', length: 255, nullable: true })
  caption: string | null;

  @Column({ name: 'document_path', type: 'varchar', length: 1000 })
  documentPath: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: true })
  mimeType: string | null;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number | null;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}