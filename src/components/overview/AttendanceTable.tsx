import React from 'react';
import { Card, Pagination, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Attendance } from '../../types/user';
import dayjs from 'dayjs';

interface AttendanceTableProps {
  attendances: Attendance[];
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, size: number) => void;
}

const formatCreatedAt = (createdAt: number[] | null) => {
  if (!createdAt) return null;
  const [year, month, day, hour, minute] = createdAt;
  return dayjs(`${year}-${month}-${day} ${hour}:${minute}`);
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  attendances,
  loading,
  currentPage,
  pageSize,
  total,
  onPageChange
}) => {

  const columns: ColumnsType<Attendance> = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'userName',
      key: 'studentId',
      width: 200,
      render: (userName: string) => (
        <span className="font-medium">{userName || '-'}</span>
      ),
      sorter: (a, b) => (a.userName || '').localeCompare(b.userName || ''),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'name',
      render: (fullName: string) => (
        <span className="font-medium text-blue-800">{fullName || '-'}</span>
      ),
      sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
    },
    {
      title: 'Lớp',
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
      title: 'Ngày',
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
      title: 'Thời gian',
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
      title: 'Ca',
      dataIndex: 'shift',
      key: 'shift',
      width: 120,
      render: (shift: string) => {
        const shiftConfig: Record<string, { color: string; text: string }> = {
          'Sáng': { color: 'blue', text: 'Morning' },
          'Chiều': { color: 'orange', text: 'Afternoon' },
          'Tối': { color: 'purple', text: 'Evening' },
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
        { text: 'Sáng', value: 'MORNING' },
        { text: 'Chiều', value: 'AFTERNOON' },
        { text: 'Tối', value: 'EVENING' },
      ],
      onFilter: (value, record) => record.shift === value,
    }
  ];

  return (
    <Card className="shadow-md">
      <Table
        columns={columns}
        dataSource={attendances}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <div className="border-t border-gray-200 pt-4 px-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showTotal={(total) => `Tổng ${total} lượt điểm danh`}
          showSizeChanger
          onChange={onPageChange}
          className="flex justify-end items-center"
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </Card>
  );
};

export default AttendanceTable;
