import React, { useState } from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import { useStudentExam } from '../../hooks/useStudentExam';

const { Title } = Typography;

const formatDate = (dateArray: number[] | null) => {
    if (!dateArray) return 'N/A';
    return new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5],
      dateArray[6] / 1000000
    ).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

const StudentExamList: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { studentExams, isLoadingExams } = useStudentExam({
        enableStudentExams: true,
        page: currentPage - 1,
        size: pageSize
    });

    const columns = [
        {
            title: 'Mã bài thi',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên bài thi',
            dataIndex: ['exam', 'title'],
            key: 'title',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (date: number[]) => formatDate(date),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (date: number[]) => formatDate(date),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig = {
                    PENDING: { color: 'warning', text: 'Chờ thi' },
                    IN_PROGRESS: { color: 'processing', text: 'Đang thi' },
                    SUBMITTED: { color: 'success', text: 'Đã nộp' },
                    GRADED: { color: 'default', text: 'Đã chấm điểm' }
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: 'Điểm số',
            dataIndex: 'score',
            key: 'score',
            render: (score: number) => score !== null ? `${score.toFixed(2)}` : 'Chưa có điểm'
        }
    ];

    return (
        <Card className="shadow-lg">
            <Title level={3} className="mb-4">Danh sách bài thi của sinh viên</Title>
            <Table
                columns={columns}
                dataSource={studentExams?.data}
                loading={isLoadingExams}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: studentExams?.metaData.total,
                    onChange: (page) => setCurrentPage(page),
                    showSizeChanger: false
                }}
            />
        </Card>
    );
};

export default StudentExamList; 