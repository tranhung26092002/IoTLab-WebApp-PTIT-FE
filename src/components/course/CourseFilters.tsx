import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined, DownOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { SortType } from '../../types/course';

interface CourseFiltersProps {
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: SortType) => void;  // Update type here
    selectedCategory: string;
    selectedSort: SortType;  // Update type here
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
    onSearchChange,
    onCategoryChange,
    onSortChange,
    selectedCategory,
    selectedSort
}) => (
    <div className="mb-8 p-6 bg-[#2c4a2d] rounded-lg shadow-lg animate-fadeIn">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[300px]">
                <Input.Search
                    placeholder="Search courses..."
                    size="large"
                    onChange={(e) => onSearchChange(e.target.value)}
                    prefix={<SearchOutlined className="text-[#4f6f52]" />}
                />
            </div>

            <div className="min-w-[200px]">
                <Select
                    className="w-full"
                    size="large"
                    placeholder="Category"
                    onChange={onCategoryChange}
                    value={selectedCategory}
                    suffixIcon={<DownOutlined className="text-[#4f6f52]" />}
                    dropdownRender={menu => (
                        <div>
                            <div className="px-4 py-3 flex items-center gap-3 border-b border-[#4f6f52]">
                                <FilterOutlined className="text-[#4f6f52]" />
                                <span className="text-[#4f6f52]">Filter by Category</span>
                            </div>
                            {menu}
                        </div>
                    )}
                >
                    <Select.Option value="all">All Categories</Select.Option>
                    <Select.Option value="programming">Programming</Select.Option>
                    <Select.Option value="design">Design</Select.Option>
                    <Select.Option value="business">Business</Select.Option>
                    <Select.Option value="marketing">Marketing</Select.Option>
                </Select>
            </div>

            <div className="min-w-[200px]">
                <Select
                    className="w-full"
                    size="large"
                    placeholder="Sort by"
                    onChange={onSortChange}
                    value={selectedSort}
                    suffixIcon={<DownOutlined className="text-[#4f6f52]" />}
                    dropdownRender={menu => (
                        <div>
                            <div className="px-4 py-3 flex items-center gap-3 border-b border-[#4f6f52]">
                                <SortAscendingOutlined className="text-[#4f6f52]" />
                                <span className="text-[#4f6f52]">Sort by</span>
                            </div>
                            {menu}
                        </div>
                    )}
                >
                    <Select.Option value="rating">Highest Rated</Select.Option>
                    <Select.Option value="price">Price</Select.Option>
                    <Select.Option value="enrolledStudents">Most Popular</Select.Option>
                </Select>
            </div>
        </div>
    </div>
);

export default CourseFilters;