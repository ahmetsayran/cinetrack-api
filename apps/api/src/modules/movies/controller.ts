import { createMovie, getAllMovies } from "./service";
import type { Context } from "elysia";

import {
  getMovieByUuid,
  updateMovieByUuid,
  softDeleteMovieByUuid,
} from './service';

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

export const getMovieByUuidHandler = async ({ params }: { params: { uuid: string } }) => {
  return getMovieByUuid(params.uuid);
};

export const updateMovieHandler = async (context: any) => {
  const { params, body } = context;

  return updateMovieByUuid(params.uuid, body);
};

export const deleteMovieHandler = async ({ params }: { params: { uuid: string } }) => {
  return softDeleteMovieByUuid(params.uuid);
};
