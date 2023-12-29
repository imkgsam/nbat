import Logger from '../core/Logger';
import { Request,Response, NextFunction } from 'express'

export default (req:Request, res:Response, next:NextFunction) => {
  Logger.info(`Requesting ------> ${req.originalUrl}`)
    next()
  };
