'use strict';

const nextRoutes = require('next-routes');

const routes = nextRoutes();

routes.add({
  name: 'home',
  pattern: '/',
  page: 'index',
});

module.exports = routes;
