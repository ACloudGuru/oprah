'use strict';

import express from 'express';
import next from 'next';
import path from 'path';
import routes from './routes';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: './src', dev });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();

  const staticFilesOptions = {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    root: path.join(__dirname, '/static'),
  };
  server.use('/robots.txt', (req, res) => {
    res.status(200).sendFile('robots.txt', staticFilesOptions);
  });
  server.use('/security.txt', (req, res) => {
    res.status(200).sendFile('security.txt', staticFilesOptions);
  });

  server.use(handler).listen(port, err => {
    if (err) {
      throw err;
    }
    // tslint:disable-next-line
    console.log(`> Ready on http://localhost:${port}`);
  });
});
