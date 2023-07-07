import { Response } from 'express';

export const displayStatus = (res: Response, statusCode: number, message: string, data?: any): void => {
  const responseData = {
    status: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(responseData);
};

