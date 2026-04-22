import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AdpScheme } from './adp-scheme.entity';

@Entity('adp_scheme_costings')
@Unique('UQ_adp_scheme_costing_financial_year_scheme', ['financialYear', 'adpSchemeId'])
@Check(`"estimated_cost_total" = "estimated_cost_cap" + "estimated_cost_rev"`)
@Check(`"prior_exp_total" = "prior_exp_cap" + "prior_exp_rev"`)
@Check(`"throw_forward_total" = "throw_forward_cap" + "throw_forward_rev"`)
@Check(`"alloc_cfy_total" = "alloc_cfy_cap" + "alloc_cfy_rev"`)
@Check(`"rev_alloc_cfy_total" = "rev_alloc_cfy_cap" + "rev_alloc_cfy_rev"`)
@Check(`"releases_cfy_total" = "releases_cfy_cap" + "releases_cfy_rev"`)
@Check(`"module_a_total" = "module_a_cap" + "module_a_rev"`)
@Check(`"module_b_total" = "module_b_cap" + "module_b_rev"`)
export class AdpSchemeCosting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'adp_scheme_id', type: 'uuid' })
  adpSchemeId: string;

  @ManyToOne(() => AdpScheme, (scheme) => scheme.costings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adp_scheme_id' })
  adpScheme: AdpScheme;

  @Column({ name: 'financial_year', type: 'varchar', length: 9 })
  financialYear: string; // e.g. 2025-2026

  // EST. COST
  @Column({ name: 'estimated_cost_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedCostCap: string;

  @Column({ name: 'estimated_cost_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedCostRev: string;

  @Column({ name: 'estimated_cost_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedCostTotal: string;

  // PRIOR EXP (PREV FY)
  @Column({ name: 'prior_exp_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  priorExpCap: string;

  @Column({ name: 'prior_exp_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  priorExpRev: string;

  @Column({ name: 'prior_exp_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  priorExpTotal: string;

  // THROW-FORWARD
  @Column({ name: 'throw_forward_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  throwForwardCap: string;

  @Column({ name: 'throw_forward_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  throwForwardRev: string;

  @Column({ name: 'throw_forward_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  throwForwardTotal: string;

  // ALLOC CFY
  @Column({ name: 'alloc_cfy_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  allocCfyCap: string;

  @Column({ name: 'alloc_cfy_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  allocCfyRev: string;

  @Column({ name: 'alloc_cfy_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  allocCfyTotal: string;

  // REV. ALLOC CFY
  @Column({ name: 'rev_alloc_cfy_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  revAllocCfyCap: string;

  @Column({ name: 'rev_alloc_cfy_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  revAllocCfyRev: string;

  @Column({ name: 'rev_alloc_cfy_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  revAllocCfyTotal: string;

  // RELEASES CFY
  @Column({ name: 'releases_cfy_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  releasesCfyCap: string;

  @Column({ name: 'releases_cfy_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  releasesCfyRev: string;

  @Column({ name: 'releases_cfy_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  releasesCfyTotal: string;

  // MODULE A
  @Column({ name: 'module_a_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  moduleACap: string;

  @Column({ name: 'module_a_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  moduleARev: string;

  @Column({ name: 'module_a_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  moduleATotal: string;

  // MODULE B
  @Column({ name: 'module_b_cap', type: 'decimal', precision: 15, scale: 2, default: 0 })
  moduleBCap: string;

  @Column({ name: 'module_b_rev', type: 'decimal', precision: 15, scale: 2, default: 0 })
  moduleBRev: string;

  @Column({ name: 'module_b_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  moduleBTotal: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}