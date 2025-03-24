import React from 'react';
import { Input, Select, Space, Button, Card } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { PracticeFilter } from '../../types/practice';
import { PracticeStatus } from '../../types/practice';

interface PracticeFiltersProps {
  filters: PracticeFilter;
  onFilterChange: (filters: PracticeFilter) => void;
}

export const PracticeFilters: React.FC<PracticeFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: keyof PracticeFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined // Remove empty values
    });
  };

  const handleReset = () => {
    onFilterChange({});
  };

  return (
    <Card className="mb-6 shadow-sm">
      <Space direction="vertical" className="w-full">
        <Space wrap className="w-full justify-between">
          <Space wrap>
            {/* Search by title */}
            <Input.Search
              placeholder="Tìm kiếm bài thực hành..."
              allowClear
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined className="text-gray-400" />}
            />
            
            {/* Filter by status */}
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 200 }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              {Object.entries(PracticeStatus).map(([key, value]) => (
                <Select.Option key={value} value={value}>
                  {key === 'DRAFT' && 'Nháp'}
                  {key === 'PUBLISHED' && 'Đã xuất bản'}
                  {key === 'ARCHIVED' && 'Đã lưu trữ'}
                </Select.Option>
              ))}
            </Select>

            {/* Sort options */}
            <Select
              placeholder="Sắp xếp theo"
              allowClear
              style={{ width: 200 }}
              value={filters.sortField}
              onChange={(value) => handleFilterChange('sortField', value)}
            >
              <Select.Option value="createdAt">Ngày tạo</Select.Option>
              <Select.Option value="title">Tên bài thực hành</Select.Option>
              <Select.Option value="status">Trạng thái</Select.Option>
            </Select>

            {/* Sort order */}
            {filters.sortField && (
              <Select
                value={filters.sortOrder}
                onChange={(value) => handleFilterChange('sortOrder', value)}
                style={{ width: 120 }}
              >
                <Select.Option value="asc">Tăng dần</Select.Option>
                <Select.Option value="desc">Giảm dần</Select.Option>
              </Select>
            )}
          </Space>

          {/* Reset button */}
          <Button 
            onClick={handleReset}
            icon={<FilterOutlined />}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Đặt lại bộ lọc
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default PracticeFilters;