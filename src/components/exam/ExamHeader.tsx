import React from 'react';
import { Card, Progress } from 'antd';
import { ClockCircleOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { User } from '../../types/user';

interface ExamHeaderProps {
    student: User;
    examTitle: string;
    timeLeft: number;
    answeredQuestions: number;
    totalQuestions: number;
    description?: string;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
    student,
    examTitle,
    timeLeft,
    answeredQuestions,
    totalQuestions,
    description,
}) => {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const progressPercent = (answeredQuestions / totalQuestions) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                className="mb-6 shadow-lg"
                style={{
                    borderRadius: 16,
                    background: 'linear-gradient(90deg, #f8fafc 60%, #e6f4ea 100%)',
                    border: 'none',
                    padding: 0,
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div className="flex flex-col md:flex-row items-center justify-between p-6">
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOutlined style={{ fontSize: 28, color: '#4f6f52' }} />
                            <span className="text-2xl font-bold text-[#2d3a2e] truncate">{examTitle}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <UserOutlined style={{ color: '#739072' }} />
                            <span className="text-base text-gray-600">{student.fullName} - {student.userName}</span>
                        </div>
                        {description && (
                            <div className="flex items-center gap-2 mt-1">
                                <span style={{ color: '#739072', fontSize: 18 }}>ℹ️</span>
                                <span className="italic text-gray-500 text-base">{description}</span>
                            </div>
                        )}
                    </div>
                    {/* Right: Time */}
                    <div className="flex flex-col items-center justify-center min-w-[120px] mt-6 md:mt-0">
                        <ClockCircleOutlined style={{ fontSize: 32, color: '#4f6f52' }} />
                        <span className="text-3xl font-extrabold text-[#4f6f52] mt-1">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Thời gian còn lại</span>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="px-6 pb-4">
                    <Progress
                        percent={Math.round(progressPercent)}
                        status="active"
                        strokeColor={{
                            '0%': '#4f6f52',
                            '100%': '#739072',
                        }}
                        style={{ borderRadius: 8 }}
                        showInfo={true}
                    />
                </div>
            </Card>
        </motion.div>
    );
};

export default ExamHeader; 