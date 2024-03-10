const http = require("http");
const app = require("./app");
const crypto = require("crypto");

const fs = require("fs");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}
startServer();
