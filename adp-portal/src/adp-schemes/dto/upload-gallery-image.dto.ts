import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadGalleryImageDto {
  @ApiPropertyOptional({
    example: 'Boundary wall progress - April visit',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;
}