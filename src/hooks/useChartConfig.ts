// src/hooks/useChartConfig.ts
import { Sensor, SensorData, ChartConfig } from '../types/dashboard';

export const useChartConfig = (
    sensor: Pick<Sensor, 'key' | 'title' | 'color' | 'unit'>,
    sensorData: SensorData[]
): ChartConfig => {
    return {
        data: sensorData.map(d => ({ time: d.time, value: d[sensor.key] })),
        xField: 'time',
        yField: 'value',
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1500,
            },
        },
        color: sensor.color,
        point: {
            size: 4,
            style: {
                fill: sensor.color,
                stroke: '#fff',
                lineWidth: 2,
            },
        },
        tooltip: {
            formatter: (datum) => ({
                name: sensor.title,
                value: `${datum.value} ${sensor.unit}`,
            }),
        },
        yAxis: {
            label: {
                formatter: (v) => `${v}${sensor.unit}`,
            },
        },
    };
};