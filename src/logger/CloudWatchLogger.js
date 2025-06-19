import winston from "winston";
import * as WinstonCloudWatch from "winston-cloudwatch";
import Logger from "./Logger.js";

class CloudWatchLogger extends Logger {
  constructor(config = {}) {
    super(config);
    
    // CloudWatch specific configuration
    this.cloudWatchConfig = {
      cloudWatchLogGroup:
        config.cloudWatchLogGroup ||
        process.env.CLOUDWATCH_LOG_GROUP ||
        "realworld-application-logs",
      awsRegion: config.awsRegion || process.env.AWS_REGION || "ap-northeast-2",
    };

    // Setup CloudWatch transports
    this.setupCloudWatchTransports();
  }

  async setupCloudWatchTransports() {
    try {
      // Add CloudWatch transport to general logger
      this.logger.add(
        new WinstonCloudWatch({
          logGroupName: this.cloudWatchConfig.cloudWatchLogGroup,
          logStreamName: `${this.config.environment}-${Date.now()}`,
          awsRegion: this.cloudWatchConfig.awsRegion,
        })
      );
    } catch (error) {
      console.warn("CloudWatch transport not available:", error.message);
    }
  }
}

export default CloudWatchLogger; 