import React from 'react';
import { Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Attendance } from '../../types/user';
import dayjs from 'dayjs';

interface AttendanceTableProps {
  attendances: Attendance[];
}


const AttendanceTable: React.FC<AttendanceTableProps> = ({ attendances }) => {
  const formatCreatedAt = (createdAt: number[] | null) => {
    if (!createdAt) return null;
    const [year, month, day, hour, minute] = createdAt;
    return dayjs(`${year}-${month}-${day} ${hour}:${minute}`);
  };

  const columns: ColumnsType<Attendance> = [
    {
      title: 'Student ID',
      dataIndex: 'userName',
      key: 'studentId',
      width: 200,
      render: (userName: string) => (
        <span className="font-medium">{userName || '-'}</span>
      ),
      sorter: (a, b) => (a.userName || '').localeCompare(b.userName || ''),
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'name',
      render: (fullName: string) => (
        <span className="font-medium text-blue-800">{fullName || '-'}</span>
      ),
      sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
    },
    {
      title: 'Class',
      dataIndex: 'classCode',
      key: 'class',
      width: 120,
      render: (classCode: string) => (
        <Tag color="cyan" className="text-center px-2">
          {classCode || '-'}
        </Tag>
      ),
      filters: Array.from(new Set(attendances.map(a => a.classCode)))
        .filter(Boolean)
        .map(classCode => ({ text: classCode, value: classCode })),
      onFilter: (value, record) => record.classCode === value,
    },
    {
      title: 'Date',
      key: 'date',
      width: 120,
      render: (record: Attendance) => {
        const date = formatCreatedAt(record.checkInTime as unknown as number[]);
        return date ? (
          <span className="font-medium">
            {date.format('DD/MM/YYYY')}
          </span>
        ) : '-';
      },
      sorter: (a, b) => {
        const dateA = formatCreatedAt(a.checkInTime as unknown as number[]);
        const dateB = formatCreatedAt(b.checkInTime as unknown as number[]);
        if (!dateA || !dateB) return 0;
        return dateA.valueOf() - dateB.valueOf();
      },
    },
    {
      title: 'Time',
      key: 'time',
      width: 100,
      render: (record: Attendance) => {
        const date = formatCreatedAt(record.checkInTime as unknown as number[]);
        return date ? (
          <Tooltip title={date.format('DD/MM/YYYY HH:mm:ss')}>
            <span className="text-blue-600 font-medium">
              {date.format('HH:mm')}
            </span>
          </Tooltip>
        ) : '-';
      },
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      width: 120,
      render: (shift: string) => {
        const shiftConfig: Record<string, { color: string; text: string }> = {
          'MORNING': { color: 'blue', text: 'Morning' },
          'AFTERNOON': { color: 'orange', text: 'Afternoon' },
          'EVENING': { color: 'purple', text: 'Evening' },
        };
        
        return (
          <Tag 
            color={shiftConfig[shift]?.color || 'default'}
            className="py-1 px-3 text-center font-medium"
          >
            {shiftConfig[shift]?.text || shift}
          </Tag>
        );
      },
      filters: [
        { text: 'Morning', value: 'MORNING' },
        { text: 'Afternoon', value: 'AFTERNOON' },
        { text: 'Evening', value: 'EVENING' },
      ],
      onFilter: (value, record) => record.shift === value,
    }
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={attendances}
      rowKey="id"
      pagination={{ 
        pageSize: 10,
        showTotal: (total) => `Total ${total} attendance records`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 800 }}
      bordered
      size="middle"
      className="attendance-table"
      rowClassName={(record, index) => 
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }
    />
  );
};

export default AttendanceTable;