import { Input, Select } from 'antd';
import { FilterParams } from '../../types/hardDevice';

interface HardDeviceFiltersProps {
    filters: FilterParams;
    onFilterChange: (filters: FilterParams) => void;
}

export const HardDeviceFilters: React.FC<HardDeviceFiltersProps> = ({ filters, onFilterChange }) => (
    <div className="space-y-4">
        <Input
            placeholder="Search devices"
            value={filters.search}
            onChange={e => onFilterChange({ ...filters, search: e.target.value })}
        />
        <Select
            className="w-full"
            placeholder="Device Type"
            value={filters.type}
            onChange={value => onFilterChange({ ...filters, type: value })}
        >
            <Select.Option value="arduino">Arduino</Select.Option>
            <Select.Option value="esp">ESP</Select.Option>
            <Select.Option value="raspberry">Raspberry Pi</Select.Option>
        </Select>
    </div>
);