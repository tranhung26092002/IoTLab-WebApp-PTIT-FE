import React from 'react';
import { Card, Badge, Typography, Button } from 'antd';
import { RightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LabReport } from '../../types/report';

const { Text } = Typography;

interface LabReportCardProps {
  report: LabReport;
  onClick: () => void;
}

const LabReportCard: React.FC<LabReportCardProps> = ({ report, onClick }) => {
  return (
    <Card 
      hoverable 
      className="group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-[var(--card-bg)]"
      cover={
        <div className="relative">
          <img 
            alt={report.title} 
            src={report.image} 
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {report.status && (
            <Badge 
              status={report.status === 'submitted' ? 'success' : 'warning'}
              text={report.status.toUpperCase()}
              className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded"
            />
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-2">
          {report.title}
        </h3>
        <Text className="text-[var(--text-secondary)] line-clamp-2">
          {report.description}
        </Text>
        {report.dueDate && (
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <ClockCircleOutlined />
            <Text>Due: {report.dueDate}</Text>
          </div>
        )}
        <Button 
          type="primary"
          icon={<RightOutlined />}
          onClick={onClick}
          className="w-full mt-4 hover:scale-105 transition-transform"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default LabReportCard;