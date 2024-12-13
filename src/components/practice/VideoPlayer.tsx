import React from 'react';
import { Card, Spin } from 'antd';
import { useVideo } from '../../hooks/useVideo';
import { PracticeVideo } from '../../types/practice';

interface VideoPlayerProps {
    video: PracticeVideo;
    className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, className }) => {
    const { url, isLoading } = useVideo(video.videoUrl);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px] bg-gray-900">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <video
            controls
            className={`w-full ${className}`}
            src={url}
            preload="metadata"
            controlsList="nodownload"
            playsInline
        >
            Your browser does not support video playback.
        </video>
    );
};