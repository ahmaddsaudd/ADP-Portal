import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class GetPipelineBoardDto {
  @ApiProperty({
    enum: ['UNAPPROVED', 'UNDER_REVISION'],
    example: 'UNAPPROVED',
  })
  @IsIn(['UNAPPROVED', 'UNDER_REVISION'])
  tab: 'UNAPPROVED' | 'UNDER_REVISION';
}