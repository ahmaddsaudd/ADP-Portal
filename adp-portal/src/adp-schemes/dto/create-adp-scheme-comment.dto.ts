import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateAdpSchemeCommentDto {
  @ApiProperty({ example: 'PC-1 estimate is pending from Works & Services.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  comment: string;
}