import React, { useState } from 'react';
import { Table, Tag, Input, DatePicker, Tooltip, Button, Modal, Avatar, Spin, Descriptions, Typography } from 'antd';
import type { TableProps } from 'antd';
import { ClockCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Device, BorrowRecord, DeviceFormValues } from '../../types/hardDevice';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useUsers } from '../../hooks/useUsers';
import { useAvatar } from '../../hooks/useAvatar';
import { User } from '../../types/user';

// Register plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { Text } = Typography;

interface Props {
    borrowRecords: BorrowRecord[];
    devices: Device[];
    loading?: boolean;
}


export const LendingHistoryTableAdmin: React.FC<Props> = ({ borrowRecords, loading }) => {
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { getUser } = useUsers();
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const { imageUrl: userAvatarUrl, isLoading: isLoadingUserAvatar } = useAvatar(currentUser?.avatarUrl);

    const handleShowUser = async (userId: number) => {
        setIsLoadingUser(true);
        try {
            const user = await getUser(userId);
            setCurrentUser(user);
            setIsUserModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setIsLoadingUser(false);
        }
    };

    const columns: TableProps<BorrowRecord>['columns'] = [
        {
            title: 'Device Info',
            dataIndex: 'device',
            key: 'device',
            render: (device: DeviceFormValues) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium">{device.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Code:</span>
                        <span className="text-gray-600 text-sm">{device.code}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Borrower',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId: number) => (
                <Button
                    type="link"
                    icon={<UserOutlined />}
                    onClick={() => handleShowUser(userId)}
                    loading={isLoadingUser}
                >
                    View Details
                </Button>
            ),
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            render: (note?: string) => (
                note ? (
                    <Tooltip title={note}>
                        <div className="max-w-[200px] truncate">{note}</div>
                    </Tooltip>
                ) : '-'
            ),
        },
        {
            title: 'Borrow Date',
            dataIndex: 'borrowedAt',
            key: 'borrowedAt',
            render: (date: string) => (
                <span>{dayjs(date).format('DD/MM/YYYY')}</span>
            ),
            sorter: (a, b) => dayjs(a.borrowedAt).unix() - dayjs(b.borrowedAt).unix(),
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiredAt',
            key: 'expiredAt',
            render: (date: string) => {
                const isExpired = dayjs().isAfter(date);
                const isClose = dayjs().add(3, 'day').isAfter(date);

                return (
                    <Tag
                        icon={isClose ? <ClockCircleOutlined /> : null}
                        color={isExpired ? 'red' : (isClose ? 'warning' : 'default')}
                    >
                        {dayjs(date).format('DD/MM/YYYY')}
                    </Tag>
                );
            },
        },
        {
            title: 'Return Date',
            dataIndex: 'returnedAt',
            key: 'returnedAt',
            render: (date?: string) => date ? (
                <span>{dayjs(date).format('DD/MM/YYYY')}</span>
            ) : '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'BORROWED' | 'RETURNED') => {
                const color = status === 'BORROWED' ? 'blue' : 'green';
                const icon = status === 'BORROWED' ? '🔄' : '✅';
                return (
                    <Tag color={color}>
                        {icon} {status}
                    </Tag>
                );
            },
            filters: [
                { text: 'Borrowed', value: 'BORROWED' },
                { text: 'Returned', value: 'RETURNED' },
            ],
            onFilter: (value, record) => record.status === value,
        }
    ];

    const filterData = (data: BorrowRecord[]) => {
        return data.filter(record => {
            // Text search
            const matchesSearch = searchText ? (
                record.device.name.toLowerCase().includes(searchText.toLowerCase()) ||
                record.device.code.toLowerCase().includes(searchText.toLowerCase())
            ) : true;

            // Date filtering
            const borrowDate = dayjs(record.borrowedAt);

            // Handle start date only
            if (startDate && !endDate) {
                return matchesSearch && borrowDate.isSameOrAfter(startDate, 'day');
            }

            // Handle end date only
            if (!startDate && endDate) {
                return matchesSearch && borrowDate.isSameOrBefore(endDate, 'day');
            }

            // Handle both dates
            if (startDate && endDate) {
                return matchesSearch && borrowDate.isBetween(startDate, endDate, 'day', '[]');
            }

            return matchesSearch;
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                <Input
                    placeholder="Search by device name/code"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    className="max-w-xs"
                />
                <div className="flex items-center gap-2">
                    <DatePicker
                        placeholder="Start Date"
                        onChange={setStartDate}
                        value={startDate}
                        className="w-40"
                        disabledDate={current => endDate ? current > endDate : false}
                    />
                    <span className="text-gray-500">to</span>
                    <DatePicker
                        placeholder="End Date"
                        onChange={setEndDate}
                        value={endDate}
                        className="w-40"
                        disabledDate={current => startDate ? current < startDate : false}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filterData(borrowRecords)}
                rowKey="id"
                loading={loading}
                className="bg-white rounded-lg shadow-sm"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} records`,
                }}
            />

            <Modal
                title="Borrower Details"
                open={isUserModalOpen}
                onCancel={() => setIsUserModalOpen(false)}
                footer={null}
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
        </div>
    );
};