import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', '4000'));

export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  //   app.use('*', (req, res, next) => {
  //     res.status(404).json({
  //       message: 'Not found',
  //     });
  //   });

  //   app.use((err, req, res, next) => {
  //     res.status(500).json({
  //       message: 'Something went wrong',
  //       error: err.message,
  //     });
  //   });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
