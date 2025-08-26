import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AIMessage } from '@langchain/core/messages';
import * as pdfParse from 'pdf-parse';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

export class PDFToScriptConverter {
  private pdfFilePath: string;
  private tone: string;
  private length: string;

  constructor(
    pdfFilePath: string,
    tone: string = 'casual and engaging',
    length: string = '2',
  ) {
    this.pdfFilePath = pdfFilePath;
    this.tone = tone;
    this.length = length;
  }

  private async loadPDFContent(): Promise<string> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const url = cloudinary.url(this.pdfFilePath, { resource_type: 'raw' });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NodeJS',
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF from Cloudinary: ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    return data.text;
  }

  private createPromptTemplate(): PromptTemplate {
    return new PromptTemplate({
      template: `You are a creative scriptwriter. Based on the following PDF content, create a humanly, casual, and engaging story-based video script:
      {pdfContent}
      
      The script should:
      - Be written in a {tone} style, as if a real person is narrating it.
      - Speak directly in a friendly, relatable manner.
      - Be approximately {length} minutes long.
      - Include clear scene descriptions, voiceover cues, and natural dialogue where appropriate.
      - Flow smoothly from one idea to the next, like a story, rather than a list of points.
      - Be ready to be used directly in a voice-over software.
      
      Make it entertaining, easy to follow, and engaging, while keeping the key ideas from the PDF intact.`,
      inputVariables: ['pdfContent', 'tone', 'length'],
    });
  }

  public async convert(): Promise<AIMessage> {
    const text = await this.loadPDFContent();
    const promptTemplate = this.createPromptTemplate();
    const promptFormat = await promptTemplate.format({
      pdfContent: text,
      tone: this.tone,
      length: this.length,
    });
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY as string,
      model: 'gemini-2.5-flash',
    });

    const result = await model.invoke(promptFormat);
    return result;
  }
}
