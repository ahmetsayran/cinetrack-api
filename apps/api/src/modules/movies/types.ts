import type { Static } from 'elysia';
import { movieCreateDto, movieResponseDto, movieShowDto, movieUpdateDto } from './dtos';

export type MovieCreatePayload = Static<(typeof movieCreateDto)['body']>;
export type MovieUpdatePayload = Static<(typeof movieUpdateDto)['body']>;
export type MovieShowParams = Static<(typeof movieShowDto)['params']>;
export type MovieShowResponse = Static<typeof movieResponseDto>;
export type MovieDestroyParams = MovieShowParams;
