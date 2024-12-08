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
    fullName: string | null;
    phoneNumber: string | null;
    email: string | null;
    gender: string | null;
    address: AddressResponse | null;
    dateOfBirth: string | null;
    status: string;
    roleType: string;
}
