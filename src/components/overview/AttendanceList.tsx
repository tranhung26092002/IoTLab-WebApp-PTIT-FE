import React, { useState } from 'react';
import { Table, Tag, Input, DatePicker, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AttendanceRecord {
  key: string;
  studentId: string;
  name: string;
  class: string;
  date: string;
  status: 'present' | 'absent';
  timeIn: string | null;
}

interface AttendanceListProps {
  data: AttendanceRecord[];
}

const AttendanceList: React.FC<AttendanceListProps> = ({ data }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      filters: Array.from(new Set(data.map(item => item.class))).map(cls => ({ text: cls, value: cls })),
      onFilter: (value, record) => record.class === value,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Time In',
      dataIndex: 'timeIn',
      key: 'timeIn',
      render: (timeIn) => timeIn || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'present' ? 'green' : 'red'}>
          {status === 'present' ? 'Present' : 'Absent'}
        </Tag>
      ),
    },
  ];

  const filteredData = data.filter(item => {
    // Filter by search text
    const matchesSearch = !searchText || 
      item.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.class.toLowerCase().includes(searchText.toLowerCase());
      
    // Filter by status
    const matchesStatus = !statusFilter || item.status === statusFilter;
    
    // Filter by date range
    let matchesDateRange = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const itemDate = new Date(item.date);
      matchesDateRange = itemDate >= dateRange[0].startOf('day') && 
                          itemDate <= dateRange[1].endOf('day');
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <Input 
          placeholder="Search by ID, name or class"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        
        <Select 
          placeholder="Filter by status"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="present">Present</Option>
          <Option value="absent">Absent</Option>
        </Select>
        
        <RangePicker 
          onChange={(dates) => setDateRange(dates)}
          className="w-auto"
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        pagination={{ 
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
        }}
        className="bg-white"
        rowClassName={(record) => 
          record.status === 'absent' ? 'bg-red-50' : ''
        }
        bordered
      />
    </div>
  );
};

export default AttendanceList;
