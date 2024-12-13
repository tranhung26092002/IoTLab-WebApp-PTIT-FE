export interface PageResponse<T> {
    data: T[];
    metadata: {
        page: number;
        size: number;
        total: number;
    };
}
