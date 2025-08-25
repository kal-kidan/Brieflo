import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLoggerService } from './utils/logger/winston-logger.service';
import * as multer from 'multer';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception as string);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Debug logging
    this.logger.debug('Exception caught in global filter', {
      exceptionType: exception?.constructor?.name,
      exceptionMessage:
        exception instanceof Error ? exception.message : 'Unknown error',
      ...(request.body ? { body: request.body } : {}),
      path: request.url,
      method: request.method,
      query: request.query,
      params: request.params,
      headers: request.headers,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      timestamp: new Date().toISOString(),
    });

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorResponse: any = {};

    // Handle Multer errors specifically
    if (exception instanceof multer.MulterError) {
      this.logger.debug('Multer error detected', {
        code: exception.code,
        message: exception.message,
        field: exception.field,
      });

      status = HttpStatus.BAD_REQUEST;
      switch (exception.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File size too large. Maximum size is 2MB';
          break;
        case 'LIMIT_FILE_COUNT':
          message = 'Too many files uploaded';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Unexpected file field';
          break;
        case 'LIMIT_FIELD_KEY':
          message = 'Field name too long';
          break;
        case 'LIMIT_FIELD_VALUE':
          message = 'Field value too long';
          break;
        case 'LIMIT_FIELD_COUNT':
          message = 'Too many fields';
          break;
        case 'LIMIT_PART_COUNT':
          message = 'Too many parts';
          break;
        default:
          message = `File upload error: ${exception.message}`;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        errorResponse = res;
        message = (res as any).message || message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const baseResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };
    if (isDev) {
      // In development, include stack trace and error details
      response.status(status).json({
        ...baseResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
        ...errorResponse,
      });
    } else {
      // In production, do not leak stack trace or internal error details
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        response.status(status).json({
          ...baseResponse,
          message: 'Internal server error',
        });
      } else {
        response.status(status).json(baseResponse);
      }
    }
  }
}
