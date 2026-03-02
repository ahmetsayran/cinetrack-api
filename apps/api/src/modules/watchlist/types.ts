import type { Static } from 'elysia';
import { watchlistCreateDto, watchlistResponseDto, watchlistShowDto, watchlistUpdateDto } from './dtos';

export type WatchlistCreatePayload = Static<(typeof watchlistCreateDto)['body']>;
export type WatchlistUpdatePayload = Static<(typeof watchlistUpdateDto)['body']>;
export type WatchlistShowParams = Static<(typeof watchlistShowDto)['params']>;
export type WatchlistShowResponse = Static<typeof watchlistResponseDto>;
export type WatchlistDestroyParams = WatchlistShowParams;
