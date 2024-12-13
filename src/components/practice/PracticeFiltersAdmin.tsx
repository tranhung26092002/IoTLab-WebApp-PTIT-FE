import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined, DownOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { PracticeStatus } from '../../types/practice';

interface PracticeFiltersProps {
    onTitleSearch: (value: string) => void;
    onStatusChange: (value: PracticeStatus | 'ALL') => void;
    onSortChange: (value: 'newest' | 'oldest') => void;
    selectedStatus: PracticeStatus | 'ALL';
    selectedSort: 'newest' | 'oldest';
}

export const PracticeFiltersAdmin: React.FC<PracticeFiltersProps> = ({
    onTitleSearch,
    onStatusChange,
    onSortChange,
    selectedStatus,
    selectedSort
}) => (
    <div className="mb-8 p-6 bg-[#2c4a2d] rounded-lg shadow-lg animate-fadeIn">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[300px]">
                <Input.Search
                    placeholder="Tìm kiếm bài thực hành..."
                    size="large"
                    onChange={(e) => onTitleSearch(e.target.value)}
                    prefix={<SearchOutlined className="text-[#4f6f52]" />}
                />
            </div>

            <div className="min-w-[200px]">
                <Select
                    className="w-full"
                    size="large"
                    placeholder="Trạng thái"
                    value={selectedStatus}
                    onChange={onStatusChange}
                    suffixIcon={<DownOutlined className="text-[#4f6f52]" />}
                    dropdownRender={menu => (
                        <div>
                            <div className="px-4 py-3 flex items-center gap-3 border-b border-[#4f6f52]">
                                <FilterOutlined className="text-[#4f6f52]" />
                                <span className="text-[#4f6f52]">Lọc theo trạng thái</span>
                            </div>
                            {menu}
                        </div>
                    )}
                >
                    <Select.Option value="ALL">Tất cả</Select.Option>
                    <Select.Option value={PracticeStatus.PUBLISHED}>Đã xuất bản</Select.Option>
                    <Select.Option value={PracticeStatus.DRAFT}>Bản nháp</Select.Option>
                </Select>
            </div>

            <div className="min-w-[200px]">
                <Select
                    className="w-full"
                    size="large"
                    placeholder="Sắp xếp"
                    value={selectedSort}
                    onChange={onSortChange}
                    suffixIcon={<DownOutlined className="text-[#4f6f52]" />}
                    dropdownRender={menu => (
                        <div>
                            <div className="px-4 py-3 flex items-center gap-3 border-b border-[#4f6f52]">
                                <SortAscendingOutlined className="text-[#4f6f52]" />
                                <span className="text-[#4f6f52]">Sắp xếp theo</span>
                            </div>
                            {menu}
                        </div>
                    )}
                >
                    <Select.Option value="newest">Mới nhất</Select.Option>
                    <Select.Option value="oldest">Cũ nhất</Select.Option>
                </Select>
            </div>
        </div>
    </div>
);

export default PracticeFiltersAdmin;