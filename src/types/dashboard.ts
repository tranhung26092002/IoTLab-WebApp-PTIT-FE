// src/types/dashboard.ts
import { ReactElement } from 'react';

export interface Device {
    id: number;
    name: string;
    icon: ReactElement;
    status: boolean;
}

export interface SensorData {
    time: string;
    temperature: number;
    humidity: number;
    light: number;
    dust: number;
    gas: number;
}

export interface Sensor {
    key: keyof Omit<SensorData, 'time'>;
    title: string;
    value: string;
    icon: string;
    color: string;
    warning: number;
    unit: string;
}

export interface ChartConfig {
    data: { time: string; value: number }[];
    xField: string;
    yField: string;
    smooth: boolean;
    animation: {
        appear: {
            animation: string;
            duration: number;
        };
    };
    color: string;
    point: {
        size: number;
        style: {
            fill: string;
            stroke: string;
            lineWidth: number;
        };
    };
    tooltip: {
        formatter: (datum: { time: string; value: number }) => {
            name: string;
            value: string;
        };
    };
    yAxis: {
        label: {
            formatter: (v: number) => string;
        };
    };
}