import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AdpScheme } from '../adp-schemes/entities/adp-scheme.entity';
import { AdpSchemeCosting } from '../adp-schemes/entities/adp-scheme-costing.entity';
import { AdpSchemeComment } from 'src/adp-schemes/entities/adp-scheme-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdpScheme, AdpSchemeCosting, AdpSchemeComment])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}