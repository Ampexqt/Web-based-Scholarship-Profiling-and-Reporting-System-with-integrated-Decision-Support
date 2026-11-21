import { Request, Response, NextFunction } from 'express';
// import rateLimit from 'express-rate-limit';

// Rate limiting is temporarily commented out for development/testing
/*
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes to prevent brute-force attacks
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
*/

// Passthrough middleware while rate limiting is disabled
export const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  next();
};

