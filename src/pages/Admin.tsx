import React from 'react';
import { Layout, Typography, Button, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import AppLayoutAdmin from '../components/AppLayoutAdmin';
import AttendanceManagement from '../components/overview/AttendanceManagement';
import { exportToExcel } from '../utils/excelExport';
import { useUsers } from '../hooks/useUsers';

const { Title } = Typography;
const { Content } = Layout;

const Admin: React.FC = () => {
  const { attendances, isLoadingAttendances } = useUsers({ enableAttendance: true });

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
          <AttendanceManagement attendances={attendances} />
        )}
      </Content>
    </AppLayoutAdmin>
  );
};

export default Admin;