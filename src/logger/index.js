import Logger from "./Logger.js";
import CloudWatchLogger from "./CloudWatchLogger.js";

// Create global logger instance - use CloudWatchLogger in production, base Logger otherwise
const logger =
  process.env.NODE_ENV === "production" && process.env.AWS_REGION
    ? new CloudWatchLogger()
    : new Logger();

export default logger;
