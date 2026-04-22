import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdpScheme } from './entities/adp-scheme.entity';
import { AdpSchemeDocument } from './entities/adp-scheme-document.entity';
import { AdpSchemeComment } from './entities/adp-scheme-comment.entity';
import { AdpSchemeCosting } from './entities/adp-scheme-costing.entity';
import { AdpSchemeWorkflowLog } from './entities/adp-scheme-workflow-log.entity';
import { AdpSchemesWorkflowService } from './adp-schemes-workflow.service';
import { AdpSchemesWorkflowController } from './adp-schemes-workflow.controller';
import { AdpSchemesController } from './adp-schemes.controller';
import { AdpSchemesService } from './adp-schemes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdpScheme,
      AdpSchemeDocument,
      AdpSchemeComment,
      AdpSchemeCosting,
      AdpSchemeWorkflowLog,
    ]),
  ],
  controllers: [AdpSchemesWorkflowController, AdpSchemesController],
  providers: [AdpSchemesWorkflowService, AdpSchemesService],
  exports: [AdpSchemesWorkflowService, AdpSchemesService],
})
export class AdpSchemesModule {}