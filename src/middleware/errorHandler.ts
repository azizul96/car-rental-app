import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  const errorMessages = err.errorMessages || [];

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
  });
};

export default errorHandler;
