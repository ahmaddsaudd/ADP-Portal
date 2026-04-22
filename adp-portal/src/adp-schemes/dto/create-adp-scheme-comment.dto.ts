import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAdpSchemeCommentDto {
  @IsString()
  comment: string;

  @IsOptional()
  @IsUUID()
  commentedBy?: string;
}