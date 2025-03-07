import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Spin, Tag, Typography, List, Tooltip, Button, Space } from 'antd';
import { useAvatar } from '../hooks/useAvatar';
import { usePractice } from '../hooks/usePractice';
import { Practice, PracticeVideo } from '../types/practice';
import AppLayout from '../components/AppLayout';
import { DownloadOutlined, EditOutlined, FilePdfOutlined, FileTextOutlined, FileWordOutlined } from '@ant-design/icons';
import { DocumentViewer } from '../components/practice/DocumentViewer';
// import { VideoPlayer } from '../components/practice/VideoPlayer';
// import { VideoThumbnail } from '../components/practice/VideoThumbnail';
import PdfViewer from "../components/practice//PdfViewer";
import WordViewer from "../components/practice//WordViewer";
import ExcelViewer from "../components/practice//ExcelViewer";
import { useDocument } from '../hooks/useDocument';

const { Title, Paragraph } = Typography;

export const PracticeDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getPractice } = usePractice();
    const [practice, setPractice] = React.useState<Practice | null>(null);
    // const [selectedVideo, setSelectedVideo] = useState<PracticeVideo | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { imageUrl, isLoading: imageLoading } = useAvatar(practice?.imageUrl);
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const [documentLoading, setDocumentLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{url: string, type: string, name: string} | null>(null);
    const [viewerType, setViewerType] = useState<'pdf' | 'word' | 'excel' | null>(null);
    const { url: documentUrl, isLoading: isDocumentLoading } = useDocument(selectedFile?.url);

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

    const getFileType = (fileType: string) => {
        if (fileType.includes('pdf')) return 'pdf';
        if (fileType.includes('doc')) return 'word';
        if (fileType.includes('xls')) return 'excel';
        return 'unknown';
    };

    const handleDocumentClick = (file: any) => {
        const type = getFileType(file.fileType);
        setViewerType(type as 'pdf' | 'word' | 'excel');
        setSelectedFile({
            url: file.fileUrl,
            type: type,
            name: file.fileName
        });
    };

    const handleDocumentReady = (url: string) => {
        setDocumentLoading(false);
        window.open(url, '_blank');
        setSelectedDocument(null);
    };

    if (loading) return <Spin size="large" className="flex justify-center mt-8" />;
    if (!practice) return <div>Practice not found</div>;
    
    const handleReportClick = () => {
        if (practice?.id && practice?.title) {
            const params = new URLSearchParams({
                practiceId: practice.id.toString(),
                title: practice.title
            });
            navigate(`/report?${params.toString()}`);
        }
    };

    return (
        <AppLayout>
            {selectedDocument && (
                <DocumentViewer
                    fileUrl={selectedDocument}
                    onUrlReady={handleDocumentReady}
                />
            )}
            <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52]">
                <div className="w-full">
                    <Card className="mb-6">
                        {/* Header Section - Title, Status, and Report Button */}
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <Title level={2} className="text-[#2c4a2d] mb-0">
                                        {practice?.title}
                                    </Title>
                                    <Tag
                                        color={practice?.status === 'PUBLISHED' ? 'green' : 'gold'}
                                        className="text-sm px-3 py-1"
                                    >
                                        {practice?.status}
                                    </Tag>
                                </div>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleReportClick}
                                    className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                                    size="large"
                                >
                                    Báo cáo thực hành
                                </Button>
                            </div>

                            {/* Content Section - Image and Description */}
                            <div className="grid grid-cols-3 gap-8">
                                {/* Image Section */}
                                <div className="col-span-1">
                                    <div className="relative h-64 overflow-hidden rounded-lg border border-gray-200">
                                        {imageLoading ? (
                                            <Spin className="absolute inset-0 flex items-center justify-center" />
                                        ) : (
                                            <img
                                                src={imageUrl}
                                                alt={practice?.title}
                                                className="w-full h-full object-contain"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="col-span-2">
                                    <Card className="h-full bg-gray-50">
                                        <Title level={4} className="mb-4">Mô tả bài thực hành</Title>
                                        <Paragraph className="text-gray-600 text-base whitespace-pre-wrap">
                                            {practice?.description}
                                        </Paragraph>
                                    </Card>
                                </div>
                            </div>

                            {/* <div className="grid grid-cols-2 gap-8"> 
                                <div className="col-span-1"> 
                                    <div className="relative h-80 overflow-hidden rounded-lg border border-gray-200"> 
                                        {imageLoading ? (
                                            <Spin className="absolute inset-0 flex items-center justify-center" />
                                        ) : (
                                            <img
                                                src={imageUrl}
                                                alt={practice?.title}
                                                className="w-full h-full object-contain"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-1"> 
                                    <Card className="h-full bg-gray-50">
                                        <Title level={4} className="mb-4">Mô tả bài thực hành</Title>
                                        <Paragraph className="text-gray-600 text-base whitespace-pre-wrap">
                                            {practice?.description}
                                        </Paragraph>
                                    </Card>
                                </div>
                            </div> */}
                        </div>
                    </Card>

                    {/* Practice Guides Section */}
                    {/* {practice?.practiceGuides && practice.practiceGuides.length > 0 && (
                        <Card className="mt-6">
                            <Title level={3} className="mb-4">Hướng dẫn thực hành</Title>
                            <List
                                itemLayout="vertical"
                                dataSource={practice.practiceGuides}
                                renderItem={(guide) => (
                                    <List.Item>
                                        <Card
                                            title={<span className="text-lg font-medium">{guide.title}</span>}
                                            className="w-full hover:shadow-md transition-all"
                                        >
                                            <Paragraph className="text-base whitespace-pre-wrap">
                                                {guide.content}
                                            </Paragraph>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    )} */}

                    {/* Documents Section */}
                    {practice?.practiceFiles && practice.practiceFiles.length > 0 && (
                        <Card className="mt-6">
                            <Title level={3} className="mb-4">Tài liệu thực hành</Title>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {practice.practiceFiles.map((file) => (
                                        <Tooltip title={`Xem ${file.fileName}`} key={file.id} placement="top">
                                            <Button 
                                                onClick={() => handleDocumentClick(file)} 
                                                className={`w-full h-[100px] ${
                                                    selectedFile?.name === file.fileName 
                                                    ? 'ring-2 ring-blue-500 border-blue-500' 
                                                    : ''
                                                }`}
                                            >
                                                <div className="text-2xl">{getFileIcon(file.fileType)}</div>
                                                <div className="truncate w-[120px] text-center">{file.fileName}</div>
                                                <Tag color={file.fileType.includes("pdf") ? "red" : file.fileType.includes("doc") ? "blue" : "default"}>
                                                    {file.fileType.split("/").pop()?.toUpperCase()}
                                                </Tag>
                                            </Button>
                                        </Tooltip>
                                    ))}
                                </div>

                                {/* File Viewer Section */}
                                {selectedFile && (
                                    <Card className="mt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(selectedFile.type)}
                                                <span className="font-medium">{selectedFile.name}</span>
                                            </div>
                                            <Space>
                                                <Button 
                                                    type="primary"
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => window.open(documentUrl, '_blank')}
                                                    loading={isDocumentLoading}
                                                >
                                                    Tải xuống
                                                </Button>
                                                <Button 
                                                    size="small" 
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setViewerType(null);
                                                    }}
                                                >
                                                    Đóng
                                                </Button>
                                            </Space>
                                        </div>
                                        <div className="h-[600px] overflow-hidden border rounded-lg bg-gray-50">
                                            {isDocumentLoading ? (
                                                <div className="h-full flex items-center justify-center">
                                                    <Spin size="large" />
                                                </div>
                                            ) : (
                                                <>
                                                    {viewerType === "pdf" && <PdfViewer fileUrl={documentUrl} />}
                                                    {viewerType === "word" && <WordViewer fileUrl={documentUrl} />}
                                                    {viewerType === "excel" && <ExcelViewer fileUrl={documentUrl} />}
                                                </>
                                            )}
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default PracticeDetail;

// <div className="col-span-4">
//     {practice?.practiceVideos && practice.practiceVideos.length > 0 && (
//         <div className="top-4">

//             <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl mb-4">
//                 <VideoPlayer
//                     video={selectedVideo || practice.practiceVideos[0]}
//                     className="w-full aspect-video"
//                 />
//                 <div className="p-3 bg-gray-800 text-white">
//                     <h3 className="text-lg font-medium">
//                         {(selectedVideo || practice.practiceVideos[0]).videoName}
//                     </h3>
//                 </div>
//             </div>

//             <Card className="bg-gray-50">
//                 <Title level={4} className="mb-4">Video Playlist</Title>
//                 <div className="space-y-3">
//                     {practice.practiceVideos.map((video) => (
//                         <div
//                             key={video.id}
//                             className={`cursor-pointer p-3 rounded transition-all
//                                 ${selectedVideo?.id === video.id
//                                     ? 'bg-blue-50 ring-1 ring-blue-500'
//                                     : 'hover:bg-gray-100'}`}
//                             onClick={() => setSelectedVideo(video)}
//                         >
//                             <div className="flex flex-col gap-2">
//                                 <VideoThumbnail video={video} />
//                                 <span className="text-sm font-medium truncate">
//                                     {video.videoName}
//                                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </Card>
//         </div>
//     )}
// </div>