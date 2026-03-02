import { WatchlistPlain, WatchlistPlainInputCreate, WatchlistPlainInputUpdate } from '@onlyjs/db/prismabox/Watchlist';
import { t } from 'elysia';
import { type ControllerHook, errorResponseDto, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';

export const watchlistResponseDto = t.Composite([
    WatchlistPlain,
    t.Object({
        movie: t.Optional(t.Any()),
    }),
]);

export const watchlistIndexDto = {
    query: t.Object({
        ...paginationQueryDto.properties,
    }),
    response: {
        200: paginationResponseDto(watchlistResponseDto),
    },
    detail: {
        summary: 'Index',
        description: 'İzleme listesinin verilerini döndürür',
    },
} satisfies ControllerHook;

export const watchlistCreateDto = {
    body: t.Omit(WatchlistPlainInputCreate, ['userId']),
    response: { 200: watchlistResponseDto, 422: errorResponseDto[422] },
    detail: {
        summary: 'Create',
        description: 'İzleme listesine yeni öğe ekler',
    },
} satisfies ControllerHook;

export const watchlistUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: WatchlistPlainInputUpdate,
    response: { 200: watchlistResponseDto, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
        description: 'İzleme listesi öğesini günceller',
    },
} satisfies ControllerHook;

export const watchlistShowDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: watchlistResponseDto, 404: errorResponseDto[404] },
    detail: {
        summary: 'Show',
        description: 'İzleme listesi öğesinin detaylarını döndürür',
    },
} satisfies ControllerHook;

export const watchlistDestroyDto = {
    ...watchlistShowDto,
    response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
    detail: {
        summary: 'Destroy',
        description: 'İzleme listesinden öğe siler',
    },
} satisfies ControllerHook;
