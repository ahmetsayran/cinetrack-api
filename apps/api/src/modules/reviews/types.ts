import type { Static } from 'elysia';
import { reviewCreateDto, reviewResponseDto, reviewShowDto, reviewUpdateDto } from './dtos';

export type ReviewCreatePayload = Static<(typeof reviewCreateDto)['body']>;
export type ReviewUpdatePayload = Static<(typeof reviewUpdateDto)['body']>;
export type ReviewShowParams = Static<(typeof reviewShowDto)['params']>;
export type ReviewShowResponse = Static<typeof reviewResponseDto>;
export type ReviewDestroyParams = ReviewShowParams;
