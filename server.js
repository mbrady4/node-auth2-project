const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./users/userRouter");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/users", userRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "Running" });
});

module.exports = server;
