import type { Review } from '@onlyjs/db/client';
import { BaseFormatter } from '../../utils/base-formatter';
import { reviewResponseDto } from './dtos';
import type { ReviewShowResponse } from './types';

export abstract class ReviewFormatter {
    static response(data: Review) {
        const convertedData = BaseFormatter.convertData<ReviewShowResponse>(
            data,
            reviewResponseDto,
        );
        return convertedData;
    }
}
