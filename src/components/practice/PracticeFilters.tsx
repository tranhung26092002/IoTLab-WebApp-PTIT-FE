import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface PracticeFiltersProps {
    onTitleSearch: (value: string) => void;
}

export const PracticeFilters: React.FC<PracticeFiltersProps> = ({
    onTitleSearch,
}) => (
    <div className="mb-6">
        <div className="max-w-xl mx-auto">
            <Input.Search
                placeholder="Tìm kiếm bài thực hành..."
                size="large"
                onChange={(e) => onTitleSearch(e.target.value)}
                prefix={<SearchOutlined className="text-[#4f6f52]" />}
                className="shadow-sm hover:shadow-md transition-all duration-300"
                enterButton={
                    <Button
                        type="primary"
                        className="bg-[#4f6f52] hover:!bg-[#2c4a2d]"
                    >
                        Tìm kiếm
                    </Button>
                }
                style={{
                    borderRadius: '8px',
                }}
            />
        </div>
    </div>
);

export default PracticeFilters;