import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';
import routes from './routes';
import authRoutes from './routes/auth.routes';
import { env } from './config/env';

const app = express();

// Trust proxy for accurate IP addresses when behind a proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: env.NODE_ENV === 'production' 
    ? ['http://localhost:3000'] // Update this with production URLs
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts',
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    correlationId: req.headers['x-correlation-id'] || Math.random().toString(36).substring(7)
  }, 'HTTP Request');

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body?: any) {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    }, 'HTTP Response');
    
    return originalJson.call(this, body);
  };

  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    }
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Happy Child School API',
    data: {
      name: 'Happy Child School API',
      version: '1.0.0',
      status: 'running',
      environment: env.NODE_ENV,
      documentation: '/api/v1/health',
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  }, 'Route not found');

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ 
    error: error.message, 
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  }, 'Unhandled error');

  // Don't expose error details in production
  const message = env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message,
    ...(env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Graceful shutdown handlers
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Graceful shutdown starting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Graceful shutdown starting...');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    reason,
    promise
  }, 'Unhandled Promise Rejection');
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error({
    error: error.message,
    stack: error.stack
  }, 'Uncaught Exception');
  process.exit(1);
});

export default app;
