import app from './app';
import { env } from './config/env';
import logger from './utils/logger';
import './config/database'; // Initialize database connection

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, `🚀 HCS Backend server running on port ${PORT}`);
  logger.info({ env: env.NODE_ENV }, `📊 Environment: ${env.NODE_ENV}`);
  logger.info(`🌐 Health check: http://localhost:${PORT}/api/v1/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('🔄 SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('✅ Process terminated');
    process.exit(0);
  });
});

export default server;
