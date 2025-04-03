import React, { useEffect } from 'react';
import { Table, Button, Upload, Modal, Space, Typography, Alert } from 'antd';
import { UploadOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { useChatAdmin } from '../../hooks/useChatAdmin';
import type { UploadProps } from 'antd';
import type { Document } from '../../types';

const { Title } = Typography;

const DocumentManagement: React.FC = () => {
    const {
        documents,
        isUploading,
        uploadMessage,
        error,
        loadDocuments,
        handleFileUpload,
        handleDeleteDocument
    } = useChatAdmin();

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const handleDelete = (fileId: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tài liệu này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: () => handleDeleteDocument(fileId),
        });
    };

    const uploadProps: UploadProps = {
        beforeUpload: (file) => {
            handleFileUpload(file);
            return false;
        },
        showUploadList: false,
    };

    const columns = [
        {
            title: 'Tên tài liệu',
            dataIndex: 'filename',
            key: 'filename',
            render: (text: string, record: Document) => (
                <Space>
                    <FileOutlined />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Ngày tải lên',
            dataIndex: 'upload_timestamp',
            key: 'upload_timestamp',
            render: (date: string) => new Date(date).toLocaleString('vi-VN'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Document) => (
                <Space>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2}>Quản lý tài liệu</Title>
                    <Upload {...uploadProps}>
                        <Button type="primary" icon={<UploadOutlined />} loading={isUploading}>
                            Tải lên tài liệu
                        </Button>
                    </Upload>
                </div>

                {error && (
                    <Alert
                        message="Lỗi"
                        description={error}
                        type="error"
                        showIcon
                    />
                )}

                {uploadMessage && (
                    <Alert
                        message="Thông báo"
                        description={uploadMessage}
                        type="success"
                        showIcon
                    />
                )}

                <Table
                    columns={columns}
                    dataSource={documents}
                    rowKey="id"
                    loading={isUploading}
                    pagination={{ pageSize: 10 }}
                />
            </Space>
        </div>
    );
};

export default DocumentManagement; 