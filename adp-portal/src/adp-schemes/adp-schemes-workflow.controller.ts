import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AdpSchemesWorkflowService } from './adp-schemes-workflow.service';
import { MoveNextStepDto } from './dto/move-to-next-step.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('adp-schemes')
export class AdpSchemesWorkflowController {
  constructor(
    private readonly adpSchemesWorkflowService: AdpSchemesWorkflowService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/move-next')
  @UseGuards(JwtAuthGuard)
  async moveNext(
    @Param('id') id: string,
    @Body() dto: MoveNextStepDto,
    @Req() req: any,
  ) {
    return this.adpSchemesWorkflowService.moveToNextStep(
      id,
      req.user?.id,
      dto.remarks,
    );
  }
}