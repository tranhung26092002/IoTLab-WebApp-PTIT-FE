export interface Device {
    id: number;
    deviceId: string;
    name: string;
    type: string;
    location: string;
    createdAt: string;
    updatedAt?: string;
}