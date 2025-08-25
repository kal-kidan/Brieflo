import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Allow 100 requests per 15 minutes per IP
const rateLimiter = new RateLimiterMemory({
  points: 50,
  duration: 10, // 15 minutes
  blockDuration: 10, // 15 minutes
});

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await rateLimiter.consume(`${req.ip}_${req.path}`);
    next();
  } catch (rejRes) {
    res.status(429).json({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
    });
  }
}
