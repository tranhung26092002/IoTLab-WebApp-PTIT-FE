export interface AddressResponse {
    addressDetail: string;
    codeWard: string;
    nameWard: string;
    codeDistrict: string;
    nameDistrict: string;
    codeProvince: string;
    nameProvince: string;
}

export interface User {
    createdAt: string;
    updatedAt: string;
    id: number;
    userName: string;
    fullName: string;
    avatarUrl: string;
    phoneNumber: string;
    email: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address: AddressResponse | null;
    dateOfBirth?: string;
    status: string;
    roleType: string;
}

export interface PageResponse<T> {
    data: T[];
    metadata: {
        page: number;
        size: number;
        total: number;
    };
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}