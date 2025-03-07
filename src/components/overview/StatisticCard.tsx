import React from 'react';
import { Card, Statistic } from 'antd';

interface StatisticCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  const iconColorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card 
      className={`${colorMap[color]} border-0 shadow-sm h-full`}
      bodyStyle={{ padding: '20px' }}
    >
      <div className="flex items-center">
        <div className={`${iconColorMap[color]} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium mb-1">{title}</p>
          <Statistic 
            value={value} 
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }} 
          />
        </div>
      </div>
    </Card>
  );
};

export default StatisticCard;
