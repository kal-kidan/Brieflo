import {
  BadRequestException,
  Controller,
  Post,
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
    return this.scriptsService.generateScriptFromPdf(pdfFile);
  }
}
