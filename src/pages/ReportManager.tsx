import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Typography, message, Tag, Select } from "antd";
import { ContactsOutlined, EditOutlined } from "@ant-design/icons";
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

const ReportManager: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<ReportData[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [newStatus, setNewStatus] = useState<string | null>(null);

  // Get reports data and methods from hook
  const {
    reports,
    isLoading,
    isUpdating,
    changeReportStatus,
    changeEvaluation,
    isUpdatingEvaluation,
  } = useReport({
    page: page - 1, 
    size: pageSize, 
    enableReports: true,
  });

  // Effect to initialize filtered data
  useEffect(() => {
    if (reports?.data) {
      setFilteredData(reports.data);
    }
  }, [reports?.data]);

  const formatCreatedAt = (createdAt: number[] | null) => {
    if (!createdAt) return null;
    const [year, month, day, hour, minute] = createdAt;
    return dayjs(`${year}-${month}-${day} ${hour}:${minute}`);
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
    // {
    //   title: 'Nhóm',
    //   dataIndex: 'classGroup',
    //   key: 'classGroup',
    // },
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
        
        // Update the filtered data to reflect the change
        setFilteredData(prev => 
          prev.map(item => 
            item.id === selectedReport.id 
              ? { ...item, status: newStatus }
              : item
          )
        );
        
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

  const handleFilter = (newFilters: ReportFilters) => {
    if (!reports?.data) return;

    let filtered = [...reports.data];

    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm) ||
        report.students.some(student => 
          student.name.toLowerCase().includes(searchTerm) ||
          student.studentCode.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (newFilters.className) {
      filtered = filtered.filter(report => 
        report.className.toLowerCase().includes(newFilters.className!.toLowerCase())
      );
    }

    if (newFilters.classGroup) {
      filtered = filtered.filter(report => 
        report.classGroup.toLowerCase().includes(newFilters.classGroup!.toLowerCase())
      );
    }

    if (newFilters.shift) {
      filtered = filtered.filter(report => 
        report.shift === newFilters.shift
      );
    }

    if (newFilters.startDate && newFilters.endDate) {
      // Start date should be at start of selected date (00:00:00)
      // End date should be at end of selected date (23:59:59)
      const startDate = dayjs(newFilters.startDate).startOf('day');
      const endDate = dayjs(newFilters.endDate).endOf('day');
      
      filtered = filtered.filter(report => {
        if (!report.createdAt) return false;
        
        const reportDate = Array.isArray(report.createdAt) 
          ? dayjs(`${report.createdAt[0]}-${report.createdAt[1]}-${report.createdAt[2]} ${report.createdAt[3]}:${report.createdAt[4]}`)
          : dayjs(report.createdAt);
        
        // Compare with full datetime
        return reportDate.isAfter(startDate) && reportDate.isBefore(endDate) || 
               reportDate.isSame(startDate) || 
               reportDate.isSame(endDate);
      });
    }

    setFilteredData(filtered);
    setPage(1);
  };

  return (
    <AppLayoutAdmin>
        <div className="p-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
            <ContactsOutlined /> Report Manager
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
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={isLoading}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: pageSize,
              total: filteredData.length,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
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