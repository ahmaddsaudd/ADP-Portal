import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AdpSchemesService } from './adp-schemes.service';
import { CreateAdpSchemeDto } from './dto/create-adp-scheme.dto';
import { UpdateAdpSchemeDto } from './dto/update-adp-scheme.dto';
import { CreateAdpSchemeCostingDto } from './dto/create-adp-scheme-costing.dto';
import { UpdateAdpSchemeCostingDto } from './dto/update-adp-scheme-costing.dto';
import { CreateAdpSchemeCommentDto } from './dto/create-adp-scheme-comment.dto';
import { CreateAdpSchemeDocumentDto } from './dto/create-adp-scheme-document.dto';
import { AdpSchemeDocumentType, UserRole } from 'src/common/enums/enums';
import { DocumentUploadInterceptor } from 'src/common/file-uploads/file-uploads';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path/win32';
import { UploadGalleryImageDto } from './dto/upload-gallery-image.dto';

function galleryFilename(
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  callback(null, `${unique}${extname(file.originalname)}`);
}

@ApiTags('ADP Schemes')
@Controller('adp-schemes')
export class AdpSchemesController {
  constructor(private readonly adpSchemesService: AdpSchemesService) { }

  @Post()
  @ApiOperation({ summary: 'Create an ADP scheme' })
  @ApiBody({ type: CreateAdpSchemeDto })
  create(@Body() dto: CreateAdpSchemeDto) {
    return this.adpSchemesService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all ADP schemes' })
  findAll() {
    return this.adpSchemesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one ADP scheme by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.adpSchemesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an ADP scheme' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAdpSchemeDto })
  update(@Param('id') id: string, @Body() dto: UpdateAdpSchemeDto) {
    return this.adpSchemesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ADP scheme' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.adpSchemesService.remove(id);
  }

  @Post(':id/costings')
  @ApiOperation({ summary: 'Create costing for an ADP scheme' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: CreateAdpSchemeCostingDto })
  createCosting(
    @Param('id') adpSchemeId: string,
    @Body() dto: CreateAdpSchemeCostingDto,
  ) {
    return this.adpSchemesService.createCosting(adpSchemeId, dto);
  }

  @Patch('costings/:costingId')
  @ApiOperation({ summary: 'Update ADP scheme costing' })
  @ApiParam({ name: 'costingId', type: String })
  @ApiBody({ type: UpdateAdpSchemeCostingDto })
  updateCosting(
    @Param('costingId') costingId: string,
    @Body() dto: UpdateAdpSchemeCostingDto,
  ) {
    return this.adpSchemesService.updateCosting(costingId, dto);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to an ADP scheme' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: CreateAdpSchemeCommentDto })
  addComment(
    @Param('id') adpSchemeId: string,
    @Body() dto: CreateAdpSchemeCommentDto,
  ) {
    return this.adpSchemesService.addComment(adpSchemeId, dto);
  }

  @Get(':id/pipeline-detail')
  @ApiOperation({ summary: 'Get pipeline detail for a specific ADP scheme' })
  @ApiParam({
    name: 'id',
    description: 'ADP scheme id',
    example: '89104e3e-0280-402a-a4e8-ba4d89f00010',
  })
  @ApiOkResponse({ description: 'Pipeline detail returned successfully' })
  @ApiNotFoundResponse({ description: 'ADP scheme not found' })
  async getPipelineDetail(@Param('id') id: string) {
    return this.adpSchemesService.getPipelineDetail(id);
  }

  @Get(':id/physical-progress')
  @ApiOperation({ summary: 'Get physical progress for a specific ADP scheme' })
  @ApiParam({
    name: 'id',
    description: 'ADP scheme id',
    example: '89104e3e-0280-402a-a4e8-ba4d89f00010',
  })
  @ApiOkResponse({ description: 'Physical progress returned successfully' })
  @ApiNotFoundResponse({ description: 'ADP scheme not found' })
  async getPhysicalProgress(@Param('id') id: string) {
    return this.adpSchemesService.getPhysicalProgress(id);
  }

  @Get(':id/monthly-financials')
  @ApiOperation({ summary: 'Get monthly financials for a specific ADP scheme' })
  @ApiParam({
    name: 'id',
    description: 'ADP scheme id',
    example: '89104e3e-0280-402a-a4e8-ba4d89f00010',
  })
  @ApiOkResponse({ description: 'Monthly financials returned successfully' })
  @ApiNotFoundResponse({ description: 'ADP scheme not found' })
  async getMonthlyFinancials(@Param('id') id: string) {
    return this.adpSchemesService.getMonthlyFinancials(id);
  }

  @Get(':id/gallery')
  @ApiOperation({ summary: 'Get gallery images for a specific ADP scheme' })
  @ApiParam({
    name: 'id',
    description: 'ADP scheme id',
    example: '89104e3e-0280-402a-a4e8-ba4d89f00010',
  })
  @ApiOkResponse({ description: 'Gallery returned successfully' })
  @ApiNotFoundResponse({ description: 'ADP scheme not found' })
  async getGallery(@Param('id') id: string) {
    return this.adpSchemesService.getGallery(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/documents')
  @ApiOperation({ summary: 'Add document to an ADP scheme' })
  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documentType: {
          type: 'string',
          enum: Object.values(AdpSchemeDocumentType),
        },
        documentName: {
          type: 'string',
        },
        remarks: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['documentName', 'file'],
    },
  })
  @UseInterceptors(DocumentUploadInterceptor)
  addDocument(
    @Param('id') adpSchemeId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateAdpSchemeDocumentDto,
  ) {
    return this.adpSchemesService.addDocument(adpSchemeId, dto, file);
  }

  @Post(':id/gallery')
  @ApiOperation({ summary: 'Upload a gallery image for an ADP scheme' })
  @ApiParam({
    name: 'id',
    description: 'ADP scheme id',
    example: '89104e3e-0280-402a-a4e8-ba4d89f00010',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        caption: { type: 'string', example: 'Boundary wall progress' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({ description: 'Gallery image uploaded successfully' })
  @ApiNotFoundResponse({ description: 'ADP scheme not found' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/gallery',
        filename: galleryFilename,
      }),
      fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = allowed.test(extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype.toLowerCase());
        cb(null, ext && mime);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadGalleryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadGalleryImageDto,
    @Req() req: any,
  ) {
    return this.adpSchemesService.uploadGalleryImage(
      id,
      file,
      dto,
      req.user?.id,
    );
  }
}