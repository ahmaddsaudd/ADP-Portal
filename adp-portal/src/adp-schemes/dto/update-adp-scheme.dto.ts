import { PartialType } from '@nestjs/mapped-types';
import { CreateAdpSchemeDto } from './create-adp-scheme.dto';

export class UpdateAdpSchemeDto extends PartialType(CreateAdpSchemeDto) {}