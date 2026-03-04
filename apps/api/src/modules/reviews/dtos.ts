import { ReviewPlain, ReviewPlainInputCreate, ReviewPlainInputUpdate } from '@onlyjs/db/prismabox/Review';
import { t } from 'elysia';
import { type ControllerHook, errorResponseDto, uuidValidation } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';

export const reviewResponseDto = t.Composite([
    ReviewPlain,
    t.Object({
        user: t.Optional(t.Any()),
        movie: t.Optional(t.Any()),
    }),
]);

export const reviewIndexDto = {
    query: t.Object({
        ...paginationQueryDto.properties,
        movieId: t.Optional(t.Number()),
        userId: t.Optional(t.String()),
        search: t.Optional(t.String()),
    }),
    response: {
        200: paginationResponseDto(reviewResponseDto),
    },
    detail: {
        summary: 'Index',
        description: 'Yorum ve puanlamaların listesini döndürür',
    },
} satisfies ControllerHook;

export const reviewCreateDto = {
    body: t.Omit(ReviewPlainInputCreate, ['userId']),
    response: { 200: reviewResponseDto, 422: errorResponseDto[422] },
    detail: {
        summary: 'Create',
        description: 'Filme yeni bir inceleme -yorum ve puan- ekler',
    },
} satisfies ControllerHook;

export const reviewUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: ReviewPlainInputUpdate,
    response: { 200: reviewResponseDto, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
        description: 'İncelemeyi günceller',
    },
} satisfies ControllerHook;

export const reviewShowDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: reviewResponseDto, 404: errorResponseDto[404] },
    detail: {
        summary: 'Show',
        description: 'İnceleme detaylarını döndürür',
    },
} satisfies ControllerHook;

export const reviewDestroyDto = {
    ...reviewShowDto,
    response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
    detail: {
        summary: 'Destroy',
        description: 'İncelemeyi siler',
    },
} satisfies ControllerHook;
