import prisma from "@onlyjs/db";

export const createMovie = async (data: {
  title: string;
  description?: string;
  releaseYear: number;
}) => {
  return prisma.movie.create({
    data,
  });
};

export const getAllMovies = async () => {
  return prisma.movie.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMovieByUuid = async (uuid: string) => {
  return prisma.movie.findFirst({
    where: { uuid, deletedAt: null },
  });
};

export const updateMovieByUuid = async (
  uuid: string,
  data: { title?: string; description?: string | null; releaseYear?: number },
) => {
  return prisma.movie.update({
    where: { uuid },
    data,
  });
};

export const softDeleteMovieByUuid = async (uuid: string) => {
  return prisma.movie.update({
    where: { uuid },
    data: { deletedAt: new Date() },
  });
};
