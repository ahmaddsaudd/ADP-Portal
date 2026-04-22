import { PartialType } from '@nestjs/mapped-types';
import { CreateAdpSchemeCostingDto } from './create-adp-scheme-costing.dto';

export class UpdateAdpSchemeCostingDto extends PartialType(CreateAdpSchemeCostingDto) {}