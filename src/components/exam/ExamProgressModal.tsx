import React from 'react';
import { Modal, Typography, Progress, Button, Tooltip } from 'antd';
import { ExamQuestion, StudentAnswer } from '../../types/exam';

const { Title } = Typography;

interface ExamProgressModalProps {
    open: boolean;
    onClose: () => void;
    questions: ExamQuestion[];
    answers: StudentAnswer[];
    onQuestionClick: (questionId: number) => void;
}

const ExamProgressModal: React.FC<ExamProgressModalProps> = ({
    open,
    onClose,
    questions,
    answers,
    onQuestionClick
}) => {
    const answeredQuestions = answers.filter(a => a.selectedOption || a.essayAnswer).length;
    const progress = (answeredQuestions / questions.length) * 100;

    return (
        <Modal
            title="Tiến độ làm bài"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div className="text-center mb-6">
                <Title level={4} className="mb-2">
                    Đã trả lời {answeredQuestions}/{questions.length} câu hỏi
                </Title>
                <Progress 
                    percent={Math.round(progress)} 
                    status={progress === 100 ? "success" : "active"}
                    className="max-w-md mx-auto"
                />
            </div>

            <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                    const answer = answers.find(a => a.question.id === question.question.id);
                    const isAnswered = answer?.selectedOption || answer?.essayAnswer;

                    return (
                        <Tooltip 
                            key={question.id}
                            title={`Câu ${index + 1}: ${isAnswered ? 'Đã trả lời' : 'Chưa trả lời'}`}
                        >
                            <Button
                                type={isAnswered ? "primary" : "default"}
                                onClick={() => onQuestionClick(question.question.id)}
                                className="w-full h-10"
                            >
                                {index + 1}
                            </Button>
                        </Tooltip>
                    );
                })}
            </div>
        </Modal>
    );
};

export default ExamProgressModal; 