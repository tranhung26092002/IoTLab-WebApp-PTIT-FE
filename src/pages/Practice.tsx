import React, { useState } from 'react';
import { Pagination, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { ExperimentOutlined } from '@ant-design/icons';
import { PracticeCard } from '../components/practice/PracticeCard';
import { PracticeFilters } from '../components/practice/PracticeFilters';
import AppLayout from '../components/AppLayout';
import { usePractice } from '../hooks/usePractice';
import { PracticeFilter } from '../types/practice';

const PracticePage: React.FC = () => {
  const [filters, setFilters] = useState<PracticeFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { useFilteredPractices } = usePractice();

  const {
    practices,
    isLoading,
    metadata,
    handlePageChange,
    handleSizeChange
  } = useFilteredPractices({
    ...filters,
    page: currentPage - 1,
    size: pageSize
  });

  const handleFilterChange = (newFilters: PracticeFilter) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }; 

  const onPaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handlePageChange(page - 1);
    handleSizeChange(size);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52]">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
            <ExperimentOutlined /> Bài thực hành
          </Typography.Title>
        </motion.div>

        <PracticeFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            practices.map((practice) => (
              <PracticeCard key={practice.id} practice={practice} />
            ))
          )}

          {!isLoading && practices.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Không tìm thấy bài thực hành nào
            </div>
          )}
        </motion.div>

        {practices.length > 0 && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={metadata?.total || 0}
              showTotal={(total) => `Tổng ${total} bài thực hành`}
              showSizeChanger
              onChange={onPaginationChange}
              className="mt-4 text-right"
            />
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default PracticePage;