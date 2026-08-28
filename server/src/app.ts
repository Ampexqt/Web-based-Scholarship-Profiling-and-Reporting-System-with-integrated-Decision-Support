import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigin = isProduction 
  ? (process.env.FRONTEND_URL || 'https://your-production-url.vercel.app') 
  : 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json()); // Parse JSON payloads
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true }));

import path from 'path';

// API Routes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', routes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
