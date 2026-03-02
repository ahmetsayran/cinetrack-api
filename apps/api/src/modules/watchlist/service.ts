import prisma from '@onlyjs/db';
import { Prisma } from '@onlyjs/db/client';
import { PrismaClientKnownRequestError } from '@onlyjs/db/client/runtime/library';
import { NotFoundException } from '../../utils';
import type { PaginationQuery } from '../../utils/pagination';
import type { WatchlistCreatePayload, WatchlistUpdatePayload } from './types';

export abstract class WatchlistService {
  private static async handlePrismaError(
    error: unknown,
    context: 'find' | 'create' | 'update' | 'delete',
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('İzleme listesi öğesi bulunamadı');
      }
    }
    console.error(`Error in WatchlistService.${context}:`, error);
    throw error;
  }

  static async index(userId: string, query: PaginationQuery & { search?: string }) {
    try {
      const { page = 1, perPage = 20, search } = query;
      const skip = (page - 1) * perPage;

      const where: Prisma.WatchlistWhereInput = search
        ? {
          userId,
          deletedAt: null,
          movie: {
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
            ]
          }
        }
        : {
          userId,
          deletedAt: null,
        };

      const [data, total] = await Promise.all([
        prisma.watchlist.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { createdAt: 'desc' },
          include: {
            movie: true,
          },
        }),
        prisma.watchlist.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async show(uuid: string) {
    try {
      const item = await prisma.watchlist.findFirst({
        where: { uuid, deletedAt: null },
        include: { movie: true },
      });

      if (!item) {
        throw new NotFoundException('İzleme listesi öğesi bulunamadı');
      }

      return item;
    } catch (error) {
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async store(data: WatchlistCreatePayload & { userId: string }) {
    try {
      return await prisma.watchlist.create({
        data: {
          ...data,
          status: data.status || 'PLAN_TO_WATCH',
        } as any, // Temporary fix for Prisma create payload issue with status / user / movie
        include: { movie: true },
      });
    } catch (error) {
      throw this.handlePrismaError(error, 'create');
    }
  }

  static async update(uuid: string, data: WatchlistUpdatePayload) {
    try {
      const item = await prisma.watchlist.update({
        where: { uuid },
        data,
        include: { movie: true },
      });

      if (!item) {
        throw new NotFoundException('İzleme listesi öğesi bulunamadı');
      }

      return item;
    } catch (error) {
      throw this.handlePrismaError(error, 'update');
    }
  }

  static async destroy(uuid: string) {
    try {
      const item = await prisma.watchlist.update({
        where: { uuid },
        data: { deletedAt: new Date() },
      });

      if (!item) {
        throw new NotFoundException('İzleme listesi öğesi bulunamadı');
      }

      return item;
    } catch (error) {
      throw this.handlePrismaError(error, 'delete');
    }
  }
}
