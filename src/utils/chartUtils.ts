// src/utils/chartUtils.ts
import { Sensor, SensorData, ChartConfig } from '../types/dashboard';
import { useChartConfig } from '../hooks/useChartConfig';

export const generateChartConfigs = (sensors: Sensor[], sensorData: SensorData[]): ChartConfig[] => {
    return sensors.map(sensor => useChartConfig(sensor, sensorData));
};