import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Tag, Typography, Divider, List, Tooltip, Button } from 'antd';
import { useAvatar } from '../hooks/useAvatar';
import { usePractice } from '../hooks/usePractice';
import { Practice, PracticeVideo } from '../types/practice';
import AppLayout from '../components/AppLayout';
import { FilePdfOutlined, FileTextOutlined, FileWordOutlined } from '@ant-design/icons';
import { VideoPlayer } from '../components/practice/VideoPlayer';
import { VideoThumbnail } from '../components/practice/VideoThumbnail';
import { DocumentViewer } from '../components/practice/DocumentViewer';

const { Title, Paragraph } = Typography;

export const PracticeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getPractice } = usePractice();
    const [practice, setPractice] = React.useState<Practice | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<PracticeVideo | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { imageUrl, isLoading: imageLoading } = useAvatar(practice?.imageUrl);

    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const [documentLoading, setDocumentLoading] = useState(false);

    React.useEffect(() => {
        const fetchPractice = async () => {
            if (!id) return;
            try {
                const data = await getPractice(parseInt(id));
                setPractice(data);
            } finally {
                setLoading(false);
            }
        };
        fetchPractice();
    }, [id, getPractice]);

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return <FilePdfOutlined className="text-red-500" />;
        if (fileType.includes('doc')) return <FileWordOutlined className="text-blue-500" />;
        return <FileTextOutlined className="text-gray-500" />;
    };

    const handleDocumentClick = (fileUrl: string) => {
        setDocumentLoading(true);
        setSelectedDocument(fileUrl);
    };

    const handleDocumentReady = (url: string) => {
        setDocumentLoading(false);
        window.open(url, '_blank');
        setSelectedDocument(null);
    };

    if (loading) return <Spin size="large" className="flex justify-center mt-8" />;
    if (!practice) return <div>Practice not found</div>;

    return (
        <AppLayout>
            {selectedDocument && (
                <DocumentViewer
                    fileUrl={selectedDocument}
                    onUrlReady={handleDocumentReady}
                />
            )}
            <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52]">
                <div className="grid grid-cols-10 gap-6">
                    {/* Left Column - Info (6/10) */}
                    <div className="col-span-6">
                        <Card className="mb-6">
                            {/* Header Image */}
                            <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                                {imageLoading ? (
                                    <Spin className="absolute inset-0 flex items-center justify-center" />
                                ) : (
                                    <img
                                        src={imageUrl}
                                        alt={practice?.title}
                                        className="w-full h-full object-contain"
                                    />
                                )}
                                <Tag
                                    color={practice?.status === 'PUBLISHED' ? 'green' : 'gold'}
                                    className="absolute top-4 right-4"
                                >
                                    {practice?.status}
                                </Tag>
                            </div>

                            {/* Title and Description */}
                            <Title level={2} className="text-[#2c4a2d] mb-4">
                                {practice?.title}
                            </Title>
                            <Paragraph className="text-gray-600 text-lg">{practice?.description}</Paragraph>

                            {/* Files Section */}
                            {practice?.practiceFiles && practice.practiceFiles.length > 0 && (
                                <div className="mt-6">
                                    <Divider orientation="left">
                                        <div className="flex items-center gap-2">
                                            <Title level={4}>Documents</Title>
                                            <Tag color="blue">{practice.practiceFiles.length} Files</Tag>
                                        </div>
                                    </Divider>
                                    <div className="grid grid-cols-3 gap-4">
                                        {practice.practiceFiles.map((file) => (
                                            <Tooltip
                                                title={`Open ${file.fileName}`}
                                                key={file.id}
                                                placement="top"
                                            >
                                                <Button
                                                    onClick={() => handleDocumentClick(file.fileUrl)}
                                                    loading={documentLoading}
                                                    className="w-full h-[100px] flex flex-col items-center justify-center gap-2 
                                                                hover:shadow-lg transition-all rounded-lg border-2 border-gray-100
                                                                hover:border-blue-100 hover:bg-blue-50"
                                                >
                                                    <div className="text-2xl">
                                                        {getFileIcon(file.fileType)}
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="truncate w-[120px] text-center font-medium">
                                                            {file.fileName}
                                                        </span>
                                                        <Tag className="mt-1" color={
                                                            file.fileType.includes('pdf') ? 'red' :
                                                                file.fileType.includes('doc') ? 'blue' : 'default'
                                                        }>
                                                            {file.fileType.split('/').pop()?.toUpperCase()}
                                                        </Tag>
                                                    </div>
                                                </Button>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Guides Section */}
                        {practice?.practiceGuides && practice.practiceGuides.length > 0 && (
                            <Card className="mt-6">
                                <Title level={3}>Practice Guides</Title>
                                <List
                                    itemLayout="vertical"
                                    dataSource={practice.practiceGuides}
                                    renderItem={(guide) => (
                                        <List.Item>
                                            <Card
                                                title={<span className="text-lg">{guide.title}</span>}
                                                className="w-full hover:shadow-md transition-all"
                                            >
                                                <Paragraph className="text-base">{guide.content}</Paragraph>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Videos */}
                    <div className="col-span-4">
                        {practice?.practiceVideos && practice.practiceVideos.length > 0 && (
                            <div className="top-4">
                                {/* Main Video Player */}
                                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl mb-4">
                                    <VideoPlayer
                                        video={selectedVideo || practice.practiceVideos[0]}
                                        className="w-full aspect-video"
                                    />
                                    <div className="p-3 bg-gray-800 text-white">
                                        <h3 className="text-lg font-medium">
                                            {(selectedVideo || practice.practiceVideos[0]).videoName}
                                        </h3>
                                    </div>
                                </div>

                                {/* Video Playlist */}
                                <Card className="bg-gray-50">
                                    <Title level={4} className="mb-4">Video Playlist</Title>
                                    <div className="space-y-3">
                                        {practice.practiceVideos.map((video) => (
                                            <div
                                                key={video.id}
                                                className={`cursor-pointer p-3 rounded transition-all
                                                    ${selectedVideo?.id === video.id
                                                        ? 'bg-blue-50 ring-1 ring-blue-500'
                                                        : 'hover:bg-gray-100'}`}
                                                onClick={() => setSelectedVideo(video)}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <VideoThumbnail video={video} />
                                                    <span className="text-sm font-medium truncate">
                                                        {video.videoName}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PracticeDetail;