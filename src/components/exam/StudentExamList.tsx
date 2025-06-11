import React, { useState } from 'react';
import { Table, Card, Typography, Tag, Button } from 'antd';
import { useStudentExam } from '../../hooks/useStudentExam';
import { StudentExam, ExamStatus } from '../../types/exam';
import TeacherExamResultScreen from './TeacherExamResultScreen';

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
    const [selectedExam, setSelectedExam] = useState<StudentExam | null>(null);

    const { studentExams, isLoadingExams } = useStudentExam({
        enableStudentExams: true,
        page: currentPage - 1,
        size: pageSize
    });

    const handleViewResult = (exam: StudentExam) => {
        setSelectedExam(exam);
    };

    const handleBack = () => {
        setSelectedExam(null);
    };

    if (selectedExam) {
        return <TeacherExamResultScreen exam={selectedExam} onBack={handleBack} />;
    }

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
            render: (status: ExamStatus) => {
                const statusConfig = {
                    [ExamStatus.NOT_STARTED]: { color: 'default', text: 'Chưa bắt đầu' },
                    [ExamStatus.IN_PROGRESS]: { color: 'processing', text: 'Đang thi' },
                    [ExamStatus.SUBMITTED]: { color: 'success', text: 'Đã nộp' }
                };
                const config = statusConfig[status];
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: 'Điểm số',
            dataIndex: 'score',
            key: 'score',
            render: (score: number) => score !== null ? `${score.toFixed(2)}` : 'Chưa có điểm'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: StudentExam) => (
                <Button 
                    type="primary"
                    onClick={() => handleViewResult(record)}
                    disabled={record.status !== ExamStatus.SUBMITTED}
                >
                    Chấm điểm
                </Button>
            ),
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