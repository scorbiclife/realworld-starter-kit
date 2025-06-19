import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import fs from "fs";
import winston from "winston";
import Logger, { COMBINED_LOG_FILE, ERROR_LOG_FILE } from "./Logger.js";

describe("Logger", () => {
  const errorLogFile = ERROR_LOG_FILE;
  const combinedLogFile = COMBINED_LOG_FILE;

  const cleanup = () => {
    if (fs.existsSync(errorLogFile)) {
      fs.unlinkSync(errorLogFile);
    }
    if (fs.existsSync(combinedLogFile)) {
      fs.unlinkSync(combinedLogFile);
    }
  };

  beforeEach(cleanup);
  afterEach(cleanup);

  describe("Base Logger", () => {
    test("should accept custom configuration", () => {
      const logger = new Logger({
        level: "error",
        environment: "custom-test",
      });
      expect(logger.config.level).toBe("error");
      expect(logger.config.environment).toBe("custom-test");
    });

    test("should use default configuration when not provided", () => {
      const logger = new Logger();
      expect(logger.config.level).toBe("info");
      expect(logger.config.environment).toBe("test");
    });

    test("should handle different log levels", () => {
      const logger = new Logger();
      expect(() => {
        logger.debug("Debug message");
        logger.info("Info message");
        logger.warn("Warning message");
        logger.error("Error message");
      }).not.toThrow();
    });
  });
});
