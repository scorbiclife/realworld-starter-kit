import { app } from "./app.js";
import logger from "./logger/index.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.logError(error, {
    message: "Uncaught Exception",
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.logError(reason, {
    message: "Unhandled Promise Rejection",
    promise,
  });
  process.exit(1);
});
