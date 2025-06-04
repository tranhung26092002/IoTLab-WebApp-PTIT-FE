import React from 'react';
import { Card, Typography, Button, Space, Steps, Tag, Divider } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { StudentExam, ExamStatus } from '../../types/exam';

const { Title, Text } = Typography;

interface ExamStatusScreenProps {
    currentExam: StudentExam | null;
    onContinue: () => void;
    onViewResult?: () => void;
    isLoading?: boolean;
    examDuration: number;
}

const ExamStatusScreen: React.FC<ExamStatusScreenProps> = ({
    currentExam,
    onContinue,
    onViewResult,
    isLoading = false,
    examDuration
}) => {
    const getStatusColor = (status: ExamStatus) => {
        switch (status) {
            case ExamStatus.NOT_STARTED:
                return 'default';
            case ExamStatus.IN_PROGRESS:
                return 'processing';
            case ExamStatus.SUBMITTED:
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: ExamStatus) => {
        switch (status) {
            case ExamStatus.NOT_STARTED:
                return 'Chưa bắt đầu';
            case ExamStatus.IN_PROGRESS:
                return 'Đang làm';
            case ExamStatus.SUBMITTED:
                return 'Đã nộp';
            default:
                return 'Không xác định';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
        >
            <Card className="shadow-lg">
                <div className="text-center mb-8">
                    <Title level={2} className="mb-2">
                        {currentExam ? 'Tiếp tục bài thi' : 'Bắt đầu bài thi mới'}
                    </Title>
                    <Text type="secondary">
                        {currentExam 
                            ? 'Bạn có một bài thi đang dở. Bạn có muốn tiếp tục không?'
                            : 'Bạn đã sẵn sàng để bắt đầu bài thi mới?'}
                    </Text>
                </div>

                {currentExam?.exam && (
                    <Card className="bg-[var(--bg-secondary)] mb-6">
                        <Space direction="vertical" size="middle" className="w-full">
                            <div className="flex items-center gap-2">
                                <InfoCircleOutlined className="text-lg" />
                                <Title level={4} className="m-0">{currentExam.exam.title}</Title>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <Text strong className="block mb-1">Mô tả bài kiểm tra:</Text>
                                    <Text>{currentExam.exam.description}</Text>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Text strong className="block mb-1">Thời gian làm bài:</Text>
                                        <Text>{examDuration / 60} phút</Text>
                                    </div>
                                    <div>
                                        <Text strong className="block mb-1">Số câu hỏi:</Text>
                                        <Text>{currentExam.exam.questions.length} câu</Text>
                                    </div>
                                </div>

                                <Divider className="my-4" />

                                <div>
                                    <Text strong className="block mb-1">Thông tin bài làm:</Text>
                                    <Space direction="vertical" size="small" className="w-full">
                                        <Text>Thời gian bắt đầu: {new Date(
                                            currentExam.startTime[0],
                                            currentExam.startTime[1] - 1,
                                            currentExam.startTime[2],
                                            currentExam.startTime[3],
                                            currentExam.startTime[4],
                                            currentExam.startTime[5],
                                            currentExam.startTime[6] / 1000000
                                        ).toLocaleString()}</Text>
                                        <Space>
                                            <Text>Trạng thái:</Text>
                                            <Tag color={getStatusColor(currentExam.status)}>
                                                {getStatusText(currentExam.status)}
                                            </Tag>
                                        </Space>
                                        {currentExam.score !== undefined && (
                                            <Text>Điểm số: {currentExam.score}</Text>
                                        )}
                                        {currentExam.endTime && (
                                            <Text>Thời gian kết thúc: {new Date(
                                                currentExam.endTime[0],
                                                currentExam.endTime[1] - 1,
                                                currentExam.endTime[2],
                                                currentExam.endTime[3],
                                                currentExam.endTime[4],
                                                currentExam.endTime[5],
                                                currentExam.endTime[6] / 1000000
                                            ).toLocaleString()}</Text>
                                        )}
                                    </Space>
                                </div>
                            </div>
                        </Space>
                    </Card>
                )}

                <Steps
                    current={currentExam ? 1 : 0}
                    items={[
                        {
                            title: 'Xác nhận thông tin',
                            description: 'Kiểm tra thông tin cá nhân',
                            icon: <FileTextOutlined />
                        },
                        {
                            title: 'Làm bài thi',
                            description: currentExam ? 'Tiếp tục bài thi đang dở' : 'Bắt đầu bài thi mới',
                            icon: currentExam ? <ClockCircleOutlined /> : <PlayCircleOutlined />
                        }
                    ]}
                    className="mb-8"
                />

                <div className="flex justify-center gap-4">
                    {currentExam?.status === ExamStatus.SUBMITTED ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={onViewResult}
                            icon={<EyeOutlined />}
                            className="min-w-[200px]"
                        >
                            Xem kết quả
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            onClick={onContinue}
                            loading={isLoading}
                            icon={currentExam ? <ClockCircleOutlined /> : <PlayCircleOutlined />}
                            className="min-w-[200px]"
                        >
                            {currentExam ? 'Tiếp tục bài thi' : 'Bắt đầu bài thi'}
                        </Button>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

export default ExamStatusScreen; 