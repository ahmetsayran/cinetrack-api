import { MoviePlain, MoviePlainInputCreate, MoviePlainInputUpdate } from '@onlyjs/db/prismabox/Movie';
import { t } from 'elysia';
import { type ControllerHook, errorResponseDto, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';

export const movieResponseDto = MoviePlain;

export const movieIndexDto = {
    query: t.Object({
        ...paginationQueryDto.properties,
        search: t.Optional(t.String()),
    }),
    response: {
        200: paginationResponseDto(movieResponseDto),
    },
    detail: {
        summary: 'Index',
        description: 'Filmlerin listesini döndürür',
    },
} satisfies ControllerHook;

export const movieCreateDto = {
    body: MoviePlainInputCreate,
    response: { 200: movieResponseDto, 422: errorResponseDto[422] },
    detail: {
        summary: 'Create',
        description: 'Yeni film oluşturur',
    },
} satisfies ControllerHook;

export const movieUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: MoviePlainInputUpdate,
    response: { 200: movieResponseDto, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
        description: 'Filmi günceller',
    },
} satisfies ControllerHook;

export const movieShowDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: movieResponseDto, 404: errorResponseDto[404] },
    detail: {
        summary: 'Show',
        description: 'Film detaylarını döndürür',
    },
} satisfies ControllerHook;

export const movieDestroyDto = {
    ...movieShowDto,
    response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
    detail: {
        summary: 'Destroy',
        description: 'Filmi siler',
    },
} satisfies ControllerHook;
