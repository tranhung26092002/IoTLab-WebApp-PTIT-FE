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
        <div className="flex items-center gap-6 p-4">
            <Input
                placeholder="Search by name or code"
                value={filters.search}
                onChange={e => onFilterChange({ ...filters, search: e.target.value })}
                prefix={<SearchOutlined className="text-lg" />}
                allowClear
                className="flex-1 h-12 text-base font-medium"
                style={{ borderRadius: '8px' }}
            />
            <Select
                placeholder="Device Type"
                value={filters.type}
                onChange={value => onFilterChange({ ...filters, type: value })}
                allowClear
                className="w-56 h-12 text-base font-medium"
                suffixIcon={<FilterOutlined className="text-lg" />}
                style={{ borderRadius: '8px' }}
            >
                {deviceTypes.map(type => (
                    <Option key={type.value} value={type.value} className="text-base py-2">
                        {type.label}
                    </Option>
                ))}
            </Select>
            <Select
                placeholder="Status"
                value={filters.status}
                onChange={value => onFilterChange({ ...filters, status: value })}
                allowClear
                className="w-44 h-12 text-base font-medium"
                suffixIcon={<FilterOutlined className="text-lg" />}
                style={{ borderRadius: '8px' }}
            >
                {statusOptions.map(status => (
                    <Option key={status.value} value={status.value} className="text-base py-2">
                        {status.label}
                    </Option>
                ))}
            </Select>
            <Button
                icon={<ClearOutlined className="text-lg" />}
                onClick={handleClearFilters}
                className="h-12 px-6 text-base font-medium flex items-center"
                style={{ borderRadius: '8px' }}
            >
                Clear
            </Button>
        </div>
    );
};