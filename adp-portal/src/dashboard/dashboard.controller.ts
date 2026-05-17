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
  getOverview(@Query('financialYear') financialYear = '2025-26') {
    return this.dashboardService.getOverview(financialYear);
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
    return this.dashboardService.getPipelineBoard(query.tab, query.financialYear || '2025-26');
  }

  @Get('reports/monthly-financials')
  @ApiOperation({ summary: 'Get global monthly financials report' })
  @ApiOkResponse({ description: 'Monthly financials report returned successfully' })
  getGlobalMonthlyFinancials(
    @Query('financialYear') financialYear = '2025-26',
  ) {
    return this.dashboardService.getGlobalMonthlyFinancials(financialYear);
  }


  @Get('reports/physical-progress')
  @ApiOperation({ summary: 'Get global physical progress report' })
  @ApiOkResponse({ description: 'Physical progress report returned successfully' })
  getGlobalPhysicalProgress(
    @Query('financialYear') financialYear = '2025-26',
  ) {
    return this.dashboardService.getGlobalPhysicalProgress(financialYear);
  }
}