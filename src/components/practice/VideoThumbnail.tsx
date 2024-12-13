import React from 'react';
import { Card, Spin } from 'antd';
import { useVideo } from '../../hooks/useVideo';
import { PracticeVideo } from '../../types/practice';

interface VideoThumbnailProps {
    video: PracticeVideo;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video }) => {
    const { url, isLoading } = useVideo(video.videoUrl);

    return (
        <Card className="h-32 overflow-hidden">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Spin />
                </div>
            ) : (
                <video
                    src={url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                />
            )}
        </Card>
    );
};