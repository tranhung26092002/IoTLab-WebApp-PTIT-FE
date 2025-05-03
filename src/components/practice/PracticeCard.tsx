import React from 'react';
import { Card, Spin, Tag, message, Tooltip, Progress } from 'antd';
import { ArrowRightOutlined, LockOutlined, UnlockOutlined, CheckCircleOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Practice } from '../../types/practice';
import { useNavigate } from 'react-router-dom';
import { useAvatar } from '../../hooks/useAvatar';

interface PracticeProgress {
    id?: number;
    practiceId?: number;
    studentId?: number;
    status: 'UNLOCKED' | 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
    score: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    completedAt?: string | null;
}

interface PracticeCardProps {
    practice: Practice;
    practiceProgress?: PracticeProgress | null;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ practice, practiceProgress }) => {
    const { imageUrl, isLoading: isLoadingImage } = useAvatar(practice.imageUrl);
    const navigate = useNavigate();

    const isLocked = practiceProgress?.status === 'LOCKED';

    const getStatusIcon = () => {
        if (!practiceProgress) return <UnlockOutlined className="text-gray-900" />;
        
        switch (practiceProgress.status) {
            case 'COMPLETED':
                return <CheckCircleOutlined className="text-green-500" />;
            case 'IN_PROGRESS':
                return <ClockCircleOutlined className="text-blue-500" />;
            case 'LOCKED':
                return <LockOutlined className="text-red-500" />;
            case 'UNLOCKED':
                return <UnlockOutlined className="text-gray-900" />;
            default:
                return <UnlockOutlined className="text-gray-900" />;
        }
    };

    const getStatusTooltip = () => {
        if (!practiceProgress) return 'Chưa bắt đầu';
        
        switch (practiceProgress.status) {
            case 'COMPLETED':
                return `Đã hoàn thành (${practiceProgress.score || 0} điểm)`;
            case 'IN_PROGRESS':
                return 'Đang thực hiện';
            case 'LOCKED':
                return 'Bài thực hành đang bị khóa';
            case 'UNLOCKED':
                return 'Bài thực hành đã mở khóa';
            default:
                return 'Chưa bắt đầu';
        }
    };

    const getProgressPercent = () => {
        if (!practiceProgress) return 0;
        switch (practiceProgress.status) {
            case 'COMPLETED':
                return 100;
            case 'IN_PROGRESS':
                return 50;
            case 'LOCKED':
                return 0;
            case 'UNLOCKED':
                return 0;
            default:
                return 0;
        }
    };

    const getProgressColor = () => {
        if (!practiceProgress) return '#d9d9d9';
        switch (practiceProgress.status) {
            case 'COMPLETED':
                return '#52c41a';
            case 'IN_PROGRESS':
                return '#1890ff';
            case 'LOCKED':
                return '#ff4d4f';
            case 'UNLOCKED':
                return '#d9d9d9';
            default:
                return '#d9d9d9';
        }
    };

    const handleDetailClick = (e: React.MouseEvent) => {
        if (isLocked) {
            e.preventDefault();
            message.error({
                content: (
                    <div className="flex items-center gap-2">
                        <InfoCircleOutlined className="text-red-500" />
                        <span>Bài thực hành đang bị khóa. Vui lòng hoàn thành các bài thực hành trước đó để mở khóa bài này.</span>
                    </div>
                ),
                duration: 3,
                style: {
                    marginTop: '50vh',
                    background: '#fff1f0',
                    border: '1px solid #ffa39e',
                    borderRadius: '8px',
                    padding: '12px 16px',
                },
            });
            return;
        }
        navigate(`/practice/${practice.id}`);
    };

    return (
        <Card
            hoverable={!isLocked}
            className={`${isLocked ? 'opacity-75 cursor-not-allowed' : ''}`}
            cover={
                <div className="relative overflow-hidden h-48">
                    {isLoadingImage ? (
                        <div className="flex items-center justify-center h-full">
                            <Spin />
                        </div>
                    ) : (
                        <img
                            alt={practice.title}
                            src={imageUrl}
                            className={`w-full h-full object-contain bg-gray-50 transition-transform duration-700 ${!isLocked ? 'hover:scale-110' : ''}`}
                        />
                    )}
                </div>
            }
            actions={[
                <button
                    onClick={handleDetailClick}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-lg
                               text-[#2c4a2d] font-medium
                               transition-all duration-300
                               hover:bg-[#4f6f52] hover:text-white
                               hover:shadow-md active:scale-95
                               ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLocked}
                >
                    Chi tiết
                    <ArrowRightOutlined className="transform transition-transform duration-300 
                                                 group-hover:translate-x-1" />
                </button>
            ]}
        >
            <Card.Meta
                title={
                    <div className="flex items-center gap-2">
                        <Tooltip title={getStatusTooltip()}>
                            {getStatusIcon()}
                        </Tooltip>
                        <span className="text-[#2c4a2d] font-bold">
                            {practice.title}
                        </span>
                    </div>
                }
                description={
                    <div className="space-y-2">
                        <p className="text-gray-600 line-clamp-2">
                            {practice.description}
                        </p>
                        <div className="flex gap-2">
                            {practice.practiceVideos &&
                                <Tag color="blue">{practice.practiceVideos.length} Videos</Tag>
                            }
                            {practice.practiceFiles &&
                                <Tag color="purple">{practice.practiceFiles.length} Files</Tag>
                            }
                            {practice.practiceGuides &&
                                <Tag color="cyan">{practice.practiceGuides.length} Guides</Tag>
                            }
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Tiến độ</span>
                                <span className="text-xs font-medium" style={{ color: getProgressColor() }}>
                                    {getStatusTooltip()}
                                </span>
                            </div>
                            <Progress 
                                percent={getProgressPercent()} 
                                status={practiceProgress?.status === 'COMPLETED' ? 'success' : 'active'}
                                size="small"
                                showInfo={false}
                                strokeColor={getProgressColor()}
                                trailColor="#f5f5f5"
                            />
                        </div>
                    </div>
                }
            />
        </Card>
    );
};

export default PracticeCard;