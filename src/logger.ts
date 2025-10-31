import pino from "pino";
import { resolve } from "node:path";

const LOG_PATH = resolve("watcher.log");

export const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
      bindings() {
        return {};
      },
    },
  },
  pino.multistream([
    pino.destination({ dest: LOG_PATH, append: true, sync: true }),
    pino.destination(1),
  ])
);
