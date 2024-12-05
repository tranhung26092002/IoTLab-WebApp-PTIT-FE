// src/utils/deviceUtils.ts
import { Device } from '../types/dashboard';

export const toggleDevice = (devices: Device[], index: number, checked: boolean): Device[] => {
    const newDevices = [...devices];
    newDevices[index].status = checked;
    return newDevices;
};