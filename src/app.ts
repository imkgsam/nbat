import express, { Request, Response, NextFunction } from 'express';
import Logger from './core/Logger';
import cors from 'cors';
import { corsUrl, environment } from './config';

process.on('uncaughtException', (e) => {
  console.log(e)
});

import './database'; // initialize database
import './cache'; // initialize cache

import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger_output.json";


import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorTypeEnum,
} from './core/ApiError';
import routes from './routes';



const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
// Routes
app.use('/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));


// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));
// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('im here')
  console.log(err)
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorTypeEnum.INTERNAL)
      Logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,);
    else{
      Logger.error(err)
    }
  } else {
    Logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,);

    Logger.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
