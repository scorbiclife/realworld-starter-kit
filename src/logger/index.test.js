import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import logger from './index.js';

describe('Logger Integration', () => {
  const logsDir = 'logs';
  const errorLogFile = path.join(logsDir, 'error.log');
  const combinedLogFile = path.join(logsDir, 'combined.log');

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

  describe('Global Logger Instance', () => {
    test('should be able to log messages', () => {
      expect(() => {
        logger.info('Testing logger');
        logger.error('Testing error logger');
      }).not.toThrow();
    });
  });
}); 