import React from 'react';
import { Card, Spin, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Practice } from '../../types/practice';
import { useNavigate } from 'react-router-dom';
import { useAvatar } from '../../hooks/useAvatar';

interface PracticeCardProps {
    practice: Practice;
}

export const PracticeCardAdmin: React.FC<PracticeCardProps> = ({ practice }) => {
    const { imageUrl, isLoading: isLoadingImage } = useAvatar(practice.imageUrl);
    const navigate = useNavigate();

    return (
        <Card
            hoverable
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
                            className="w-full h-full object-contain bg-gray-50 transition-transform duration-700 hover:scale-110"
                        />
                    )}
                    <Tag color={practice.status === 'PUBLISHED' ? 'green' : 'gold'}
                        className="absolute top-4 right-4">
                        {practice.status}
                    </Tag>
                </div>
            }
            actions={[
                <button
                    onClick={() => navigate(`/admin/practice-manager/${practice.id}`)}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg
                               text-[#2c4a2d] font-medium
                               transition-all duration-300
                               hover:bg-[#4f6f52] hover:text-white
                               hover:shadow-md active:scale-95"
                >
                    Chi tiết
                    <ArrowRightOutlined className="transform transition-transform duration-300 
                                                 group-hover:translate-x-1" />
                </button>
            ]}
        >
            <Card.Meta
                title={
                    <div className="text-[#2c4a2d] font-bold">
                        {practice.title}
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
                    </div>
                }
            />
        </Card>
    );
};

export default PracticeCardAdmin;