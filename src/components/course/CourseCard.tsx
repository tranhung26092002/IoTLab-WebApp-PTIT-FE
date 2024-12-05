// src/components/CourseCard.tsx
import React from 'react';
import { Card, Tag, Rate } from 'antd';
import { ArrowRightOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { CourseType } from '../../types/course';

interface CourseCardProps {
    course: CourseType;
    onClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => (
    <Card
        hoverable
        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        cover={
            <div className="relative overflow-hidden">
                <img
                    alt={course.title}
                    src={course.image}
                    className="h-48 w-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <Tag color="#2c4a2d" className="absolute top-4 right-4 animate-fadeIn">
                    {course.level}
                </Tag>
                {course.enrolledStudents && (
                    <Tag color="#3a5a40" className="absolute top-4 left-4 animate-fadeIn">
                        <UserOutlined /> {course.enrolledStudents}
                    </Tag>
                )}
            </div>
        }
        actions={[
            <div className="flex items-center gap-2 text-[#2c4a2d]">
                <ClockCircleOutlined /> {course.duration}
            </div>,
            <Rate disabled defaultValue={course.rating} className="text-[#3a5a40]" />,
            <button 
                onClick={onClick}
                className="flex items-center justify-center gap-2 text-[#2c4a2d] hover:text-[#4f6f52] transition-colors"
            >
                Details <ArrowRightOutlined />
            </button>
        ]}
    >
        <Card.Meta
            title={
                <div className="flex justify-between items-center">
                    <span className="text-[#2c4a2d] font-bold">{course.title}</span>
                    <Tag color="#3a5a40" className="text-lg">${course.price}</Tag>
                </div>
            }
            description={
                <div className="space-y-2">
                    <p className="text-gray-600 line-clamp-2">
                        {course.description}
                    </p>
                    {course.instructor && (
                        <p className="text-[#4f6f52]">
                            By {course.instructor}
                        </p>
                    )}
                </div>
            }
        />
    </Card>
);

export default CourseCard;