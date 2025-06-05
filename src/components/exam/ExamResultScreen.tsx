import React from 'react';
import { Typography, Card, Space, Tag, Progress, Button } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { StudentExam, ExamQuestion } from '../../types/exam';
import AppLayout from '../AppLayout';
import { useAvatar } from '../../hooks/useAvatar';

const { Title, Text } = Typography;

interface ExamResultScreenProps {
    exam: StudentExam;
    onBack: () => void;
}

const ExamResultScreen: React.FC<ExamResultScreenProps> = ({ exam, onBack }) => {
    const formatDateTime = (dateArray: number[]) => {
        return new Date(
            dateArray[0],
            dateArray[1] - 1,
            dateArray[2],
            dateArray[3],
            dateArray[4],
            dateArray[5],
            dateArray[6] / 1000000
        ).toLocaleString();
    };

    const calculateCorrectAnswers = () => {
        return exam.answers?.filter(a => a.score > 0).length || 0;
    };

    const calculateTotalQuestions = () => {
        return exam.exam.questions?.length || 0;
    };

    const correctAnswers = calculateCorrectAnswers();
    const totalQuestions = calculateTotalQuestions();
    const scorePercentage = (exam.score / 100) * 100;

    return (
        <AppLayout>
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <Title level={2} className="forest--dark--color flex items-center gap-2 m-0">
                        <CheckCircleOutlined /> Kết Quả Bài Kiểm Tra
                    </Title>
                    <Button 
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Score Overview Card */}
                    <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-0">
                        <div className="text-center">
                            <div className="mb-4">
                                <Progress
                                    type="circle"
                                    percent={scorePercentage}
                                    format={() => (
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600">{exam.score}</div>
                                            <div className="text-sm text-gray-600">điểm</div>
                                        </div>
                                    )}
                                    size={120}
                                    strokeColor="#4f6f52"
                                />
                            </div>
                            <Space direction="vertical" size="small">
                                <Text strong className="text-lg">Tổng kết bài làm</Text>
                                <Text className="text-gray-600">
                                    {correctAnswers} / {totalQuestions} câu trả lời đúng
                                </Text>
                            </Space>
                        </div>
                    </Card>

                    {/* Exam Info Card */}
                    <Card className="mb-6">
                        <Space direction="vertical" size="large" className="w-full">
                            <div>
                                <Text strong className="text-lg flex items-center gap-2">
                                    <FileTextOutlined /> Thông tin bài thi
                                </Text>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <ClockCircleOutlined className="text-gray-500" />
                                            <Text>Thời gian bắt đầu: {formatDateTime(exam.startTime)}</Text>
                                        </div>
                                        {exam.endTime && (
                                            <div className="flex items-center gap-2">
                                                <ClockCircleOutlined className="text-gray-500" />
                                                <Text>Thời gian kết thúc: {formatDateTime(exam.endTime)}</Text>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircleOutlined className="text-green-500" />
                                            <Text>Trạng thái: <Tag color="success">Đã nộp</Tag></Text>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileTextOutlined className="text-blue-500" />
                                            <Text>Điểm số: <span className="font-bold text-green-600">{exam.score}</span></Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Space>
                    </Card>

                    {/* Questions and Answers */}
                    <Card>
                        <Title level={3} className="mb-6 flex items-center gap-2">
                            <FileTextOutlined /> Chi tiết bài làm
                        </Title>
                        <div className="space-y-8">
                            {/* Multiple Choice Section */}
                            {exam.exam.questions?.filter(q => q.question.type === 'MULTIPLE_CHOICE').length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <Title level={4} className="mb-0">Phần 1: Câu hỏi trắc nghiệm</Title>
                                        <div className="flex items-center gap-2">
                                            <Text type="secondary">
                                                {exam.answers?.filter(a => a.score > 0 && exam.exam.questions?.find(q => q.question.id === a.questionId)?.question.type === 'MULTIPLE_CHOICE').length}/
                                                {exam.exam.questions?.filter(q => q.question.type === 'MULTIPLE_CHOICE').length} câu đúng
                                            </Text>
                                            <Progress 
                                                percent={Math.round((exam.answers?.filter(a => a.score > 0 && exam.exam.questions?.find(q => q.question.id === a.questionId)?.question.type === 'MULTIPLE_CHOICE').length || 0) / 
                                                (exam.exam.questions?.filter(q => q.question.type === 'MULTIPLE_CHOICE').length || 1) * 100)} 
                                                size="small" 
                                                status="success"
                                                className="w-32"
                                            />
                                        </div>
                                    </div>
                                    <Space direction="vertical" size="large" className="w-full">
                                        {exam.exam.questions
                                            ?.filter(q => q.question.type === 'MULTIPLE_CHOICE')
                                            .sort((a, b) => a.order - b.order)
                                            .map((question: ExamQuestion, index: number) => {
                                                const answer = exam.answers?.find(a => a.questionId === question?.question?.id);
                                                const isCorrect = answer?.score && answer.score > 0;
                                                
                                                return (
                                                    <Card 
                                                        key={question?.question?.id || index} 
                                                        className={`mb-4 transition-all duration-200 hover:shadow-md ${
                                                            isCorrect ? 'border-green-200' : 'border-red-200'
                                                        }`}
                                                    >
                                                        <Space direction="vertical" size="middle" className="w-full">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Text strong className="text-lg">Câu {question.order + 1}:</Text>
                                                                    <Tag color={isCorrect ? 'success' : 'error'}>
                                                                        {isCorrect ? 'Đúng' : 'Sai'}
                                                                    </Tag>
                                                                </div>
                                                                <div className="mt-2 text-gray-700">{question.question.content}</div>
                                                            </div>
                                                            
                                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                                <Text strong>Đáp án của bạn: </Text>
                                                                <Tag color={isCorrect ? 'success' : 'error'} className="ml-2">
                                                                    {answer?.selectedOption || 'Chưa trả lời'}
                                                                </Tag>
                                                                {answer?.score !== undefined && (
                                                                    <Text className="ml-2">({answer.score} điểm)</Text>
                                                                )}
                                                            </div>
                                                        </Space>
                                                    </Card>
                                                );
                                            })}
                                    </Space>
                                </div>
                            )}

                            {/* Essay Section */}
                            {exam.exam.questions?.filter(q => q.question.type === 'ESSAY').length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <Title level={4} className="mb-0">Phần 2: Câu hỏi tự luận</Title>
                                        <div className="flex items-center gap-2">
                                            {/* <Text type="secondary">
                                                {exam.answers?.filter(a => a.score > 0 && exam.exam.questions?.find(q => q.question.id === a.questionId)?.question.type === 'ESSAY').length}/
                                                {exam.exam.questions?.filter(q => q.question.type === 'ESSAY').length} câu đúng
                                            </Text> */}
                                            {/* <Progress 
                                                percent={Math.round((exam.answers?.filter(a => a.score > 0 && exam.exam.questions?.find(q => q.question.id === a.questionId)?.question.type === 'ESSAY').length || 0) / 
                                                (exam.exam.questions?.filter(q => q.question.type === 'ESSAY').length || 1) * 100)} 
                                                size="small" 
                                                status="success"
                                                className="w-32"
                                            /> */}
                                        </div>
                                    </div>
                                    <Space direction="vertical" size="large" className="w-full">
                                        {exam.exam.questions
                                            ?.filter(q => q.question.type === 'ESSAY')
                                            .sort((a, b) => a.order - b.order)
                                            .map((question: ExamQuestion, index: number) => {
                                                const answer = exam.answers?.find(a => a.questionId === question?.question?.id);
                                                const isCorrect = answer?.score && answer.score > 0;
                                                
                                                return (
                                                    <Card 
                                                        key={question?.question?.id || index} 
                                                        className={`mb-4 transition-all duration-200 hover:shadow-md ${
                                                            isCorrect ? 'border-green-200' : 'border-red-200'
                                                        }`}
                                                    >
                                                        <Space direction="vertical" size="middle" className="w-full">
                                                            {/* <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Text strong className="text-lg">Câu {question.order + 1}:</Text>
                                                                    <Tag color={isCorrect ? 'success' : 'error'}>
                                                                        {isCorrect ? 'Đúng' : 'Sai'}
                                                                    </Tag>
                                                                </div>
                                                                <div className="mt-2 text-gray-700">{question.question.content}</div>
                                                            </div> */}
                                                            
                                                            <div>
                                                                <Text strong>Bài làm của bạn:</Text>
                                                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                                                    {answer?.essayAnswer || 'Chưa trả lời'}
                                                                </div>
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <Text strong>Điểm:</Text>
                                                                    {answer && answer.score === null ? (
                                                                        <Tag color="warning">Chưa chấm điểm</Tag>
                                                                    ) : (
                                                                        <Tag color={answer && answer.score && answer.score > 0 ? "success" : "error"}>
                                                                            {answer?.score || 0}/60 điểm
                                                                        </Tag>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {answer?.imageUrls && answer.imageUrls.length > 0 && (
                                                                <div>
                                                                    <Text strong>Hình ảnh đính kèm:</Text>
                                                                    <div className="mt-2 flex flex-wrap gap-4">
                                                                        {answer.imageUrls.map((url, idx) => {
                                                                            const { imageUrl, isLoading } = useAvatar(url);
                                                                            return (
                                                                                <div key={idx} className="relative">
                                                                                    <img 
                                                                                        src={imageUrl}
                                                                                        alt={`Hình ảnh ${idx + 1}`}
                                                                                        className="max-w-[200px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                                                                        loading="lazy"
                                                                                    />
                                                                                    {isLoading && (
                                                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-lg">
                                                                                            <Progress type="circle" percent={75} size="small" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Space>
                                                    </Card>
                                                );
                                            })}
                                    </Space>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default ExamResultScreen; 