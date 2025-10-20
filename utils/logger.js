const winston = require('winston');
const config = require('../config');

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'kyro-payment-platform' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, log to the console as well
if (config.environment !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Request logging middleware
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error(`${req.method} ${req.path} - Error: ${err.message}`, {
    stack: err.stack,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next(err);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger
};