import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AdpSchemeDocumentType } from '../../common/enums/enums';

export class CreateAdpSchemeDocumentDto {
  @ApiPropertyOptional({
    enum: AdpSchemeDocumentType,
    enumName: 'AdpSchemeDocumentType',
    example: AdpSchemeDocumentType.PC1,
  })
  @IsOptional()
  @IsEnum(AdpSchemeDocumentType)
  documentType?: AdpSchemeDocumentType;

  @ApiProperty({
    example: 'PC-1 Revised Draft',
  })
  @IsString()
  documentName: string;

  @ApiPropertyOptional({
    example: 'Revised after P&D feedback',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}