import type { Movie } from '@onlyjs/db/client';
import { BaseFormatter } from '../../utils/base-formatter';
import { movieResponseDto } from './dtos';
import type { MovieShowResponse } from './types';

export abstract class MovieFormatter {
    static response(data: Movie) {
        const convertedData = BaseFormatter.convertData<MovieShowResponse>(
            data,
            movieResponseDto,
        );
        return convertedData;
    }
}
