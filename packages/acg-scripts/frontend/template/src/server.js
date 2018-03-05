'use strict';

const path = require('path');
const { parse } = require('url');

const express = require('express');
const next = require('next');
const routes = require('./routes');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: 'src', dev });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express();

  // Handle static/ files
  const staticFilesOptions = {
    root: path.join(__dirname, '/static'),
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
  };
  server.use('/robots.txt', (req, res) => {
    res.status(200).sendFile('robots.txt', staticFilesOptions);
  });
  server.use('/security.txt', (req, res) => {
    res.status(200).sendFile('security.txt', staticFilesOptions);
  });
  server.use('/sitemap.xml', (req, res) => {
    res.status(200).sendFile('sitemap.xml', staticFilesOptions);
  });
  server.use('/favicon.ico', (req, res) => {
    res.status(200).sendFile('favicon.ico', staticFilesOptions);
  });

  // Handle next.js app
  server.use(handler).listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});
