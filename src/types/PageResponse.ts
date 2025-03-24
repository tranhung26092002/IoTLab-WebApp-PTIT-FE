export interface PageResponse<T> {
    data: T[];
    metaData: {
        page: number;
        size: number;
        total: number;
        totalPage: number;
    };
}
