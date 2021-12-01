import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./services/authors/index.js";

const server = express();

const port = 3001;

server.use(express.json());

//------------------- ENDPOINTS-------------------
server.use("/authors", authorsRouter);
//-------------------List endpoints-------------------
console.log(listEndpoints(server));
//-------------------Establish server connection-------------------

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
