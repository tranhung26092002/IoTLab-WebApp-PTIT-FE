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
    phoneNumber: string;
    email: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address: AddressResponse | null;
    dateOfBirth?: string;
    status: string;
    roleType: string;
}
