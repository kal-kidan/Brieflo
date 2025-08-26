import {
  BadRequestException,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { pdfConfig } from '../../utils/multer.util';

@Controller('scripts')
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @Post('generate-from-pdf')
  @UseInterceptors(FileInterceptor('pdfFile', pdfConfig))
  async generateScriptFromPdf(@UploadedFile() pdfFile: Express.Multer.File) {
    if (!pdfFile) {
      throw new BadRequestException('No file uploaded');
    }
    return await this.scriptsService.generateScriptFromPdf(pdfFile.path);
  }

  @Get()
  async findAll() {
    return await this.scriptsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.scriptsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.scriptsService.delete(id);
  }
}
