const jsonServer = require('json-server');
const serverless = require('serverless-http');

// Create a new JSON Server instance
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // This should be your data file
const middlewares = jsonServer.defaults();

// Use default middlewares (logger, static, etc.)
server.use(middlewares);

// Use your mock data (db.json)
server.use(router);

// Export the handler for Netlify Function
module.exports.handler = serverless(server);
