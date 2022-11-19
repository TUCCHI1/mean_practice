import { NextFunction } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    return next();
  }

  const token = await req.headers.autho;
};
