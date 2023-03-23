import { Response } from "express";

export const errMsg = (statusCode: number, status: string, message: unknown, res: Response) => {
  return res.status(statusCode).json({
    status,
    message
  })
}

export const successMsg = (statusCode: number, status: string, data: unknown, res: Response) => {
  return res.status(statusCode).json({
    status,
    data
  })
}