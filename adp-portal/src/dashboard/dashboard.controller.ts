import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { GetPipelineBoardDto } from './dto/get-pileline-board.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview data' })
  @ApiOkResponse({ description: 'Dashboard overview returned successfully' })
  async getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('pipeline-board')
  @ApiOperation({ summary: 'Get pipeline board grouped by workflow steps' })
  @ApiQuery({
    name: 'tab',
    enum: ['UNAPPROVED', 'UNDER_REVISION'],
    required: true,
  })
  @ApiOkResponse({ description: 'Pipeline board returned successfully' })
  async getPipelineBoard(@Query() query: GetPipelineBoardDto) {
    return this.dashboardService.getPipelineBoard(query.tab);
  }

  @Get('reports/monthly-financials')
  @ApiOperation({ summary: 'Get global monthly financials report' })
  @ApiOkResponse({ description: 'Monthly financials report returned successfully' })
  async getGlobalMonthlyFinancials() {
    return this.dashboardService.getGlobalMonthlyFinancials();
  }

  @Get('reports/physical-progress')
  @ApiOperation({ summary: 'Get global physical progress report' })
  @ApiOkResponse({ description: 'Physical progress report returned successfully' })
  async getGlobalPhysicalProgress() {
    return this.dashboardService.getGlobalPhysicalProgress();
  }
}