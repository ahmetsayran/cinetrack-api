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

