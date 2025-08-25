import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';

@Injectable()
export class ScriptsService {
  async generateScriptFromPdf(pdfFile: Express.Multer.File) {
    return 'Hello World';
  }

  async generateScriptFromText(text: string) {
    return 'Hello World';
  }
}
