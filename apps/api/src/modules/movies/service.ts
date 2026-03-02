import prisma from '@onlyjs/db';
import { Prisma } from '@onlyjs/db/client';
import { PrismaClientKnownRequestError } from '@onlyjs/db/client/runtime/library';
import { NotFoundException } from '../../utils';
import type { PaginationQuery } from '../../utils/pagination';
import type { MovieCreatePayload, MovieUpdatePayload } from './types';

export abstract class MoviesService {
  private static async handlePrismaError(
    error: unknown,
    context: 'find' | 'create' | 'update' | 'delete',
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Film bulunamadı');
      }
    }
    console.error(`Error in MoviesService.${context}:`, error);
    throw error;
  }

  static async index(query: PaginationQuery & { search?: string }) {
    try {
      const { page = 1, perPage = 20, search } = query;
      const skip = (page - 1) * perPage;

      const where: Prisma.MovieWhereInput = search
        ? {
          OR: [
            {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
          deletedAt: null,
        }
        : {
          deletedAt: null,
        };

      const [data, total] = await Promise.all([
        prisma.movie.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.movie.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async show(uuid: string) {
    try {
      const movie = await prisma.movie.findFirst({
        where: { uuid, deletedAt: null },
      });

      if (!movie) {
        throw new NotFoundException('Film bulunamadı');
      }

      return movie;
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async store(data: MovieCreatePayload) {
    try {
      return await prisma.movie.create({
        data,
      });
    } catch (error) {
      throw this.handlePrismaError(error, 'create');
    }
  }

  static async update(uuid: string, data: MovieUpdatePayload) {
    try {
      const movie = await prisma.movie.update({
        where: { uuid },
        data,
      });

      if (!movie) {
        throw new NotFoundException('Film bulunamadı');
      }

      return movie;
    } catch (error) {
      throw this.handlePrismaError(error, 'update');
    }
  }

  static async destroy(uuid: string) {
    try {
      // Soft delete behavior implemented via the original service file.
      const movie = await prisma.movie.update({
        where: { uuid },
        data: { deletedAt: new Date() },
      });

      if (!movie) {
        throw new NotFoundException('Film bulunamadı');
      }

      return movie;
    } catch (error) {
      throw this.handlePrismaError(error, 'delete');
    }
  }
}
