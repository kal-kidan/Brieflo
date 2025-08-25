import { BadRequestException } from '@nestjs/common';
import * as FileType from 'file-type';

export const isValidImage = async (file: Express.Multer.File) => {
  if (!file) {
    throw new BadRequestException('File is required');
  }
  return true;
};
