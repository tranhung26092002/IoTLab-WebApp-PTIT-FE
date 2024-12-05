// constants/dashboardData.ts
import React from 'react';
import { Device, SensorData, Sensor } from '../types/dashboard';
import { ApiOutlined, BulbOutlined, BorderOuterOutlined, ThunderboltOutlined } from '@ant-design/icons';

export const INITIAL_DEVICES: Device[] = [
    {
        id: 1,
        name: 'Quạt',
        icon: React.createElement(ApiOutlined),
        status: false
    },
    {
        id: 2,
        name: 'Đèn',
        icon: React.createElement(BulbOutlined),
        status: false
    },
    {
        id: 3,
        name: 'Rèm cửa',
        icon: React.createElement(BorderOuterOutlined),
        status: false
    },
    {
        id: 4,
        name: 'Điều hòa',
        icon: React.createElement(ThunderboltOutlined),
        status: false
    },
];

export const MOCK_SENSOR_DATA: SensorData[] = [
    { time: '00:00', temperature: 25, humidity: 60, light: 200, dust: 35, gas: 450 },
    { time: '04:00', temperature: 24, humidity: 62, light: 150, dust: 30, gas: 400 },
    { time: '08:00', temperature: 26, humidity: 58, light: 300, dust: 40, gas: 500 },
    { time: '12:00', temperature: 28, humidity: 55, light: 800, dust: 45, gas: 550 },
    { time: '16:00', temperature: 27, humidity: 57, light: 600, dust: 42, gas: 520 },
    { time: '20:00', temperature: 25, humidity: 61, light: 250, dust: 38, gas: 480 },
];

export const SENSORS: Sensor[] = [
    {
        key: 'temperature' as const,
        title: 'Temperature',
        value: '26°C',
        icon: '🌡️',
        color: '#2c4a2d',
        warning: 30,
        unit: '°C'
    },
    {
        key: 'humidity' as const,
        title: 'Humidity',
        value: '60%',
        icon: '💧',
        color: '#2c4a2d',
        warning: 70,
        unit: '%'
    },
    {
        key: 'light' as const,
        title: 'Light',
        value: '500 lux',
        icon: '☀️',
        color: '#2c4a2d',
        warning: 1000,
        unit: 'lux'
    },
    // {
    //   key: 'dust',
    //   title: 'Dust',
    //   value: '35 µg/m³',
    //   icon: '💨',
    //   color: '#2c4a2d',
    //   warning: 50,
    //   unit: 'µg/m³'
    // },
    {
        key: 'gas' as const,
        title: 'Gas',
        value: '450 ppm',
        icon: '🌫️',
        color: '#2c4a2d',
        warning: 600,
        unit: 'ppm'
    }
];