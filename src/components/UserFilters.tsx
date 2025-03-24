import React from 'react';
import { Input, Select, Space, Button, Card } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { UserFilter } from '../types/user';

const { Option } = Select;

interface UserFiltersProps {
  filters: UserFilter;
  onFilterChange: (filters: UserFilter) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: keyof UserFilter, value: any) => {
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
            <Input.Search
              placeholder="Tìm theo tên người dùng..."
              allowClear
              value={filters.userName}
              onChange={(e) => handleFilterChange('userName', e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined className="text-gray-400" />}
            />

            <Input.Search
              placeholder="Tìm theo tên đầy đủ..."
              allowClear
              value={filters.fullName}
              onChange={(e) => handleFilterChange('fullName', e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined className="text-gray-400" />}
            />

            <Input
              placeholder="Mã lớp"
              allowClear
              value={filters.classCode}
              onChange={(e) => handleFilterChange('classCode', e.target.value)}
              style={{ width: 150 }}
            />

            <Select
              placeholder="Vai trò"
              allowClear
              style={{ width: 150 }}
              value={filters.roleType}
              onChange={(value) => handleFilterChange('roleType', value)}
            >
              <Option value="ADMIN">Admin</Option>
              <Option value="TEACHER">Giáo viên</Option>
              <Option value="STUDENT">Sinh viên</Option>
            </Select>

            <Select
              placeholder="Sắp xếp theo"
              allowClear
              style={{ width: 150 }}
              value={filters.sortField}
              onChange={(value) => handleFilterChange('sortField', value)}
            >
              <Option value="userName">Tên người dùng</Option>
              <Option value="fullName">Tên đầy đủ</Option>
              <Option value="classCode">Mã lớp</Option>
              <Option value="roleType">Vai trò</Option>
            </Select>

            {filters.sortField && (
              <Select
                value={filters.sortOrder}
                onChange={(value) => handleFilterChange('sortOrder', value)}
                style={{ width: 120 }}
              >
                <Option value="asc">Tăng dần</Option>
                <Option value="desc">Giảm dần</Option>
              </Select>
            )}
          </Space>

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

export default UserFilters;