import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

config();

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    'Cloudinary configuration error: Please make sure CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are all defined in your environment variables.',
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Define allowed image formats
const ALLOWED_IMAGE_FORMATS = ['pdf'];

export const createMulterConfig = (
  destination: string,
  filenamePrefix: string = 'file',
) => {
  return {
    storage: new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        try {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          return {
            folder: destination,
            public_id: `${filenamePrefix}-${uniqueSuffix}`,
            allowed_formats: ALLOWED_IMAGE_FORMATS,
          };
        } catch (error) {
          console.error('Error configuring Cloudinary upload:', error);
          throw error;
        }
      },
    }),
    // Add file filter to validate files before processing
    fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
      // Check if file exists
      if (!file) {
        return cb(new BadRequestException('No file uploaded'), false);
      }

      // Check file mimetype
      if (!file.mimetype || !file.mimetype.startsWith('application/pdf')) {
        return cb(
          new BadRequestException(
            `Invalid file type. Only pdf files are allowed.`,
          ),
          false,
        );
      }

      // Check file extension
      const fileExtension = file.originalname
        ? file.originalname.split('.').pop()?.toLowerCase()
        : null;

      if (!fileExtension || !ALLOWED_IMAGE_FORMATS.includes(fileExtension)) {
        return cb(
          new BadRequestException(
            `Invalid file format. Allowed formats: ${ALLOWED_IMAGE_FORMATS.join(
              ', ',
            )}. Received: ${fileExtension || 'unknown'}`,
          ),
          false,
        );
      }

      // Check file size (50MB limit)
      const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSizeInBytes) {
        return cb(
          new BadRequestException('File size too large. Maximum size is 50MB'),
          false,
        );
      }

      // If all validations pass, accept the file
      cb(null, true);
    },
    // Add file size limit
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  };
};

const appName = process.env.APP_NAME;
// Pre-configured multer configs for common use cases
export const pdfConfig = createMulterConfig(`${appName}/pdf-files`, 'pdf');
export const generalUploadConfig = createMulterConfig(
  `${appName}/uploads`,
  'file',
);
