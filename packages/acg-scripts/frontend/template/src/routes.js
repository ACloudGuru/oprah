const nextRoutes = require('next-routes');

const routes = nextRoutes();

routes.add({
  name: 'home',
  page: 'index',
  pattern: '/',
});

module.exports = routes;
