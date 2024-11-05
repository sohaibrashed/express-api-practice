const pino = require("pino");
const pinoHttp = require("pino-http");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:SS",
    },
  },
});

const loggerHandler = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
    if (res.statusCode >= 500 || err) return "error";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `Request successfully processed: ${req.method} ${req.url}`;
  },
  customErrorMessage: (req, res, err) => {
    return `Error processing request: ${req.method} ${req.url}`;
  },
  customProps: (req, res) => ({
    userAgent: req.headers["user-agent"],
    requestId: req.id,
  }),
});

module.exports = { logger, loggerHandler };
