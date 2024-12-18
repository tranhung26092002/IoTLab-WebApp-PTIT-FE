import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Tag, Typography, Divider, List, Tooltip, Button, Modal, Form, Upload, Input, Select, message, Popconfirm, Empty } from 'antd';
import { useAvatar } from '../hooks/useAvatar';
import { usePractice } from '../hooks/usePractice';
import { Practice, PracticeGuide, PracticeVideo } from '../types/practice';
import { DeleteOutlined, EditOutlined, FilePdfOutlined, FileTextOutlined, FileWordOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { VideoPlayer } from '../components/practice/VideoPlayer';
import { VideoThumbnail } from '../components/practice/VideoThumbnail';
import { DocumentViewer } from '../components/practice/DocumentViewer';
import AppLayoutAdmin from '../components/AppLayoutAdmin';

const { Title, Paragraph } = Typography;

export const PracticeDetailManager: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getPractice } = usePractice();
    const [practice, setPractice] = React.useState<Practice | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<PracticeVideo | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { imageUrl, isLoading: imageLoading } = useAvatar(practice?.imageUrl);

    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const [documentLoading, setDocumentLoading] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { updatePractice } = usePractice();

    const [isAddFileModalVisible, setIsAddFileModalVisible] = useState(false);
    const [fileForm] = Form.useForm();
    const { addFile, deleteFile, isAddingFile, isDeletingFile } = usePractice();

    const [isAddGuideModalVisible, setIsAddGuideModalVisible] = useState(false);
    const [guideForm] = Form.useForm();
    const { addGuide, deleteGuide, isAddingGuide, isDeletingGuide } = usePractice();

    const [isEditGuideModalVisible, setIsEditGuideModalVisible] = useState(false);
    const [editGuideForm] = Form.useForm();
    const [selectedGuide, setSelectedGuide] = useState<PracticeGuide | null>(null);
    const { updateGuide, isUpdatingGuide } = usePractice();

    const [isAddVideoModalVisible, setIsAddVideoModalVisible] = useState(false);
    const [videoForm] = Form.useForm();
    const { addVideo, deleteVideo, isAddingVideo, isDeletingVideo } = usePractice();

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

    const handleUpdate = async (values: any) => {
        if (!practice?.id) {
            message.error('Practice ID not found');
            return;
        }
        try {
            await updatePractice({
                id: practice.id,
                practice: {
                    title: values.title,
                    description: values.description,
                    status: values.status
                },
                file: values.image?.fileList[0]?.originFileObj
            });
            setIsEditModalVisible(false);
            window.location.reload();
            // message.success('Cập nhật thành công');
        } catch {
            // message.error('Cập nhật thất bại');
        }
    };

    const handleAddFile = async (values: any) => {
        if (!practice?.id) {
            message.error('Practice ID not found');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', values.file.fileList[0].originFileObj);
            formData.append('fileName', values.fileName);

            await addFile({
                practiceId: practice.id,
                formData: formData
            });

            setIsAddFileModalVisible(false);
            fileForm.resetFields();

            // Refresh data
            const data = await getPractice(parseInt(id!));
            setPractice(data);
        } catch {
            // message.error('Thêm file thất bại');
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        try {
            await deleteFile({ fileId });
            message.success('Xóa file thành công');
            window.location.reload();
            // Refresh practice data
            const data = await getPractice(parseInt(id!));
            setPractice(data);
        } catch {
            message.error('Xóa file thất bại');
        }
    };

    const handleAddGuide = async (values: any) => {
        if (!practice?.id) return;
        try {
            await addGuide({
                practiceId: practice.id,
                guide: {
                    title: values.title,
                    content: values.content,
                    id: 0,
                    createdAt: ''
                }
            });
            setIsAddGuideModalVisible(false);
            guideForm.resetFields();
            const data = await getPractice(parseInt(id!));
            setPractice(data);
        } catch {
            // message.error('Thêm hướng dẫn thất bại');
        }
    };

    const handleDeleteGuide = async (guideId: number) => {
        try {
            await deleteGuide({ guideId });
            const data = await getPractice(parseInt(id!));
            setPractice(data);
        } catch {
            // message.error('Xóa hướng dẫn thất bại');
        }
    };

    const handleUpdateGuide = async (values: any) => {
        if (!selectedGuide?.id) return;

        try {
            await updateGuide({
                guideId: selectedGuide.id,
                guide: {
                    title: values.title,
                    content: values.content,
                    id: selectedGuide.id,
                    createdAt: selectedGuide.createdAt
                }
            });
            setIsEditGuideModalVisible(false);
            window.location.reload(); // Add this line
            editGuideForm.resetFields();
            setSelectedGuide(null);
        } catch {
            // Error handled by mutation
        }
    };

    // Update guide card edit button click handler
    const handleEditGuideClick = (guide: PracticeGuide) => {
        setSelectedGuide(guide);
        editGuideForm.setFieldsValue(guide);
        setIsEditGuideModalVisible(true);
    };

    const handleAddVideo = async (values: any) => {
        if (!practice?.id) return;

        try {
            const formData = new FormData();
            formData.append('video', values.video.fileList[0].originFileObj);
            formData.append('videoName', values.videoName);

            await addVideo({
                practiceId: practice.id,
                formData: formData
            });
            setIsAddVideoModalVisible(false);
            videoForm.resetFields();
            const data = await getPractice(parseInt(id!));
            setPractice(data);
        } catch {
            // Error handled by mutation
        }
    };

    const handleDeleteVideo = async (videoId: number) => {
        try {
            await deleteVideo({ videoId });
            const data = await getPractice(parseInt(id!));
            setPractice(data);
        } catch {
            // Error handled by mutation
        }
    };


    if (loading) return <Spin size="large" className="flex justify-center mt-8" />;
    if (!practice) return <div>Practice not found</div>;

    return (
        <AppLayoutAdmin>
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
                                    <>
                                        <img
                                            src={imageUrl}
                                            alt={practice?.title}
                                            className="w-full h-full object-contain"
                                        />
                                        <Tag
                                            color={practice?.status === 'PUBLISHED' ? 'green' : 'gold'}
                                            className="absolute top-4 left-4"
                                        >
                                            {practice?.status}
                                        </Tag>
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={() => setIsEditModalVisible(true)}
                                            className="absolute top-4 right-4 bg-[#4f6f52] hover:bg-[#2c4a2d]"
                                        >
                                            Update practice
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Title and Description */}
                            <Title level={2} className="text-[#2c4a2d] mb-4">
                                {practice?.title}
                            </Title>
                            <Paragraph className="text-gray-600 text-lg">{practice?.description}</Paragraph>

                            {/* Files Section */}
                            <div className="mt-6">
                                <Divider orientation="left">
                                    <div className="flex items-center gap-2">
                                        <Title level={4}>Documents</Title>
                                        <Tag color="blue">{practice?.practiceFiles?.length || 0} Files</Tag>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => setIsAddFileModalVisible(true)}
                                            className="ml-auto bg-[#4f6f52] hover:bg-[#2c4a2d]"
                                        >
                                            Add file
                                        </Button>
                                    </div>
                                </Divider>

                                {practice?.practiceFiles && practice.practiceFiles.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {practice.practiceFiles.map((file) => (
                                            <div key={file.id} className="relative">
                                                <Tooltip title={`Open ${file.fileName}`}>
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

                                                <Popconfirm
                                                    title="Xóa file"
                                                    description="Bạn có chắc chắn muốn xóa file này?"
                                                    onConfirm={() => handleDeleteFile(file.id)}
                                                    okButtonProps={{ className: 'bg-[#4f6f52]' }}
                                                >
                                                    <Button
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        size="small"
                                                        className="absolute -top-2 -right-2 rounded-full shadow-md hover:shadow-lg"
                                                        loading={isDeletingFile}
                                                    />
                                                </Popconfirm>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            <span className="text-gray-500">
                                                No documents uploaded yet
                                            </span>
                                        }
                                        className="my-8"
                                    />
                                )}
                            </div>
                        </Card>

                        {/* Guides Section */}
                        <Card className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <Title level={3}>Practice Guides</Title>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsAddGuideModalVisible(true)}
                                    className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                                >
                                    Add guide
                                </Button>
                            </div>

                            {practice?.practiceGuides && practice.practiceGuides.length > 0 ? (
                                <List
                                    itemLayout="vertical"
                                    dataSource={practice.practiceGuides}
                                    renderItem={(guide) => (
                                        <List.Item>
                                            <Card
                                                className="w-full hover:shadow-md transition-all"
                                                title={
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg">{guide.title}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                icon={<EditOutlined />}
                                                                size="small"
                                                                type="text"
                                                                className="hover:text-blue-500"
                                                                onClick={() => handleEditGuideClick(guide)}
                                                            />
                                                            <Popconfirm
                                                                title="Xóa hướng dẫn"
                                                                description="Bạn có chắc chắn muốn xóa hướng dẫn này?"
                                                                onConfirm={() => handleDeleteGuide(guide.id)}
                                                                okButtonProps={{ className: 'bg-[#4f6f52]' }}
                                                            >
                                                                <Button
                                                                    danger
                                                                    icon={<DeleteOutlined />}
                                                                    size="small"
                                                                    type="text"
                                                                    loading={isDeletingGuide}
                                                                />
                                                            </Popconfirm>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <Paragraph className="text-base">{guide.content}</Paragraph>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className="text-gray-500">
                                            No guides created yet
                                        </span>
                                    }
                                    className="my-8"
                                />
                            )}
                        </Card>
                    </div>

                    {/* Right Column - Videos */}
                    <div className="col-span-4">
                        {/* Video Player Section */}
                        {practice?.practiceVideos && practice.practiceVideos.length > 0 && (
                            <div className="top-4 mb-4">
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
                            </div>
                        )}

                        {/* Video Playlist Section */}
                        <Card className="bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <Title level={4}>Video Playlist</Title>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsAddVideoModalVisible(true)}
                                    className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                                >
                                    Add video
                                </Button>
                            </div>

                            {practice?.practiceVideos && practice.practiceVideos.length > 0 ? (
                                <div className="space-y-3">
                                    {practice.practiceVideos.map((video) => (
                                        <div
                                            key={video.id}
                                            className={`cursor-pointer p-3 rounded transition-all
                            ${selectedVideo?.id === video.id
                                                    ? 'bg-blue-50 ring-1 ring-blue-500'
                                                    : 'hover:bg-gray-100'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="flex flex-col gap-2 flex-1"
                                                    onClick={() => setSelectedVideo(video)}
                                                >
                                                    <VideoThumbnail video={video} />
                                                    <span className="text-sm font-medium truncate">
                                                        {video.videoName}
                                                    </span>
                                                </div>
                                                <Popconfirm
                                                    title="Xóa video"
                                                    description="Bạn có chắc chắn muốn xóa video này?"
                                                    onConfirm={() => handleDeleteVideo(video.id)}
                                                    okButtonProps={{ className: 'bg-[#4f6f52]' }}
                                                >
                                                    <Button
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        size="small"
                                                        type="text"
                                                        loading={isDeletingVideo}
                                                    />
                                                </Popconfirm>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className="text-gray-500">
                                            No videos uploaded yet
                                        </span>
                                    }
                                    className="my-8"
                                />
                            )}
                        </Card>
                    </div>
                </div>
            </div>
            <Modal
                title="Cập nhật bài thực hành"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                    initialValues={{
                        title: practice?.title,
                        description: practice?.description,
                        status: practice?.status
                    }}
                >
                    <Form.Item name="image" label="Hình ảnh">
                        <Upload maxCount={1} listType="picture-card">
                            <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value="DRAFT">Nháp</Select.Option>
                            <Select.Option value="PUBLISHED">Xuất bản</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button onClick={() => setIsEditModalVisible(false)} className="mr-2">
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                        >
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Thêm file"
                open={isAddFileModalVisible}
                onCancel={() => setIsAddFileModalVisible(false)}
                footer={null}
            >
                <Form
                    form={fileForm}
                    layout="vertical"
                    onFinish={handleAddFile}
                >
                    <Form.Item
                        name="fileName"
                        label="Tên file"
                        rules={[{ required: true, message: 'Vui lòng nhập tên file!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="file"
                        label="File"
                        rules={[{ required: true, message: 'Vui lòng chọn file!' }]}
                    >
                        <Upload maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Chọn file</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button
                            onClick={() => setIsAddFileModalVisible(false)}
                            className="mr-2"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isAddingFile}
                            className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                        >
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm hướng dẫn"
                open={isAddGuideModalVisible}
                onCancel={() => setIsAddGuideModalVisible(false)}
                footer={null}
            >
                <Form
                    form={guideForm}
                    layout="vertical"
                    onFinish={handleAddGuide}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button
                            onClick={() => setIsAddGuideModalVisible(false)}
                            className="mr-2"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isAddingGuide}
                            className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                        >
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Cập nhật hướng dẫn"
                open={isEditGuideModalVisible}
                onCancel={() => {
                    setIsEditGuideModalVisible(false);
                    setSelectedGuide(null);
                    editGuideForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={editGuideForm}
                    layout="vertical"
                    onFinish={handleUpdateGuide}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button
                            onClick={() => {
                                setIsEditGuideModalVisible(false);
                                setSelectedGuide(null);
                                editGuideForm.resetFields();
                            }}
                            className="mr-2"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdatingGuide}
                            className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                        >
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm video"
                open={isAddVideoModalVisible}
                onCancel={() => setIsAddVideoModalVisible(false)}
                footer={null}
            >
                <Form
                    form={videoForm}
                    layout="vertical"
                    onFinish={handleAddVideo}
                >
                    <Form.Item
                        name="videoName"
                        label="Tên video"
                        rules={[{ required: true, message: 'Vui lòng nhập tên video!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="video"
                        label="Video"
                        rules={[{ required: true, message: 'Vui lòng chọn video!' }]}
                    >
                        <Upload maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Chọn video</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button onClick={() => setIsAddVideoModalVisible(false)} className="mr-2">
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isAddingVideo}
                            className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                        >
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayoutAdmin>
    );
};

export default PracticeDetailManager;