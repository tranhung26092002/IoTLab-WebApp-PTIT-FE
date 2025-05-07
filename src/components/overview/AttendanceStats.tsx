import React from 'react';
import { Row, Col } from 'antd';
import StatisticCard from './StatisticCard';
import { CheckCircleOutlined, CloseCircleOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface AttendanceStatsProps {
  total: number;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({   
  total, 
  }) => {
  const totalStudents = total;
  
  // Since the Attendance interface doesn't have a status field, 
  // we'll consider all records as present for now
  const presentStudents = totalStudents;
  const absentStudents = 0;
  const attendanceRate = totalStudents > 0 ? 100 : 0;

  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={12} md={6}>
        <StatisticCard 
          title="Tổng số sinh viên"
          value={totalStudents}
          icon={<TeamOutlined />}
          color="blue"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard 
          title="Đã điểm danh"
          value={presentStudents}
          icon={<CheckCircleOutlined />}
          color="green"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard 
          title="Vắng mặt"
          value={absentStudents}
          icon={<CloseCircleOutlined />}
          color="red"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard 
          title="Tỷ lệ điểm danh"
          value={`${attendanceRate}%`}
          icon={<ClockCircleOutlined />}
          color="purple"
        />
      </Col>
    </Row>
  );
};

export default AttendanceStats;