// src/pages/Dashboard.tsx
import React, { useMemo, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { motion } from 'framer-motion';
import { DashboardOutlined } from '@ant-design/icons';
import { DeviceCard } from '../components/dashboard/DeviceCard';
import { SensorCard } from '../components/dashboard/SensorCard';
import { SensorChart } from '../components/dashboard/SensorChart';
import { INITIAL_DEVICES, MOCK_SENSOR_DATA, SENSORS } from '../data/dashboardData';
import { toggleDevice } from '../utils/deviceUtils';
import { generateChartConfigs } from '../utils/chartUtils';
import AppLayoutAdmin from '../components/AppLayoutAdmin';

const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const chartConfigs = useMemo(() =>
    generateChartConfigs(SENSORS, MOCK_SENSOR_DATA),
    []
  );

  const handleDeviceToggle = (index: number) => (checked: boolean) => {
    setDevices(toggleDevice(devices, index, checked));
  };

  return (
    <AppLayoutAdmin>
      <div className="p-6 space-y-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52] py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
            <DashboardOutlined /> IoT Dashboard
          </Typography.Title>
        </motion.div>

        <Row gutter={[16, 16]}>
          {devices.map((device, index) => (
            <Col xs={24} sm={12} md={6} key={device.id}>
              <DeviceCard
                device={device}
                index={index}
                onToggle={handleDeviceToggle(index)}
              />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          {SENSORS.map((sensor, index) => (
            <Col xs={24} sm={12} md={6} key={sensor.key}>
              <SensorCard sensor={sensor} index={index} />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          {SENSORS.map((sensor, index) => (
            <Col xs={24} lg={12} key={sensor.key}>
              <SensorChart
                sensor={sensor}
                index={index}
                chartConfig={chartConfigs[index]}
              />
            </Col>
          ))}
        </Row>
      </div>
    </AppLayoutAdmin>
  );
};

export default Dashboard;