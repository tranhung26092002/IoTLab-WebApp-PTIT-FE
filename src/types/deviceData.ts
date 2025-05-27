export interface SensorData {
    id: number;
    temperature: number;
    humidity: number;
    light: number;
    gas: number;
    alertLed: number;
    buzzer: number;
    led: number;
    fan: number;
    servo: number;
    broker: string;
    topic: string;
    payload: string;
    createdAt: number[];
}

export type DeviceCommand = {
    deviceName: string;
    [key: string]: string | number;
};
