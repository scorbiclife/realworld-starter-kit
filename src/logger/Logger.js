import winston from "winston";

export const ERROR_LOG_FILE = "logs/error.log";
export const COMBINED_LOG_FILE = "logs/combined.log";

const MB = 1024 * 1024;

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const errorFileTransport = new winston.transports.File({

  filename: ERROR_LOG_FILE,
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  maxsize: (parseInt(process.env.ERROR_LOG_MAX_SIZE_MB || "5", 10) || 5) * MB, // 5MB
  maxFiles: 5,
});

const combinedFileTransport = new winston.transports.File({
  filename: COMBINED_LOG_FILE,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  maxsize: 5242880, // 5MB
  maxFiles: 5,
});

class Logger {
  constructor(config = {}) {
    this.config = {
      level: config.level || process.env.LOG_LEVEL || "info",
      environment: config.environment || process.env.NODE_ENV || "development",
      ...config,
    };
    this.logger = Logger.createLogger(this.config);
  }

  static createLogger(config) {
    return winston.createLogger({
      level: config.level || process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: {
        service: "realworld-application",
        environment: config.environment,
      },
      transports: [consoleTransport, errorFileTransport, combinedFileTransport],
    });
  }

  // General logging methods
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }

  // Error logging methods
  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  logError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      ...context,
    };

    this.logger.error("Application Error", errorInfo);
  }
}

export default Logger;
