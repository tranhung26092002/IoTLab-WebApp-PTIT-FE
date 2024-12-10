export interface HardDevice {
    id: string;
    name: string;
    type: string;
    brand: string;
    model: string;
    status: 'available' | 'borrowed';
    imageUrl: string;
    specifications: Record<string, string>;
    description?: string;
}

export interface LendingRecord {
    id: string;
    hardDeviceId: string;
    studentId: string;
    studentName: string;
    borrowDate: Date;
    returnDate?: Date;
    status: 'active' | 'returned';
    notes?: string;
}

export interface FilterParams {
    search?: string;
    type?: string;
    brand?: string;
    status?: string;
}

export interface BorrowFormData {
    studentId: string;
    studentName: string;
    notes?: string;
    expectedReturnDate?: Date;
}

export interface LendingHistoryRecord {
    id: string;
    deviceId: string;
    studentId: string;
    studentName: string;
    borrowDate: string;
    returnDate?: string;
    status: 'active' | 'returned';
    notes?: string;
}