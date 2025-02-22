import { Response } from "express";

const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: any,
  data?: any,
) => {
  return res.status(statusCode).send({
    statusCode,
    success,
    message,
    data,
  });
};

export default sendResponse;
