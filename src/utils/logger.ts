import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const logDir = path.join(__dirname, "../logs");

const logFormatter = winston.format.printf((info) => {
  const { timestamp, level, stack, message } = info;
  const errorMessage = stack || message;

  const symbols = Object.getOwnPropertySymbols(info);
  if (info[symbols[0]] !== "error") {
    return `[${timestamp}] - ${level}: ${message}`;
  }

  return `[${timestamp}] ${level}: ${errorMessage}`;
});

const debugTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/debug/debug-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  level: "debug",
  maxFiles: "14d",
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/error/error-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxFiles: "30d",
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), logFormatter),
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [consoleTransport, debugTransport, errorTransport],
});

export default logger;
