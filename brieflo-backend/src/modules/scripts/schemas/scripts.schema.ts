import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type ScriptDocument = Script & Document;

@Schema({
  timestamps: true, // This will automatically add createdAt and updatedAt fields
})
export class Script {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  pdfFilePath: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ScriptSchema = SchemaFactory.createForClass(Script);
