import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./authors/index.js";
import cors from "cors";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/authors", authorsRouter);

const port = 3001;

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Serveris running on port:", port);
});
