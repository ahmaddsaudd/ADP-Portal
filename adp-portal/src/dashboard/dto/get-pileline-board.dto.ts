import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetPipelineBoardDto {
  @ApiProperty({
    enum: ['UNAPPROVED', 'UNDER_REVISION'],
    example: 'UNAPPROVED',
  })
  @IsIn(['UNAPPROVED', 'UNDER_REVISION'])
  tab: 'UNAPPROVED' | 'UNDER_REVISION';

  @ApiPropertyOptional({
    example: '2025-26',
  })
  @IsOptional()
  @IsString()
  financialYear?: string;
}