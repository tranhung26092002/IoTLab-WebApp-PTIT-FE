import React from 'react';
import { Input, Select, Space, Button } from 'antd';
import { DeviceFilterParams } from '../../types/hardDevice';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
    filters: DeviceFilterParams;
    onFilterChange: (filters: DeviceFilterParams) => void;
}

const deviceTypes = [
    { value: 'arduino', label: 'Arduino' },
    { value: 'esp', label: 'ESP' },
    { value: 'raspberry', label: 'Raspberry Pi' },
    { value: 'sensor', label: 'Sensor' },
    { value: 'other', label: 'Other' }
];

const statusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'BORROWED', label: 'Borrowed' }
];

export const HardDeviceFilters: React.FC<Props> = ({ filters, onFilterChange }) => {
    const handleClearFilters = () => {
        onFilterChange({});
    };

    return (
        <Space direction="vertical" className="w-full">
            <div className="flex gap-4">
                <Input
                    placeholder="Search by name or code"
                    value={filters.search}
                    onChange={e => onFilterChange({ ...filters, search: e.target.value })}
                    prefix={<SearchOutlined />}
                    allowClear
                    className="flex-1"
                />
                <Button
                    icon={<ClearOutlined />}
                    onClick={handleClearFilters}
                >
                    Clear
                </Button>
            </div>

            <div className="flex gap-4">
                <Select
                    placeholder="Device Type"
                    value={filters.type}
                    onChange={value => onFilterChange({ ...filters, type: value })}
                    allowClear
                    className="flex-1"
                    suffixIcon={<FilterOutlined />}
                >
                    {deviceTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                            {type.label}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Status"
                    value={filters.status}
                    onChange={value => onFilterChange({ ...filters, status: value })}
                    allowClear
                    className="flex-1"
                    suffixIcon={<FilterOutlined />}
                >
                    {statusOptions.map(status => (
                        <Option key={status.value} value={status.value}>
                            {status.label}
                        </Option>
                    ))}
                </Select>
            </div>
        </Space>
    );
};