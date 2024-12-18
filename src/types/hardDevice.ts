// Device related interfaces
export interface Device {
    id: number;
    code: string;
    name: string;
    type: string;
    description?: string;
    imageUrl?: string;
    status: 'AVAILABLE' | 'BORROWED';
    currentBorrower?: number;
    totalBorrowed: number;
    createdAt: string | number[]; // Support both formats
    updatedAt?: string | number[];
    borrowRecords: BorrowRecord[];
}

export interface DeviceFormValues {
    id: number;
    code: string;
    name: string;
}

// BorrowRecord related interfaces
export interface BorrowRecord {
    id: number;
    device: DeviceFormValues;
    userId: number;
    note: string;
    borrowedAt: string;
    expiredAt: string;
    returnedAt?: string;
    status: 'BORROWED' | 'RETURNED';
}

// Filter parameters for searching devices
export interface DeviceFilterParams {
    search?: string;
    type?: string;
    status?: 'AVAILABLE' | 'BORROWED';
    page?: number;
    size?: number;
}

// Data required when creating a new borrow record
export interface CreateBorrowRequest {
    deviceId: number;
    expiredAt: string;
    notes?: string;
}

export interface PageResponse<T> {
    data: T[];
    metadata: {
        page: number;
        size: number;
        total: number;
        totalPage: number;
    };
}

export interface BorrowDeviceRequest {
    deviceId: number;
    note: string;
    expiredAt: string;
}