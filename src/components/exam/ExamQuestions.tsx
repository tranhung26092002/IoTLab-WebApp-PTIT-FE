import React from 'react';
import { Card, Typography, Radio, Space, Input, Upload, Button, Tag, Progress, Divider } from 'antd';
import { UploadOutlined, FileImageOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { QuestionType, ExamQuestion, StudentAnswer } from '../../types/exam';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ExamQuestionsProps {
    questions: ExamQuestion[];
    answers: StudentAnswer[];
    onAnswerSelect: (questionId: number, selectedOption: string) => void;
    onEssayAnswer: (questionId: number, answer: string) => void;
    onImageUpload: (questionId: number, file: File) => boolean;
    isSubmitting?: boolean;
    examDescription?: string;
    onBack?: () => void;
}

const ExamQuestions: React.FC<ExamQuestionsProps> = ({
    questions,
    answers,
    onAnswerSelect,
    onEssayAnswer,
    onImageUpload,
    isSubmitting,
    examDescription,
    onBack
}) => {
    // Sort questions by order and filter by type
    const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
    const multipleChoiceQuestions = sortedQuestions.filter(q => q.question.type === QuestionType.MULTIPLE_CHOICE);
    const essayQuestions = sortedQuestions.filter(q => q.question.type === QuestionType.ESSAY);

    // Calculate progress for each section
    const multipleChoiceProgress = multipleChoiceQuestions.length > 0 
        ? (multipleChoiceQuestions.filter(q => {
            const answer = answers.find(a => a.question.id === q.question.id);
            return answer?.selectedOption !== undefined && answer.selectedOption !== '';
        }).length / multipleChoiceQuestions.length) * 100
        : 0;
    
    const essayProgress = essayQuestions.length > 0
        ? (essayQuestions.filter(q => {
            const answer = answers.find(a => a.question.id === q.question.id);
            return answer?.essayAnswer !== undefined && answer.essayAnswer.trim() !== '';
        }).length / essayQuestions.length) * 100
        : 0;

    // Render multiple choice question
    const renderMultipleChoiceQuestion = (question: ExamQuestion, index: number) => {
        const answer = answers.find(a => a.question.id === question.question.id);
        const isAnswered = answer?.selectedOption !== undefined && answer.selectedOption !== '';

        return (
            <Card 
                key={question.id}
                id={`question-${question.question.id}`}
                className="w-full hover:shadow-md transition-shadow"
            >
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Text strong>Câu {index + 1}:</Text>
                                {isAnswered && (
                                    <Tag color="green" icon={<CheckCircleOutlined />}>Đã trả lời</Tag>
                                )}
                            </div>
                            <Tag color="blue">{question.question.score} điểm</Tag>
                        </div>
                        <Text className="block mb-4 text-base">{question.question.content}</Text>
                        <Radio.Group
                            value={answer?.selectedOption}
                            onChange={e => onAnswerSelect(question.question.id, e.target.value)}
                            disabled={isSubmitting}
                        >
                            <Space direction="vertical" className="w-full">
                                {question.question.options?.map(option => (
                                    <Radio 
                                        key={option.id} 
                                        value={option.option}
                                        className="text-base p-2 hover:bg-gray-50 rounded"
                                    >
                                        {option.content}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
            </Card>
        );
    };

    // Render essay question
    const renderEssayQuestion = (question: ExamQuestion, index: number) => {
        const answer = answers.find(a => a.question.id === question.question.id);
        const isAnswered = answer?.essayAnswer !== undefined && answer.essayAnswer.trim() !== '';
        const imageCount = answer?.imageUrls?.length || 0;

        return (
            <Card 
                key={question.id}
                id={`question-${question.question.id}`}
                className="w-full hover:shadow-md transition-shadow"
            >
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Text strong>Câu {index + 1}:</Text>
                                {isAnswered && (
                                    <Tag color="green" icon={<CheckCircleOutlined />}>Đã trả lời</Tag>
                                )}
                            </div>
                            <Tag color="blue">{question.question.score} điểm</Tag>
                        </div>
                        <Text className="block mb-4 text-base">{question.question.content}</Text>
                        <TextArea
                            value={answer?.essayAnswer}
                            onChange={e => onEssayAnswer(question.question.id, e.target.value)}
                            placeholder="Nhập câu trả lời của bạn..."
                            autoSize={{ minRows: 4, maxRows: 8 }}
                            disabled={isSubmitting}
                            className="mb-4"
                        />
                        <div className="flex items-center gap-4">
                            <Upload
                                accept="image/*"
                                beforeUpload={file => onImageUpload(question.question.id, file)}
                                showUploadList={false}
                                disabled={isSubmitting || imageCount >= 3}
                            >
                                <Button 
                                    icon={<UploadOutlined />}
                                    disabled={isSubmitting || imageCount >= 3}
                                >
                                    Tải ảnh lên
                                </Button>
                            </Upload>
                            <Text type="secondary">
                                {imageCount}/3 ảnh đã tải lên
                            </Text>
                        </div>
                        {answer?.imageUrls && answer.imageUrls.length > 0 && (
                            <div className="mt-4 flex gap-2">
                                {answer.imageUrls.map((url, i) => (
                                    <div key={i} className="relative">
                                        <img 
                                            src={url} 
                                            alt={`Uploaded ${i + 1}`}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Back Button */}
            {onBack && (
                <div className="mb-4">
                    <Button 
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                    >
                        Quay lại
                    </Button>
                </div>
            )}

            {/* Exam Description */}
            {examDescription && (
                <Card className="mb-8 bg-gray-50">
                    <Text className="text-base">{examDescription}</Text>
                </Card>
            )}

            {/* Multiple Choice Questions Section */}
            {multipleChoiceQuestions.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <Title level={3} className="mb-0">Phần 1: Câu hỏi trắc nghiệm</Title>
                        <div className="flex items-center gap-2">
                            <Text type="secondary">
                                {multipleChoiceQuestions.filter(q => {
                                    const answer = answers.find(a => a.question.id === q.question.id);
                                    return answer?.selectedOption !== undefined && answer.selectedOption !== '';
                                }).length}/{multipleChoiceQuestions.length} câu đã trả lời
                            </Text>
                            <Progress 
                                percent={Math.round(multipleChoiceProgress)} 
                                size="small" 
                                status={multipleChoiceProgress === 100 ? "success" : "active"}
                                className="w-32"
                            />
                        </div>
                    </div>
                    <Space direction="vertical" size="large" className="w-full">
                        {multipleChoiceQuestions.map((question, index) => renderMultipleChoiceQuestion(question, index))}
                    </Space>
                </div>
            )}

            {/* Divider between sections */}
            {multipleChoiceQuestions.length > 0 && essayQuestions.length > 0 && (
                <Divider className="my-8" />
            )}

            {/* Essay Questions Section */}
            {essayQuestions.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <Title level={3} className="mb-0">Phần 2: Câu hỏi tự luận</Title>
                        <div className="flex items-center gap-2">
                            <Text type="secondary">
                                {essayQuestions.filter(q => {
                                    const answer = answers.find(a => a.question.id === q.question.id);
                                    return answer?.essayAnswer !== undefined && answer.essayAnswer.trim() !== '';
                                }).length}/{essayQuestions.length} câu đã trả lời
                            </Text>
                            <Progress 
                                percent={Math.round(essayProgress)} 
                                size="small" 
                                status={essayProgress === 100 ? "success" : "active"}
                                className="w-32"
                            />
                        </div>
                    </div>
                    <Space direction="vertical" size="large" className="w-full">
                        {essayQuestions.map((question, index) => renderEssayQuestion(question, index))}
                    </Space>
                </div>
            )}
        </motion.div>
    );
};

export default ExamQuestions; 