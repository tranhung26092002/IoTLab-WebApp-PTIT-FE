import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Select, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types/user';
import AppLayoutAdmin from '../components/AppLayoutAdmin';

const { Option } = Select;
const { Title } = Typography;

const UserManager: React.FC = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        users,
        isLoading,
        addUser,
        updateUser,
        deleteUser,
        isAddingUser,
        isUpdatingUser,
        isDeletingUser,
        error
    } = useUsers(currentPage - 1, pageSize);

    const roleOptions = ['ADMIN', 'STUDENT', 'TEACHER'];
    const statusOptions = ['ACTIVE', 'INACTIVE'];

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue({
            userName: user.userName,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            roleType: user.roleType,
            status: user.status,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            message.success('User deleted successfully');
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleSubmit = async (values: Partial<User>) => {
        try {
            if (editingUser) {
                await updateUser({ id: editingUser.id, data: values });
                message.success('User updated successfully');
            } else {
                await addUser(values);
                message.success('User created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingUser(null);
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingUser(null);
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a: User, b: User) => a.userName.localeCompare(b.userName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string | null) => email || '-',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (fullName: string | null) => fullName || '-',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (phone: string | null) => phone || '-',
        },
        {
            title: 'Role',
            dataIndex: 'roleType',
            key: 'roleType',
            filters: roleOptions.map(role => ({ text: role, value: role })),
            onFilter: (value: string | number | boolean, record: User) =>
                record.roleType === value.toString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <span className={status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>
                    {status}
                </span>
            ),
            filters: statusOptions.map(status => ({ text: status, value: status })),
            onFilter: (value: string | number | boolean, record: User) =>
                record.status === value.toString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        type="link"
                    />
                    <Popconfirm
                        title="Delete user"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            type="link"
                            danger
                            loading={isDeletingUser}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <AppLayoutAdmin>
                <div className="p-6">
                    <Title level={4} className="text-red-500">
                        Error loading users: {error.message}
                    </Title>
                </div>
            </AppLayoutAdmin>
        );
    }

    return (
        <AppLayoutAdmin>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6"
            >
                <div className="flex justify-between mb-4">
                    <Title level={2}>User Management</Title>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={() => {
                            setEditingUser(null);
                            form.resetFields();
                            setIsModalOpen(true);
                        }}
                    >
                        Add User
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={users?.data || []}
                    loading={isLoading}
                    rowKey="id"
                    onChange={handleTableChange}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: users?.metadata?.total || 0,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} users`,
                    }}
                />

                <Modal
                    title={editingUser ? 'Edit User' : 'Add User'}
                    open={isModalOpen}
                    onCancel={handleModalCancel}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        initialValues={{ status: 'ACTIVE', roleType: 'STUDENT' }}
                    >
                        <Form.Item
                            name="userName"
                            label="Username"
                            rules={[
                                { required: true, message: 'Please input username!' },
                                { min: 3, message: 'Username must be at least 3 characters!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please input email!' },
                                { type: 'email', message: 'Invalid email format!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            rules={[
                                { required: true, message: 'Please input full name!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={[
                                { pattern: /^\+?[0-9\s-]+$/, message: 'Please enter a valid phone number!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="roleType"
                            label="Role"
                            rules={[{ required: true, message: 'Please select role!' }]}
                        >
                            <Select>
                                {roleOptions.map(role => (
                                    <Option key={role} value={role}>{role}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status!' }]}
                        >
                            <Select>
                                {statusOptions.map(status => (
                                    <Option key={status} value={status}>{status}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item className="flex justify-end mb-0">
                            <Space>
                                <Button onClick={handleModalCancel}>Cancel</Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isAddingUser || isUpdatingUser}
                                >
                                    {editingUser ? 'Update' : 'Create'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </motion.div>
        </AppLayoutAdmin>
    );
};

export default UserManager;