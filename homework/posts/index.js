/* GET /blogPosts => returns the list of blogposts
GET /blogPosts /123 => returns a single blogpost
POST /blogPosts => create a new blogpost
PUT /blogPosts /123 => edit the blogpost with the given id
DELETE /blogPosts /123 => delete the blogpost with the given id */

import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { postsValidationMiddelwares } from "./validation.js";

const postsRouter = express.Router();

const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);

const getPosts = () => JSON.parse(fs.readFileSync(postsJSONPath));
const writePosts = () =>
  fs.writeFileSync(postsJSONPath, JSON.stringify(content));

//1 POST CRUD ENDPOINT
postsRouter.post("/", postsValidationMiddelwares, (req, res, next) => {
  try {
    const newPost = { ...req.body, createdAt: new Date(), ID: uniqid() };
    const posts = getPosts();

    posts.push(newPost);
    writePosts(posts);

    res.status(201).send({ ID: newPost.id });
  } catch (error) {
    next(error);
  }
});

//2 GET CRUD ENDPOINT
postsRouter.get("/", (req, res, next) => {
  try {
    const posts = getPosts();
    if (req.query && req.query.title) {
      const filteredPosts = posts.filter(
        (post) => post.title === req.query.title
      );
      res.send(filteredPosts);
    } else {
      res.send(posts);
    }
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
