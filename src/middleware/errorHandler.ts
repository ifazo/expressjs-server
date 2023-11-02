import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: false;
  message: string;
  errorMessages?: {
    path: string;
    message: string;
  }[];
  stack?: string;
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorMessages: { path: string; message: string }[] | undefined;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = Object.values(err).map((error: any) => ({
      path: error.path,
      message: error.message,
    }));
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Cast Error';
  } else if (err.name === 'DuplicateEntry') {
    statusCode = 400;
    message = 'Duplicate Entry';
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  const errorResponse: ErrorResponse = {
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  };

  res.status(statusCode).json(errorResponse);
}

export default errorHandler;