import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { getAllContacts } from './services/contacts.js';

const PORT = Number(env('PORT', '4000'));

const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
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

  // app.get('/', (req, res) => {
  //   res.status(200).json({
  //     status: 200,
  //     message: 'Home page!',
  //   });
  // });

   app.get('/contacts', async (req, res) => {
    try {
      console.log('Запит на отримання контактів');
      const contacts = await getAllContacts({
        userId: req.userId,
        page: req.query.page,
        perPage: req.query.perPage,
        sortOrder: req.query.sortOrder || 'asc',
        sortBy: req.query.sortBy || 'createdAt',
        filter: req.query.filter || {},
      });
      res.status(200).json(contacts);
    } catch (error) {
      console.error('Помилка при отриманні контактів:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });
  app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });
  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
};

export default setupServer;
