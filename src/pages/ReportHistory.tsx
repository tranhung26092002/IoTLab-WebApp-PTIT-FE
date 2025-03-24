import React, { useState } from "react";
import { Card, Table, Button, Modal, Typography, message, Tag, Pagination } from "antd";
import { ContactsOutlined, EditOutlined } from "@ant-design/icons";
import { useReport } from "../hooks/useReport";
import type { ReportData, StudentInfo } from "../types/report";
import dayjs from "dayjs";
import AppLayout from "../components/AppLayout";
import { motion } from "framer-motion";
import { FilterForm } from '../components/report/FilterForm';
import type { ReportFilters } from '../types/report';
import { ReportHistoryDetail } from "../components/report/ReportHistoryDetail";

const formatCreatedAt = (createdAt: number[] | null) => {
  if (!createdAt) return null;
  const [year, month, day, hour, minute] = createdAt;
  return dayjs(`${year}-${month}-${day} ${hour}:${minute}`);
};;

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Bản nháp', color: 'default' },
  { value: 'SUBMITTED', label: 'Đã nộp', color: 'blue' },
  { value: 'PENDING', label: 'Chờ duyệt', color: 'orange' },
  { value: 'APPROVED', label: 'Đã duyệt', color: 'green' },
  { value: 'REJECTED', label: 'Từ chối', color: 'red' },
];

const ReportHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});

  // Get reports data and methods from hook
  const {
    isUpdating,
    changeReportStatus,
    useFilteredReportsOfMe,
  } = useReport({
    enableStudentReports: true
  });

  const {
    reportsOfMe: reports,
    isLoading,
    metadata,
    handlePageChange,
    handleSizeChange
  } = useFilteredReportsOfMe({
      ...filters,
      page: currentPage - 1, // Convert to 0-based for API
      size: pageSize,
      sortField: filters.sortField,
      sortOrder: filters.sortOrder
  });

  const handleFilter = (newFilters: ReportFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const onPaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handlePageChange(page - 1); // Convert to 0-based for API
    handleSizeChange(size);
  };

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
          const statusInfo = STATUS_OPTIONS.find(s => s.value === status);
          return (
          <Tag color={statusInfo?.color || 'default'}>
              {statusInfo?.label || status}
          </Tag>
          );
      },
    },
    {
      title: 'Tên bài thực hành',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Sinh viên thực hiện',
      dataIndex: 'students',
      key: 'students',
      render: (students: StudentInfo[]) => students.map(s => s.name).join(', '),
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Ca thực hành',
      dataIndex: 'shift',
      key: 'shift',
      render: (shift: string) => `Ca ${shift}`,
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: number[]) => {
        const date = formatCreatedAt(createdAt);
        return date ? date.format('DD/MM/YYYY HH:mm') : 'Chưa có';
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: ReportData) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={() => handleViewReport(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const handleViewReport = (report: ReportData) => {
    setSelectedReport(report);
    setIsModalVisible(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport?.id || selectedReport.status !== 'DRAFT') return;
    
    try {
      await changeReportStatus({ 
        id: selectedReport.id, 
        status: 'SUBMITTED' 
      });
      
      // Update selected report
      setSelectedReport(prev => prev ? {
        ...prev,
        status: 'SUBMITTED'
      } : null);
      
      setIsModalVisible(false);
      message.success('Nộp báo cáo thành công');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
    }
  };

  return (
    <AppLayout>
        <div className="p-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
            <ContactsOutlined /> Lịch sử báo cáo thực hành
          </Typography.Title>
        </motion.div>
        
        {/* Filters */}
        <Card className="mb-6">
          <FilterForm
            onFilter={handleFilter}
            loading={isLoading}
            initialValues={filters}
          />
        </Card>

        {/* Reports Table */}
        <Card className="shadow-md">
          <Table
              columns={columns}
              dataSource={reports as unknown as readonly ReportData[]}
              loading={isLoading}
              rowKey="id"
              pagination={false}
          />
          <div className="border-t border-gray-200 pt-4 px-4">
              <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={metadata?.total || 0}
                  showTotal={(total) => `Tổng ${total} báo cáo`}
                  showSizeChanger
                  onChange={onPaginationChange}
                  className="flex justify-end items-center"
                  pageSizeOptions={[10, 20, 50, 100]}
              />
          </div>
      </Card>

        {/* Report Detail Modal */}
        <Modal
            title="Chi tiết báo cáo thực hành"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            width={1200}
            footer={null}
        >
            {selectedReport && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                      <h3 className="font-medium mb-2">Thông tin chung</h3>
                      <p><strong>Mã bài thực hành:</strong> Bài {selectedReport.practiceId}</p>
                      <p><strong>Tên bài:</strong> {selectedReport.title}</p>
                      <p><strong>Lớp:</strong> {selectedReport.className}</p>
                      <p><strong>Nhóm:</strong> {selectedReport.classGroup}</p>
                      <p><strong>Ca thực hành:</strong> Ca {selectedReport.shift}</p>
                      <p><strong>Giảng viên hướng dẫn:</strong> {selectedReport.instructor?.name}</p>
                      <p><strong>Ngày nộp:</strong> {
                        Array.isArray(selectedReport.createdAt) ? formatCreatedAt(selectedReport.createdAt)?.format('DD/MM/YYYY HH:mm') : 'Chưa có'
                      }</p>
                  </div>
                  <div>
                      <h3 className="font-medium mb-2">Sinh viên thực hiện</h3>
                      {selectedReport.students.map((student, index) => (
                      <p key={index}>{student.name} - {student.studentCode}</p>
                      ))}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Trạng thái báo cáo</h3>
                    <Tag color={STATUS_OPTIONS.find(s => s.value === selectedReport.status)?.color || 'default'}>
                      {STATUS_OPTIONS.find(s => s.value === selectedReport.status)?.label || selectedReport.status}
                    </Tag>
                  </div>
                </div>

                <div>
                <h3 className="font-medium mb-2">Nội dung thực hành</h3>
                <ReportHistoryDetail
                  practiceContents={selectedReport.reportContents}
                />
                </div>

                <div>
                <h3 className="font-medium mb-2">Thảo luận</h3>
                <p className="bg-gray-50 p-4 rounded">{selectedReport.discussion}</p>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button onClick={() => setIsModalVisible(false)}>
                    Đóng
                  </Button>
                  
                  {selectedReport.status === 'DRAFT' && (
                    <Button 
                      type="primary"
                      loading={isUpdating}
                      onClick={handleUpdateReport}
                    >
                      Nộp báo cáo
                    </Button>
                  )}
                </div>
            </div>
            )}
        </Modal>
        </div>
    </AppLayout>
  );
};

export default ReportHistory;