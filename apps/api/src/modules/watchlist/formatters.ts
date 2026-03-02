import type { Watchlist, Movie } from '@onlyjs/db/client';
import { BaseFormatter } from '../../utils/base-formatter';
import { watchlistResponseDto } from './dtos';
import type { WatchlistShowResponse } from './types';

export abstract class WatchlistFormatter {
    static response(data: Watchlist & { movie?: Movie }) {
        const convertedData = BaseFormatter.convertData<WatchlistShowResponse>(
            data,
            watchlistResponseDto,
        );
        return convertedData;
    }
}
