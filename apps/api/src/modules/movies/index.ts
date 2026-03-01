import { Elysia } from "elysia";
import { createMovieHandler, getAllMoviesHandler } from "./controller";

export const moviesModule = new Elysia({ prefix: "/movies" })
  .get("/", getAllMoviesHandler)
  .post("/", createMovieHandler);

  