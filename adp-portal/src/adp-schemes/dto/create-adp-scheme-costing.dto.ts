import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateAdpSchemeCostingDto {
  @ApiProperty({
    example: '2025-2026',
    description: 'Financial year in format YYYY-YYYY',
  })
  @Matches(/^\d{4}-\d{4}$/)
  financialYear: string;

  @ApiPropertyOptional({ example: '15000000', description: 'Estimated capital cost' })
  @IsOptional() @IsString() estimatedCostCap?: string;

  @ApiPropertyOptional({ example: '5000000', description: 'Estimated revenue cost' })
  @IsOptional() @IsString() estimatedCostRev?: string;

  @ApiPropertyOptional({ example: '3000000', description: 'Prior expenditure capital' })
  @IsOptional() @IsString() priorExpCap?: string;

  @ApiPropertyOptional({ example: '1000000', description: 'Prior expenditure revenue' })
  @IsOptional() @IsString() priorExpRev?: string;

  @ApiPropertyOptional({ example: '12000000', description: 'Throw forward capital' })
  @IsOptional() @IsString() throwForwardCap?: string;

  @ApiPropertyOptional({ example: '4000000', description: 'Throw forward revenue' })
  @IsOptional() @IsString() throwForwardRev?: string;

  @ApiPropertyOptional({ example: '8000000', description: 'Current FY allocation capital' })
  @IsOptional() @IsString() allocCfyCap?: string;

  @ApiPropertyOptional({ example: '2000000', description: 'Current FY allocation revenue' })
  @IsOptional() @IsString() allocCfyRev?: string;

  @ApiPropertyOptional({ example: '7500000', description: 'Revised allocation capital' })
  @IsOptional() @IsString() revAllocCfyCap?: string;

  @ApiPropertyOptional({ example: '1800000', description: 'Revised allocation revenue' })
  @IsOptional() @IsString() revAllocCfyRev?: string;

  @ApiPropertyOptional({ example: '6000000', description: 'Releases during CFY capital' })
  @IsOptional() @IsString() releasesCfyCap?: string;

  @ApiPropertyOptional({ example: '1500000', description: 'Releases during CFY revenue' })
  @IsOptional() @IsString() releasesCfyRev?: string;

  @ApiPropertyOptional({ example: '3500000', description: 'Module A capital cost' })
  @IsOptional() @IsString() moduleACap?: string;

  @ApiPropertyOptional({ example: '1200000', description: 'Module A revenue cost' })
  @IsOptional() @IsString() moduleARev?: string;

  @ApiPropertyOptional({ example: '4500000', description: 'Module B capital cost' })
  @IsOptional() @IsString() moduleBCap?: string;

  @ApiPropertyOptional({ example: '1300000', description: 'Module B revenue cost' })
  @IsOptional() @IsString() moduleBRev?: string;
}