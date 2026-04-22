import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  AdpApprovalStatus,
  AdpExecutionStatus,
  AdpSchemeType,
} from '../../common/enums/enums';

export class CreateAdpSchemeDto {
  @ApiProperty({
    example: 'ADP-2025-001',
    maxLength: 100,
    description: 'Unique ADP number for the scheme',
  })
  @IsString()
  @MaxLength(100)
  adpNo: string;

  @ApiProperty({
    example: 'Construction of District Hospital Block A',
    maxLength: 500,
    description: 'Name of the ADP scheme',
  })
  @IsString()
  @MaxLength(500)
  schemeName: string;

  @ApiPropertyOptional({
    example: 'Lahore',
    description: 'District of the scheme',
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    example: 'Health',
    description: 'Sector of the scheme',
  })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({
    enum: AdpSchemeType,
    enumName: 'AdpSchemeType',
    example: AdpSchemeType.NEW,
    description: 'Whether the scheme is new or ongoing',
  })
  @IsOptional()
  @IsEnum(AdpSchemeType)
  type?: AdpSchemeType;

  @ApiPropertyOptional({
    example: 'Infrastructure',
    description: 'Optional sub-type of the scheme',
  })
  @IsOptional()
  @IsString()
  subType?: string;

  @ApiPropertyOptional({
    enum: AdpApprovalStatus,
    enumName: 'AdpApprovalStatus',
    example: AdpApprovalStatus.PENDING,
    description: 'Current approval status of the scheme',
  })
  @IsOptional()
  @IsEnum(AdpApprovalStatus)
  approvalStatus?: AdpApprovalStatus;

  @ApiPropertyOptional({
    enum: AdpExecutionStatus,
    enumName: 'AdpExecutionStatus',
    example: AdpExecutionStatus.NOT_STARTED,
    description: 'Current execution status of the scheme',
  })
  @IsOptional()
  @IsEnum(AdpExecutionStatus)
  executionStatus?: AdpExecutionStatus;

  @ApiPropertyOptional({
    example: '2025-07-01',
    format: 'date',
    description: 'Initial approval date in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsDateString()
  initialApprovalDate?: string;

  @ApiPropertyOptional({
    example: '2026-06-30',
    format: 'date',
    description: 'Target completion date in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsDateString()
  targetDate?: string;
}