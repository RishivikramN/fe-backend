import { ErrorRequestHandler } from "express";
import logger from "../libs/logger";

export const jsonErrorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  next
) => {
  const { response } = err;
  const error = response;
  if (!res) next();
  logger.error(error);
  res.setHeader("Content-Type", "application/json");
  res.status(parseInt(error?.statusCode?.toString())).send(error);
};
