import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();
//------------------- File Path as no DB connection-------------------

const currentFilePath = fileURLToPath(import.meta.url);
const currentFolderPath = dirname(currentFilePath);
const authorsJSONPath = join(currentFolderPath, "authors.json");
//--------------------------------------
/* 
name
surname
ID (Unique and server-generated)
email
date of birth
avatar (e.g. https://ui-avatars.com/api/?name=John+Doe) 
*/
//------------------- ENDPOINTS-------------------

authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authors = JSON.parse(fileContent);
  res.status(201).send(authors);
});

authorsRouter.post("/", (req, res) => {
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
    avatar: req.body.avatar,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
  };
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
  authors.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));
  authors.forEach((author) => {
    if (author.email === req.body.email) {
      res.status(400).send({ error: "E-mail already in use" });
    } else {
      res.status(201).send({ id: author.id });
    }
  });
});

authorsRouter.get("/:authorId", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authors = JSON.parse(fileContent);
  const author = authors.find((author) => author.id === req.params.authorId);
  res.status(200).send(author);
});

authorsRouter.put("/:authorId", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const author = JSON.parse(fileContent);
  const authorIndex = author.findIndex(
    (author) => author.id === req.params.authorId
  );
  author[authorIndex] = {
    ...author[authorIndex],
    ...req.body,
    updatedAt: new Date(),
  };
  fs.writeFileSync(authorsJSONPath, JSON.stringify(author));
  res.status(200).send(author[authorIndex]);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  const author = JSON.parse(fileContent);
  const newAuthor = author.filter(
    (author) => author.id !== req.params.authorId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(newAuthor));
  res
    .status(204)
    .send(`Author with id ${req.body.name} ${req.body.surname} was deleted`);
});

export default authorsRouter;
