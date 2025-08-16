import pino from "pino";
import { env } from "../config/env";

// Create logger with different configurations for development and production
const logger = pino({
	level: env.NODE_ENV === "development" ? "debug" : "info",
	transport:
		env.NODE_ENV === "development"
			? {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "SYS:standard",
						ignore: "pid,hostname",
					},
			  }
			: undefined,
	formatters: {
		level: (label) => {
			return { level: label };
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
