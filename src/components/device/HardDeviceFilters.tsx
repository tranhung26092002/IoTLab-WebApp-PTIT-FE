import React from 'react';
import { Input, Select, Button } from 'antd';
import { DeviceFilterParams } from '../../types/hardDevice';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
    filters: DeviceFilterParams;
    onFilterChange: (filters: DeviceFilterParams) => void;
}

const deviceTypes = [
    { value: 'actuator', label: 'Actuator' },
    { value: 'arduino', label: 'Arduino' },
    { value: 'communication', label: 'Communication' },
    { value: 'cooling', label: 'Cooling' },
    { value: 'display', label: 'Display' },
    { value: 'driver', label: 'Driver' },
    { value: 'esp', label: 'ESP' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'lock', label: 'Lock' },
    { value: 'module', label: 'Module' },
    { value: 'navigation', label: 'Navigation' },
    { value: 'power', label: 'Power' },
    { value: 'raspberry', label: 'Raspberry' },
    { value: 'sensor', label: 'Sensor' },
    { value: 'switch', label: 'Switch' }
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
        <div className="flex items-center gap-4">
            <Input
                placeholder="Search by name or code"
                value={filters.search}
                onChange={e => onFilterChange({ ...filters, search: e.target.value })}
                prefix={<SearchOutlined />}
                allowClear
                className="flex-1"
            />
            <Select
                placeholder="Device Type"
                value={filters.type}
                onChange={value => onFilterChange({ ...filters, type: value })}
                allowClear
                className="w-48"
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
                className="w-36"
                suffixIcon={<FilterOutlined />}
            >
                {statusOptions.map(status => (
                    <Option key={status.value} value={status.value}>
                        {status.label}
                    </Option>
                ))}
            </Select>
            <Button
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
            >
                Clear
            </Button>
        </div>
    );
};