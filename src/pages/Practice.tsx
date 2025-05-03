import React, { useState } from 'react';
import { Pagination, Spin, Typography, Progress } from 'antd';
import { motion } from 'framer-motion';
import { ExperimentOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { PracticeCard } from '../components/practice/PracticeCard';
import { PracticeFilters } from '../components/practice/PracticeFilters';
import AppLayout from '../components/AppLayout';
import { usePractice } from '../hooks/usePractice';
import { PracticeFilter, PracticeProgress } from '../types/practice';
import { useStudentProgress } from '../hooks/useStudentProgress';
import { useUsers } from '../hooks/useUsers';

const PracticePage: React.FC = () => {
  const [filters, setFilters] = useState<PracticeFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { useFilteredPractices } = usePractice();
  const { me } = useUsers({ enableMe: true });
  const { studentProgresses, completionRate } = useStudentProgress(me?.id ?? 0);

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
    setCurrentPage(1);
  }; 

  const onPaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handlePageChange(page - 1);
    handleSizeChange(size);
  };

  // Tạo map để dễ dàng tìm practiceProgress theo practiceId
  const practiceProgressMap = React.useMemo(() => {
    if (!studentProgresses) return {};
    const map: Record<number, PracticeProgress> = {};
    
    studentProgresses.forEach(progress => {
      if (progress?.practiceId) {
        map[progress.practiceId] = {
          id: progress.id,
          practiceId: progress.practiceId,
          studentId: progress.studentId,
          status: progress.status,
          score: progress.score ?? null,
          createdAt: progress.createdAt,
          updatedAt: progress.updatedAt,
          completedAt: progress.completedAt
        };
      }
    });
    
    return map;
  }, [studentProgresses]);

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
          
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <TrophyOutlined className="text-2xl text-yellow-500" />
              <Typography.Title level={4} className="mb-0">Tiến độ hoàn thành</Typography.Title>
            </div>
            <div className="relative w-full mt-2" style={{ height: 56 }}>
              {/* Thanh tiến độ */}
              <Progress
                percent={completionRate ?? 0}
                status="active"
                format={() => ''}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                trailColor="#f5f5f5"
                strokeWidth={10}
                className="w-full"
              />
              {/* Các mốc milestone */}
              <div className="absolute left-0 top-7 w-full flex justify-between px-1">
                {[0, 25, 50, 75, 100].map((milestone) => (
                  <div key={milestone} className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${((completionRate ?? 0) >= milestone) ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-500 mt-1">{milestone}%</span>
                  </div>
                ))}
              </div>
              {/* Icon người chạy + số phần trăm */}
              <div
                style={{
                  position: 'absolute',
                  top: -28,
                  left: `calc(${Math.min(100, Math.max(0, completionRate ?? 0))}% - 18px)`,
                  transition: 'left 1s cubic-bezier(0.22, 1, 0.36, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 36
                }}
              >
                <span className="text-xs font-bold text-blue-700 mb-1 bg-white px-2 py-0.5 rounded shadow">{completionRate ?? 0}%</span>
                <UserOutlined className="text-2xl text-blue-500 drop-shadow" />
              </div>
            </div>
          </div>
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
              <PracticeCard 
                key={practice.id} 
                practice={practice}
                practiceProgress={practiceProgressMap[practice.id]}
              />
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