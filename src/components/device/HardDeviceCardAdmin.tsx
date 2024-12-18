import React, { useState } from 'react';
import { Card, Button, Tag, Typography, Tooltip, Spin, Image, Descriptions, Avatar, Modal, Space, Input, Popconfirm } from 'antd';
import { Device } from '../../types/hardDevice';
import { motion } from 'framer-motion';
import { CalendarOutlined, UserOutlined, EditOutlined, CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import defaultImage from '../../assets/default-device.png';
import { User } from '../../types/user';
import { useUsers } from '../../hooks/useUsers';
import { useAvatar } from '../../hooks/useAvatar';
import { Form, Upload } from 'antd';
import { useHardDevices } from '../../hooks/useHardDevices';

const { Text } = Typography;
interface Props {
    device: Device;
    onBorrow: (device: Device) => void;
}

export const HardDeviceCardAdmin: React.FC<Props> = ({ device }) => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { getUser } = useUsers();
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const { imageUrl, isLoading: isLoadingDeviceImage } = useAvatar(device.imageUrl);
    const { imageUrl: userAvatarUrl, isLoading: isLoadingUserAvatar } = useAvatar(currentUser?.avatarUrl);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const { updateDevice, deleteDevice, isUpdating, isDeleting } = useHardDevices();


    const handleShowBorrower = async () => {
        if (device.currentBorrower) {
            setIsLoadingUser(true);
            try {
                const user = await getUser(device.currentBorrower);
                setCurrentUser(user);
                setIsUserModalOpen(true);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoadingUser(false);
            }
        }
    };

    const handleEdit = () => {
        form.setFieldsValue({
            name: device.name,
            code: device.code,
            type: device.type,
            description: device.description,
        });
        setImagePreview(imageUrl);
        setIsEditModalOpen(true);
    };

    const handleEditImageChange = (info: { file: File }) => {
        if (info.file) {
            setEditImageFile(info.file);
            const previewUrl = URL.createObjectURL(info.file);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    };

    const handleUpdateSubmit = async (values: Partial<Device>) => {
        try {
            await updateDevice({
                id: device.id,
                device: values,
                file: editImageFile || undefined
            });
            setIsEditModalOpen(false);
            form.resetFields();
            setEditImageFile(null);
        } catch (error) {
            console.error('Failed to update device:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDevice(device.id);
        } catch (error) {
            console.error('Failed to delete device:', error);
        }
    };

    const { returnDevice, isReturning } = useHardDevices();

    const handleReturn = async () => {
        // Get the active borrow record (status: BORROWED)
        const activeBorrowRecord = device.borrowRecords.find(
            record => record.status === 'BORROWED'
        );

        if (!activeBorrowRecord) return;

        try {
            await returnDevice(activeBorrowRecord.id);
            setIsUserModalOpen(false);
            setCurrentUser(null);
        } catch (error) {
            console.error('Failed to return device:', error);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <Card
                hoverable
                cover={
                    <div className="h-48 flex items-center justify-center bg-gray-50">
                        {isLoadingDeviceImage ? (
                            <Spin />
                        ) : (
                            <Image
                                alt={device.name}
                                src={imageUrl}
                                fallback={defaultImage}
                                preview={false}
                                height={192}
                                style={{
                                    objectFit: 'contain',
                                    backgroundColor: '#f5f5f5'
                                }}
                            />
                        )}
                    </div>
                }
                actions={[
                    <div className="flex flex-col space-y-2 px-4">
                        <div className="flex gap-2">
                            <Button
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                                className="flex-1"
                            >
                                Edit
                            </Button>
                            <Popconfirm
                                title="Delete Device"
                                description="Are you sure you want to delete this device?"
                                onConfirm={handleDelete}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    loading={isDeleting}
                                    className="flex-1"
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </div>
                        {device.currentBorrower && (
                            <Button
                                icon={<UserOutlined />}
                                onClick={handleShowBorrower}
                                loading={isLoadingUser}
                                className="w-full"
                            >
                                Current Borrower
                            </Button>
                        )}
                    </div>
                ]}
            >
                <Card.Meta
                    title={
                        <div className="flex flex-col">
                            <Tooltip title={device.code}>
                                <Text strong className="text-lg">{device.name}</Text>
                            </Tooltip>
                            <Text type="secondary" className="text-sm">{device.code}</Text>
                        </div>
                    }
                    description={
                        <div className="space-y-3 mt-2">
                            <div className="flex justify-between items-center">
                                <Text type="secondary" className="text-sm">{device.type}</Text>
                                <Tag color={device.status === 'AVAILABLE' ? 'green' : 'red'}>
                                    {device.status}
                                </Tag>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <CalendarOutlined />
                                <Text type="secondary">
                                    Total borrowed: {device.totalBorrowed}
                                </Text>
                            </div>

                            {device.description && (
                                <Text type="secondary" className="block text-sm">
                                    {device.description}
                                </Text>
                            )}
                        </div>
                    }
                />
            </Card>

            <Modal
                title="Current Borrower Details"
                open={isUserModalOpen}
                onCancel={() => setIsUserModalOpen(false)}
                footer={
                    <div className="flex justify-end">
                        <Popconfirm
                            title="Return Device"
                            description="Are you sure you want to return this device?"
                            onConfirm={handleReturn}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ className: 'bg-[#4f6f52]' }}
                        >
                            <Button
                                type="primary"
                                loading={isReturning}
                                className="bg-[#4f6f52] hover:bg-[#2c4a2d]"
                            >
                                Return Device
                            </Button>
                        </Popconfirm>
                    </div>
                }
            >
                {currentUser && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                src={userAvatarUrl}
                                size={64}
                                icon={isLoadingUserAvatar ? <Spin /> : <UserOutlined />}
                            />
                            <div>
                                <Text strong className="text-lg">{currentUser.fullName}</Text>
                                <Text type="secondary" className="block">{currentUser.userName}</Text>
                            </div>
                        </div>
                        <Descriptions column={1}>
                            <Descriptions.Item label="Email">{currentUser.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{currentUser.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Role">{currentUser.roleType}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={currentUser.status === 'ACTIVE' ? 'green' : 'red'}>
                                    {currentUser.status}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>

            <Modal
                title="Edit Device"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateSubmit}
                >
                    <div className="mb-4 text-center">
                        <Upload
                            showUploadList={false}
                            beforeUpload={(file) => {
                                handleEditImageChange({ file });
                                return false;
                            }}
                        >
                            <div className="cursor-pointer">
                                <Image
                                    src={imagePreview || defaultImage}
                                    alt="device"
                                    width={200}
                                    height={200}
                                    style={{ objectFit: 'contain' }}
                                />
                                <Button icon={<CameraOutlined />} className="mt-2">
                                    Change Image
                                </Button>
                            </div>
                        </Upload>
                    </div>

                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input device name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Code"
                        rules={[{ required: true, message: 'Please input device code!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please input device type!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item className="flex justify-end mb-0">
                        <Space>
                            <Button onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={isUpdating}>
                                Save
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </motion.div>
    );
};