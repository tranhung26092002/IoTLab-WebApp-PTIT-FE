// components/home/VideoSection.tsx
import React, { useState } from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';

import video from '/src/assets/home/KIT-B.mp4'

const VideoSection: React.FC = () => {
    const [hasError, setHasError] = useState(false);

    return (
        <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white/90 backdrop-blur h-[400px]">
                {!hasError ? (
                    <video
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => setHasError(true)}
                    >
                        <source src={video} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video!
                    </video>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Video không thể tải!
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default VideoSection;