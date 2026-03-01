import { createMovie, getAllMovies } from "./service";
import type { Context } from "elysia";

export const createMovieHandler = async ({ body }: Context) => {
  const { title, description, releaseYear } = body as {
    title: string;
    description?: string;
    releaseYear: number;
  };

  return createMovie({
    title,
    description,
    releaseYear,
  });
};

export const getAllMoviesHandler = async () => {
  return getAllMovies();
};
