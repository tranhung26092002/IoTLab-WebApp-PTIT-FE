import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';
import { motion } from 'framer-motion';
import {
  DashboardOutlined,
  ChromeOutlined,
  DashboardFilled,
  BulbOutlined,
  AlertOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  NotificationOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useSensorData } from '../hooks/useSensorData';
import { SensorMonitorCard } from '../components/dashboard/SensorMonitorCard';
import { DeviceControlCard } from '../components/dashboard/DeviceControlCard';
import { SensorChart } from '../components/dashboard/SensorChart';
import { BrokerInfoCard } from '../components/dashboard/BrokerInfoCard';
import { BrokerControlCard } from '../components/dashboard/BrokerControlCard';
import AppLayout from '../components/AppLayout';

interface SensorHistory {
  temperature: Array<{ time: string; value: number }>;
  humidity: Array<{ time: string; value: number }>;
  light: Array<{ time: string; value: number }>;
  gas: Array<{ time: string; value: number }>;
}

const DashboardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lastUpdateTime = useRef<number>(Date.now());
  const UPDATE_INTERVAL = 2000; // 2 seconds between updates
  const {
    sensorData,
    toggleLed,
    toggleBuzzer,
    toggleFan,
    toggleAlertLed,
    toggleServo
  } = useSensorData(id || '');

  const [sensorHistory, setSensorHistory] = useState<SensorHistory>({
    temperature: [],
    humidity: [],
    light: [],
    gas: []
  });

useEffect(() => {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime.current >= UPDATE_INTERVAL) {
      const timestamp = new Date().toLocaleTimeString();
      
      setSensorHistory(prev => {
        const newHistory = {
          temperature: [...prev.temperature, { time: timestamp, value: sensorData.sensors.temperature }],
          humidity: [...prev.humidity, { time: timestamp, value: sensorData.sensors.humidity }],
          light: [...prev.light, { time: timestamp, value: sensorData.sensors.light }],
          gas: [...prev.gas, { time: timestamp, value: sensorData.sensors.gas }]
        };

        // Keep only last 10 points for each sensor
        Object.keys(newHistory).forEach(key => {
          if (newHistory[key as keyof SensorHistory].length > 10) {
            newHistory[key as keyof SensorHistory] = newHistory[key as keyof SensorHistory].slice(-10);
          }
        });

        lastUpdateTime.current = currentTime;
        return newHistory;
      });
    }
  }, [sensorData]);

  const sensorConfigs = [
    {
      name: "Temperature",
      value: sensorData.sensors.temperature,
      unit: "°C",
      threshold: 30,
      icon: <ChromeOutlined />,
      color: "#f5222d"
    },
    {
      name: "Humidity",
      value: sensorData.sensors.humidity,
      unit: "%",
      threshold: 80,
      icon: <DashboardFilled />,
      color: "#1890ff"
    },
    {
      name: "Light",
      value: sensorData.sensors.light,
      unit: "lux",
      threshold: 1000,
      icon: <BulbOutlined />,
      color: "#faad14"
    },
    {
      name: "Gas",
      value: sensorData.sensors.gas,
      unit: "ppm",
      threshold: 100,
      icon: <ApiOutlined />,
      color: "#722ed1"
    }
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Typography.Title level={2} className="text-[#2c4a2d] flex items-center gap-2">
            <DashboardOutlined /> Dashboard
          </Typography.Title>
        </motion.div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} lg={12}>
            <BrokerInfoCard
              broker={sensorData.data.broker}
              topic={sensorData.data.topic}
              payload={sensorData.data.payload}
            />
          </Col>
          <Col xs={24} lg={12}>
            <BrokerControlCard
              deviceId={id || ''}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mb-8">
          {sensorConfigs.map((sensor, index) => (
            <SensorMonitorCard
              key={sensor.name}
              name={sensor.name}
              value={sensor.value}
              unit={sensor.unit}
              warningThreshold={sensor.threshold}
              index={index}
              icon={sensor.icon}
            />
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mb-8">
          <DeviceControlCard
            name="LED"
            status={sensorData.status.led}
            onToggle={toggleLed}
            index={0}
            icon={<BulbOutlined />}
          />
          <DeviceControlCard
            name="Buzzer"
            status={sensorData.status.buzzer}
            onToggle={toggleBuzzer}
            index={1}
            icon={<NotificationOutlined />}
          />
          <DeviceControlCard
            name="Fan"
            status={sensorData.status.fan}
            onToggle={toggleFan}
            index={2}
            icon={<ThunderboltOutlined />}
          />
          <DeviceControlCard
            name="Alert LED"
            status={sensorData.status.alert_led}
            onToggle={toggleAlertLed}
            index={3}
            icon={<AlertOutlined />}
          />
          <DeviceControlCard
            name="Servo"
            status={sensorData.status.servo}
            onToggle={toggleServo}
            index={4}
            icon={<RobotOutlined />}
          />
        </Row>

        <Row gutter={[16, 16]}>
          {Object.entries(sensorHistory).map(([key, data], index) => (
            <Col xs={24} lg={12} key={key}>
              <SensorChart
                name={key}
                data={data}
                index={index}
                color={sensorConfigs[index].color}
              />
            </Col>
          ))}
        </Row>
      </div>
    </AppLayout>
  );
};

export default DashboardDetail;