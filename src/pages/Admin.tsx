import React, { useState } from 'react';
import { Layout, Typography, Button, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import AppLayoutAdmin from '../components/AppLayoutAdmin';
import AttendanceManagement from '../components/overview/AttendanceManagement';
import { exportToExcel } from '../utils/excelExport';
import { useUsers } from '../hooks/useUsers';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Content } = Layout;

const Admin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedDate, setSelectedDate] = useState<string>();

  const { useAttendances } = useUsers();

  const {
    attendances,
    isLoading: isLoadingAttendances,
    metadata,
    handlePageChange,
    handleSizeChange,
    handleDateChange
  } = useAttendances(currentPage - 1, pageSize, selectedDate);

  const onPaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handlePageChange(page - 1);
    handleSizeChange(size);
  };

  const onDateChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : undefined;
    setSelectedDate(formattedDate);
    handleDateChange(formattedDate || '');
};
  
  const handleExportData = () => {
    const formattedData = attendances.map(attendance => ({
      userId: attendance.userId,
      userName: attendance.userName,
      fullName: attendance.fullName,
      classCode: attendance.classCode,
      checkInTime: attendance.checkInTime, 
      shift: attendance.shift
    }));

    exportToExcel(formattedData, 'attendance_report');
    message.success('Attendance data exported successfully');
  };

  return (
    <AppLayoutAdmin>
      <Content className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Title level={2} className="text-blue-800 m-0"> 
            Quản lý điểm danh
          </Title>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExportData}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Xuất dữ liệu
          </Button>
        </div>

        {isLoadingAttendances ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <AttendanceManagement 
            attendances={attendances}
            currentPage={currentPage}
            pageSize={pageSize}
            selectedDate={selectedDate || ''}
            onDateChange={onDateChange}
            total={metadata?.total || 0}
            onPageChange={onPaginationChange}
          />
        )}
      </Content>
    </AppLayoutAdmin>
  );
};

export default Admin;