const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // Path to your db.json
const middlewares = jsonServer.defaults();

server.use(cors());  // Enable CORS (optional but often needed)
server.use(middlewares);  // Use default middlewares
server.use(router);  // Use the router to handle API requests

server.listen(4000, () => {
  console.log('JSON Server is running on http://localhost:4000');
});
