import React, { useState } from 'react';
import { Typography, Card, Space, Tag, Progress, Button, Input, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { StudentExam, ExamQuestion } from '../../types/exam';
import AppLayout from '../AppLayout';
import { useAvatar } from '../../hooks/useAvatar';
import { useStudentExam } from '../../hooks/useStudentExam';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface TeacherExamResultScreenProps {
    exam: StudentExam;
    onBack: () => void;
}

const TeacherExamResultScreen: React.FC<TeacherExamResultScreenProps> = ({ exam, onBack }) => {
    const [scores, setScores] = useState<{ [key: number]: number }>(() => {
        const initialScores: { [key: number]: number } = {};
        exam.answers?.forEach(answer => {
            if (answer.score !== null) {
                initialScores[answer.questionId] = answer.score;
            }
        });
        return initialScores;
    });

    const { gradeEssay, isGrading } = useStudentExam({});

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

    const handleScoreChange = (questionId: number, score: number) => {
        setScores(prev => ({
            ...prev,
            [questionId]: score
        }));
    };

    const handleSave = async () => {
        try {
            const essayAnswers = exam.answers?.filter(answer => {
                const question = exam.exam.questions?.find(q => q.question.id === answer.questionId);
                return question?.question.type === 'ESSAY';
            }) || [];

            for (const answer of essayAnswers) {
                await gradeEssay({
                    studentExamId: exam.id,
                    questionId: answer.questionId,
                    score: scores[answer.questionId] || 0
                });
            }
            
            message.success('Lưu điểm thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu điểm!');
        }
    };

    // Lọc ra các câu hỏi tự luận
    const essayQuestions = exam.exam.questions?.filter(q => q.question.type === 'ESSAY') || [];

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <Title level={2} className="forest--dark--color flex items-center gap-2 m-0">
                    <CheckCircleOutlined /> Chấm Điểm Bài Thi
                </Title>
                <Space>
                    <Button 
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={isGrading}
                    >
                        Lưu điểm
                    </Button>
                    <Button 
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                    >
                        Quay lại
                    </Button>
                </Space>
            </div>

            {/* Thông tin bài thi */}
            <Card className="mb-6">
                <Space direction="vertical" size="large" className="w-full">
                    <div>
                        <Text strong className="text-lg">Thông tin bài thi:</Text>
                        <div className="mt-2">
                            <Text>Mã bài thi: {exam.id}</Text>
                            <br />
                            <Text>Tên bài thi: {exam.exam.title}</Text>
                            <br />
                            <Text>Thời gian bắt đầu: {formatDateTime(exam.startTime)}</Text>
                            <br />
                            <Text>Thời gian kết thúc: {formatDateTime(exam.endTime)}</Text>
                        </div>
                    </div>

                    <div>
                        <Text strong className="text-lg">Thông tin sinh viên:</Text>
                        <div className="mt-2">
                            <Text>Mã sinh viên: {exam.student.studentCode}</Text>
                            <br />
                            <Text>Họ tên: {exam.student.name}</Text>
                        </div>
                    </div>

                    <div>
                        <Text strong className="text-lg">Tổng quan:</Text>
                        <div className="mt-2">
                            <Text>Số câu đúng: {correctAnswers}/{totalQuestions}</Text>
                            <br />
                            <Text>Điểm số: {exam.score.toFixed(2)}</Text>
                        </div>
                    </div>
                </Space>
            </Card>

            {/* Phần chấm điểm tự luận */}
            {essayQuestions.length > 0 && (
                <div>
                    <Title level={3} className="mb-4">Phần chấm điểm tự luận</Title>
                    <Space direction="vertical" size="large" className="w-full">
                        {essayQuestions.map((question, index) => {
                            const answer = exam.answers?.find(a => a.questionId === question.question.id);
                            
                            return (
                                <Card 
                                    key={question.question.id} 
                                    className="mb-4 transition-all duration-200 hover:shadow-md"
                                >
                                    <Space direction="vertical" size="middle" className="w-full">
                                        <div>
                                            <Text strong className="text-lg">Câu {index + 1}:</Text>
                                            <div className="mt-2 text-gray-700">{question.question.content}</div>
                                        </div>
                                        
                                        <div>
                                            <Text strong>Bài làm của sinh viên:</Text>
                                            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                                {answer?.essayAnswer || 'Chưa trả lời'}
                                            </div>
                                            {answer?.imageUrls && answer.imageUrls.length > 0 && (
                                                <div className="mt-4">
                                                    <Text strong>Hình ảnh đính kèm:</Text>
                                                    <div className="mt-2 flex flex-wrap gap-4">
                                                        {answer.imageUrls.map((url, index) => (
                                                            <div key={index} className="relative">
                                                                <img 
                                                                    src={url} 
                                                                    alt={`Hình ảnh ${index + 1}`}
                                                                    className="w-48 h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                                                    onClick={() => window.open(url, '_blank')}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Text strong>Chấm điểm:</Text>
                                            <div className="mt-2 flex items-center gap-4">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={question.question.score}
                                                    value={scores[question.question.id] || ''}
                                                    onChange={e => handleScoreChange(question.question.id, Number(e.target.value))}
                                                    placeholder="Nhập điểm"
                                                    className="w-32"
                                                />
                                                <Text type="secondary">
                                                    (Tối đa: {question.question.score} điểm)
                                                </Text>
                                            </div>
                                        </div>
                                    </Space>
                                </Card>
                            );
                        })}
                    </Space>
                </div>
            )}
        </div>
    );
};

export default TeacherExamResultScreen;