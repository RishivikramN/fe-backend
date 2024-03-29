import { statusCodes } from "./../libs/statusCodes";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import logger from "../libs/logger";

const responseErrorHandler: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction // eslint-disable-line
) => {
  const statusCode: number = response?.statusCode;
  const message = error.message;

  if (statusCode >= 400 && statusCode < 500) {
    logger.warn(
      `HTTP [${request.method}] ${request.url} - ${statusCode} ${message}`
    );
  } else if (statusCode >= 500) {
    logger.error(
      `HTTP [${request.method}] ${request.url} - ${statusCode} ${message} `
    );

    logger.error(`Call Stack ${error.stack}`);
  }

  response.status(statusCode).json({
    message: message,
    statusCode: statusCode,
  });
};

export default responseErrorHandler;
