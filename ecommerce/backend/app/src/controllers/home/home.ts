import { Request, Response } from 'express';

export const getHome = (req: Request, res: Response): void => {
  res.status(404).send("Not Found");
};
