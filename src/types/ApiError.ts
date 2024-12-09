export interface ApiError {
    description: string;
    message: string;
    messageCode: string | null;
    path: string;
    status: number;
    timestamp: number;
}