import prisma from '@onlyjs/db';
import { Prisma } from '@onlyjs/db/client';
import { PrismaClientKnownRequestError } from '@onlyjs/db/client/runtime/library';
import { NotFoundException } from '../../utils';
import type { PaginationQuery } from '../../utils/pagination';
import type { ReviewCreatePayload, ReviewUpdatePayload } from './types';

export abstract class ReviewService {
    private static async handlePrismaError(
        error: unknown,
        context: 'find' | 'create' | 'update' | 'delete',
    ) {
        if (error instanceof PrismaClientKnownRequestError) {
            if ((error as any).code === 'P2025') {
                throw new NotFoundException('İnceleme bulunamadı');
            }
            if ((error as any).code === 'P2002') {
                throw new Error('Bir filme yalnızca bir inceleme ekleyebilirsiniz.');
            }
        }
        console.error(`Error in ReviewService.${context}:`, error);
        throw error;
    }

    static async index(query: PaginationQuery & { movieId?: number; userId?: string; search?: string }) {
        try {
            const { page = 1, perPage = 20, movieId, userId, search } = query;
            const skip = (page - 1) * perPage;

            const where: Prisma.ReviewWhereInput = {
                deletedAt: null,
            };

            if (movieId) where.movieId = movieId;
            if (userId) where.userId = userId;

            if (search) {
                where.OR = [
                    { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
                    { comment: { contains: search, mode: Prisma.QueryMode.insensitive } },
                ];
            }

            const [data, total] = await Promise.all([
                prisma.review.findMany({
                    where,
                    skip,
                    take: perPage,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { id: true, name: true, image: true, firstName: true, lastName: true } },
                        movie: true,
                    },
                }),
                prisma.review.count({ where }),
            ]);

            return { data, total };
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async show(uuid: string) {
        try {
            const item = await prisma.review.findFirst({
                where: { uuid, deletedAt: null },
                include: {
                    user: { select: { id: true, name: true, image: true, firstName: true, lastName: true } },
                    movie: true,
                },
            });

            if (!item) {
                throw new NotFoundException('İnceleme bulunamadı');
            }

            return item;
        } catch (error) {
            throw this.handlePrismaError(error, 'find');
        }
    }

    static async store(data: ReviewCreatePayload & { userId: string }) {
        try {
            return await prisma.review.create({
                data: data as any, // Type assertion bypass to avoid strictly missing movieId issues in type generation
                include: {
                    user: { select: { id: true, name: true, image: true } },
                    movie: true,
                },
            });
        } catch (error) {
            throw this.handlePrismaError(error, 'create');
        }
    }

    static async update(uuid: string, data: ReviewUpdatePayload) {
        try {
            const item = await prisma.review.update({
                where: { uuid },
                data,
                include: {
                    user: { select: { id: true, name: true, image: true } },
                    movie: true,
                },
            });

            if (!item) {
                throw new NotFoundException('İnceleme bulunamadı');
            }

            return item;
        } catch (error) {
            throw this.handlePrismaError(error, 'update');
        }
    }

    static async destroy(uuid: string) {
        try {
            const item = await prisma.review.update({
                where: { uuid },
                data: { deletedAt: new Date() },
            });

            if (!item) {
                throw new NotFoundException('İnceleme bulunamadı');
            }

            return item;
        } catch (error) {
            throw this.handlePrismaError(error, 'delete');
        }
    }
}
