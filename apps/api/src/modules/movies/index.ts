import { Elysia } from "elysia";
import { createMovieHandler,
  getAllMoviesHandler,
  getMovieByUuidHandler,
  updateMovieHandler,
  deleteMovieHandler,
 } from "./controller";

export const moviesModule = new Elysia({ prefix: "/movies" })
  .get("/", getAllMoviesHandler)
  .get("/:uuid", getMovieByUuidHandler)
  .post("/", createMovieHandler)
  .patch("/:uuid", updateMovieHandler)
  .delete("/:uuid", deleteMovieHandler);