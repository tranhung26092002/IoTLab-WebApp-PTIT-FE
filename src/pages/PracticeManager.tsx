import React, { useState } from 'react';
import { Pagination, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { ExperimentOutlined } from '@ant-design/icons';
import { usePractice } from '../hooks/usePractice';
import { PracticeStatus } from '../types/practice';
import AppLayoutAdmin from '../components/AppLayoutAdmin';
import PracticeFiltersAdmin from '../components/practice/PracticeFiltersAdmin';
import PracticeCardAdmin from '../components/practice/PracticeCardAdmin';

const PracticeManager: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchTitle, setSearchTitle] = useState('');
  const [status, setStatus] = useState<PracticeStatus | 'ALL'>('ALL');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const { practices, isLoading } = usePractice(currentPage - 1, pageSize);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Filter practices based on search and status
  const filteredPractices = React.useMemo(() => {
    const currentData = practices?.data ?? [];
    if (!currentData.length) return [];

    return currentData.filter(practice => {
      const matchesTitle = practice.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchesStatus = status === 'ALL' || practice.status === status;
      return matchesTitle && matchesStatus;
    });
  }, [practices?.data, searchTitle, status]);

  // Sort practices
  const sortedPractices = React.useMemo(() => {
    return [...filteredPractices].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredPractices, sort]);

  // Format dates
  const formattedPractices = sortedPractices.map(practice => ({
    ...practice,
    createdAt: new Date(practice.createdAt).toLocaleString(),
    updatedAt: practice.updatedAt ? new Date(practice.updatedAt).toLocaleString() : undefined
  }));

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle, status, sort]);

  return (
    <AppLayoutAdmin>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
            <ExperimentOutlined /> Practice Manager
          </Typography.Title>
        </motion.div>

        <PracticeFiltersAdmin
          onTitleSearch={setSearchTitle}
          onStatusChange={setStatus}
          onSortChange={setSort}
          selectedStatus={status}
          selectedSort={sort}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center">
              <Spin size="large" />
            </div>
          ) : (
            formattedPractices.map((practice) => (
              <PracticeCardAdmin
                key={practice.id}
                practice={practice}
              />
            ))
          )}
        </div>

        {!isLoading && formattedPractices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy bài thực hành nào
          </div>
        )}

        {formattedPractices.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={formattedPractices.length}
              showTotal={(total) => `Tổng ${total} bài thực hành`}
              showSizeChanger
              onChange={handlePageChange}
              className="mt-4 text-right"
            />
          </div>
        )}
      </div>
    </AppLayoutAdmin>
  );
};

export default PracticeManager;