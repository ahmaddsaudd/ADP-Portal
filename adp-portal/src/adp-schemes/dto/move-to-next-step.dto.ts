import { IsOptional, IsString, MaxLength } from 'class-validator';

export class MoveNextStepDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}