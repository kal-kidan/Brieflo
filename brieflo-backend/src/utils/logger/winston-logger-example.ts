// // Example usage of the Winston logger service
// import { WinstonLoggerService } from './winston-logger.service';

// // Example: Basic logging
// export function exampleBasicLogging(logger: WinstonLoggerService) {
//   logger.log('This is an info message');
//   logger.debug('This is a debug message');
//   logger.warn('This is a warning message');
//   logger.error('This is an error message');
// }

// // Example: API logging
// export function exampleApiLogging(logger: WinstonLoggerService) {
//   // Log API request
//   logger.apiRequest('GET', '/api/users/123', 'user123', 'req456');

//   // Log API response
//   logger.apiResponse('GET', '/api/users/123', 200, 150, 'user123', 'req456');
// }

// // Example: Authentication logging
// export function exampleAuthLogging(logger: WinstonLoggerService) {
//   logger.auth('login', {
//     userId: 'user123',
//     email: 'user@example.com',
//     method: 'email',
//   });

//   logger.auth('register', {
//     userId: 'user456',
//     email: 'newuser@example.com',
//   });

//   logger.auth('oauth_success', {
//     userId: 'user789',
//     email: 'oauth@example.com',
//     method: 'google',
//   });
// }

// // Example: Database operation logging
// export function exampleDatabaseLogging(logger: WinstonLoggerService) {
//   logger.database('create', 'users', 'user123', 'user456');
//   logger.database('read', 'users', 'user123', 'user456');
//   logger.database('update', 'users', 'user123', 'user456');
//   logger.database('delete', 'users', 'user123', 'user456');
// }

// // Example: User action logging
// export function exampleUserActionLogging(logger: WinstonLoggerService) {
//   logger.userAction('profile_update', 'user123', {
//     fields: ['name', 'phone'],
//     timestamp: new Date().toISOString(),
//   });

//   logger.userAction('file_upload', 'user123', {
//     fileName: 'profile.jpg',
//     fileSize: 1024000,
//     fileType: 'image/jpeg',
//   });
// }

// // Example: Error logging with context
// export function exampleErrorLogging(logger: WinstonLoggerService) {
//   try {
//     // Some operation that might throw an error
//     throw new Error('Something went wrong');
//   } catch (error) {
//     logger.errorWithContext(
//       'An error occurred during operation',
//       error as Error,
//       {
//         operation: 'data_processing',
//         userId: 'user123',
//         timestamp: new Date().toISOString(),
//       },
//     );
//   }
// }

// // Example: Performance logging
// export function examplePerformanceLogging(logger: WinstonLoggerService) {
//   const startTime = Date.now();

//   // Simulate some operation
//   setTimeout(() => {
//     const duration = Date.now() - startTime;
//     logger.performance('database_query', duration, {
//       query: 'SELECT * FROM users',
//       userId: 'user123',
//     });
//   }, 100);
// }

// // Example: Security event logging
// export function exampleSecurityLogging(logger: WinstonLoggerService) {
//   logger.security('failed_login', {
//     email: 'user@example.com',
//     ip: '192.168.1.1',
//     userAgent: 'Mozilla/5.0...',
//     reason: 'invalid_password',
//   });

//   logger.security('suspicious_activity', {
//     userId: 'user123',
//     activity: 'multiple_failed_logins',
//     ip: '192.168.1.1',
//     count: 5,
//   });
// }

// // Example: HTTP request/response logging (used in middleware)
// export function exampleHttpLogging(logger: WinstonLoggerService) {
//   const mockReq = {
//     method: 'GET',
//     url: '/api/users/123',
//     get: (header: string) => 'Mozilla/5.0...',
//     ip: '192.168.1.1',
//     user: { _id: 'user123' },
//   } as any;

//   const mockRes = {
//     statusCode: 200,
//   } as any;

//   logger.httpRequest(mockReq, mockRes);
//   logger.httpResponse(mockReq, mockRes, 150);
// }

// // Example: Service class using the logger
// export class ExampleService {
//   constructor(private logger: WinstonLoggerService) {}

//   async processUserData(userId: string, data: any) {
//     this.logger.debug('Starting user data processing', { userId });

//     try {
//       // Simulate processing
//       await this.simulateProcessing();

//       this.logger.info('User data processed successfully', {
//         userId,
//         dataSize: Object.keys(data).length,
//       });

//       return { success: true };
//     } catch (error) {
//       this.logger.errorWithContext(
//         'Failed to process user data',
//         error as Error,
//         {
//           userId,
//           data: data,
//         },
//       );
//       throw error;
//     }
//   }

//   private async simulateProcessing() {
//     return new Promise((resolve) => setTimeout(resolve, 100));
//   }
// }
