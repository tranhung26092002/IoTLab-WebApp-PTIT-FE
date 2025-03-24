import React, { useState } from "react";
import { Card, Table, Button, Modal, Typography, message, Tag, Select, Pagination } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useReport } from "../hooks/useReport";
import type { ReportData, StudentInfo } from "../types/report";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ReportContentTableAdmin } from "../components/report/ReportContentTableAdmin";
import { FilterForm } from '../components/report/FilterForm';
import type { ReportFilters } from '../types/report';
import AppLayoutAdmin from "../components/AppLayoutAdmin";

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Bản nháp', color: 'default' },
  { value: 'SUBMITTED', label: 'Đã nộp', color: 'blue' },
  { value: 'PENDING', label: 'Chờ duyệt', color: 'orange' },
  { value: 'APPROVED', label: 'Đã duyệt', color: 'green' },
  { value: 'REJECTED', label: 'Từ chối', color: 'red' },
];

const formatCreatedAt = (createdAt: number[] | null) => {
  if (!createdAt) return null;
  const [year, month, day, hour, minute] = createdAt;
  return dayjs(`${year}-${month}-${day} ${hour}:${minute}`);
};

const ReportManager: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [newStatus, setNewStatus] = useState<string | null>(null);

  // Get reports data and methods from hook
  const {
    isUpdating,
    changeReportStatus,
    changeEvaluation,
    isUpdatingEvaluation,
    useFilteredReports,
  } = useReport({
    enableReports: true,
  });

  const {
    reports,
    isLoading,
    metadata,
    handlePageChange,
    handleSizeChange
  } = useFilteredReports({
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

  const handleEvaluationChange = async (contentId: number, evaluation: number) => {
    if (!selectedReport) return;
  
    try {
      await changeEvaluation({ contentId, evaluation });
      
      // Update only the specific content's evaluation
      setSelectedReport(prev => {
        if (!prev) return null;
        return {
          ...prev,
          reportContents: prev.reportContents.map(content => 
            content.id === contentId 
              ? { ...content, evaluation } 
              : content
          )
        };
      });
      
      message.success('Cập nhật điểm thành công');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
    }
  };

  const handleUpdateReport = async () => {
    if (!selectedReport?.id || !newStatus) return;
    
    try {
      // Only update if status has changed
      if (newStatus !== selectedReport.status) {
        await changeReportStatus({ 
          id: selectedReport.id, 
          status: newStatus 
        });
        
        // Update selected report
        setSelectedReport(prev => prev ? {
          ...prev,
          status: newStatus
        } : null);
        
        setNewStatus(null); // Reset new status
        setIsModalVisible(false);
        message.success('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
    }
  };

  return (
    <AppLayoutAdmin>
      <div className="p-6">
        <motion.div className="mb-8">
          <Typography.Title level={2}>
            Quản lý báo cáo thực hành
          </Typography.Title>
        </motion.div>

        <Card className="mb-6">
          <FilterForm
            onFilter={handleFilter}
            loading={isLoading}
            initialValues={filters}
          />
        </Card>

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
                    <Select
                      value={newStatus || selectedReport.status}
                      onChange={(value) => setNewStatus(value)}
                      style={{ width: '100%' }}
                      disabled={isUpdating}
                    >
                      {STATUS_OPTIONS.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          <Tag color={option.color}>{option.label}</Tag>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                <h3 className="font-medium mb-2">Nội dung thực hành</h3>
                <ReportContentTableAdmin
                  practiceContents={selectedReport.reportContents}
                  onEvaluationChange={handleEvaluationChange}
                  isUpdating={isUpdating || isUpdatingEvaluation }
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

                  <Button 
                      type="primary"
                      loading={isUpdating}
                      onClick={() => handleUpdateReport()}
                  >
                      Lưu thay đổi
                  </Button>
                </div>
            </div>
            )}
        </Modal>
        </div>
    </AppLayoutAdmin>
  );
};

export default ReportManager;