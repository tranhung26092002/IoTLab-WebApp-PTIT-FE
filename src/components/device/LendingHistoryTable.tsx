// components/device/LendingHistoryTable.tsx
import React, { useState } from 'react';
import { Table, Tag, Input, DatePicker } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { LendingHistoryRecord, HardDevice } from '../../types/hardDevice';
import dayjs from 'dayjs';

interface Props {
    lendingHistory: LendingHistoryRecord[];
    devices: HardDevice[];
}

export const LendingHistoryTable: React.FC<Props> = ({ lendingHistory, devices }) => {
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

    const columns: TableProps<LendingHistoryRecord>['columns'] = [
        {
            title: 'Device Name',
            dataIndex: 'deviceId',
            key: 'deviceId',
            render: (deviceId: string) => {
                const device = devices.find(d => d.id === deviceId);
                return device?.name || deviceId;
            },
        },
        {
            title: 'Student ID',
            dataIndex: 'studentId',
            key: 'studentId',
        },
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
        },
        {
            title: 'Borrow Date',
            dataIndex: 'borrowDate',
            key: 'borrowDate',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
            sorter: (a, b) => dayjs(a.borrowDate).unix() - dayjs(b.borrowDate).unix(),
        },
        {
            title: 'Return Date',
            dataIndex: 'returnDate',
            key: 'returnDate',
            render: (date?: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'active' | 'returned') => (
                <Tag color={status === 'active' ? 'processing' : 'success'}>
                    {status.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Returned', value: 'returned' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes?: string) => notes || '-',
        },
    ];

    const filterData = (data: LendingHistoryRecord[]) => {
        return data.filter(record => {
            const matchesSearch = searchText ? (
                record.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
                record.studentId.toLowerCase().includes(searchText.toLowerCase())
            ) : true;

            const matchesDateRange = dateRange[0] && dateRange[1] ? (
                dayjs(record.borrowDate).isBetween(dateRange[0], dateRange[1], 'day', '[]')
            ) : true;

            return matchesSearch && matchesDateRange;
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                <Input
                    placeholder="Search by student"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    className="max-w-xs"
                />
                <DatePicker.RangePicker
                    onChange={(dates) => setDateRange(dates)}
                    className="max-w-xs"
                />
            </div>

            <Table
                columns={columns}
                dataSource={filterData(lendingHistory)}
                rowKey="id"
                className="bg-white rounded-lg shadow-sm"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} records`,
                }}
            />
        </div>
    );
};