import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PDFToScriptConverter } from '../../utils/langchain-models/gemini';
import { Script, ScriptDocument } from './schemas/scripts.schema';

@Injectable()
export class ScriptsService {
  constructor(
    @InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,
  ) {}

  async generateScriptFromPdf(pdfFilePath: string) {
    const converter = new PDFToScriptConverter(
      pdfFilePath,
      'casual and engaging',
      '2',
    );
    const result = await converter.convert();

    // Save the script to database
    const script = new this.scriptModel({
      pdfFilePath,
      content: result.content,
    });

    const savedScript = await script.save();

    return {
      id: savedScript._id,
      content: result.content,
      pdfFilePath,
      createdAt: savedScript.createdAt,
      updatedAt: savedScript.updatedAt,
    };
  }

  async findAll(): Promise<Script[]> {
    return this.scriptModel.find().exec();
  }

  async findOne(id: string): Promise<Script> {
    return this.scriptModel.findById(id).exec();
  }

  async delete(id: string): Promise<Script> {
    return this.scriptModel.findByIdAndDelete(id).exec();
  }
}

