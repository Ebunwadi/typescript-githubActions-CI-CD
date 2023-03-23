import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const notFound: RequestHandler = (req, res, next) => {
  const error = new Error(`${req.originalUrl} doesnt exist`);
  res.status(404);
  next(error);
};

export const logEvents = async (message: string, logFileName: string) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

export const errorHandler = (err : Error, req: Request, res: Response, next: NextFunction) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

     const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status)
  res.json({ message: err.message })
  next()
}
