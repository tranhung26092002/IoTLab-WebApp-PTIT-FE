import React, { useState } from 'react';
import { Pagination, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { ExperimentOutlined } from '@ant-design/icons';
import { PracticeCard } from '../components/practice/PracticeCard';
import { PracticeFilters } from '../components/practice/PracticeFilters';
import AppLayout from '../components/AppLayout';
import { usePractice } from '../hooks/usePractice';

const PracticePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchTitle, setSearchTitle] = useState('');
  const { allPractices, isLoadingAll } = usePractice(currentPage - 1, pageSize);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Filter practices based on search only
  const filteredPractices = React.useMemo(() => {
    const currentData = allPractices?.data ?? [];
    if (!currentData.length) return [];

    return currentData.filter(practice =>
      practice.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  }, [allPractices?.data, searchTitle]);

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle]);

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
            <ExperimentOutlined /> Practices
          </Typography.Title>
        </motion.div>

        <PracticeFilters onTitleSearch={setSearchTitle} />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoadingAll ? (
            <div className="col-span-full flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            filteredPractices.map((practice) => (
              <PracticeCard key={practice.id} practice={practice} />
            ))
          )}

          {!isLoadingAll && filteredPractices.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Không tìm thấy bài thực hành nào
            </div>
          )}
        </motion.div>

        {filteredPractices.length > 0 && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPractices.length}
              showTotal={(total) => `Tổng ${total} bài thực hành`}
              showSizeChanger
              onChange={handlePageChange}
              className="mt-4"
            />
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default PracticePage;