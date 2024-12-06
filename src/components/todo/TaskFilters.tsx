import React from 'react';
import { Select, Space } from 'antd';

interface TaskFiltersProps {
    onStatusFilter: (value: string) => void;
    onPriorityFilter: (value: string) => void;
    onSort: (value: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
    onStatusFilter,
    onPriorityFilter,
    onSort
}) => {
    return (
        <Space className="mb-4">
            <Select
                placeholder="Filter by status"
                onChange={onStatusFilter}
                className="w-40"
            >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="todo">Todo</Select.Option>
                <Select.Option value="in-progress">In Progress</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
            </Select>

            <Select
                placeholder="Filter by priority"
                onChange={onPriorityFilter}
                className="w-40"
            >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="high">High</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="low">Low</Select.Option>
            </Select>

            <Select
                placeholder="Sort by"
                onChange={onSort}
                className="w-40"
            >
                <Select.Option value="priority">Priority</Select.Option>
                <Select.Option value="date">Date</Select.Option>
            </Select>
        </Space>
    );
};