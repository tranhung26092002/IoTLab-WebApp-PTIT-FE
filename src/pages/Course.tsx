import React, { useState } from 'react';
import { Pagination, Spin } from 'antd';
import { CourseCard } from '../components/course/CourseCard';
import { CourseFilters } from '../components/course/CourseFilters';
import { coursesData } from '../data/coursesData';
import { filterCourses, sortCourses } from '../utils/courseUtils';
import { CourseType } from '../types/course';
import AppLayout from '../components/AppLayout';
import { SortType } from '../types/course';

const ITEMS_PER_PAGE = 6;

const Course: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseType[]>(coursesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedCourses = React.useMemo(() => {
    const filtered = filterCourses(courses, searchTerm, category);
    return sortCourses(filtered, sortBy);
  }, [courses, searchTerm, category, sortBy]);

  const paginatedCourses = filteredAndSortedCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSortChange = (value: SortType) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <CourseFilters
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategory}
          onSortChange={handleSortChange}
          selectedCategory={category}
          selectedSort={sortBy}
        />

        <div className="course-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <Spin size="large" className="col-span-full" />
          ) : (
            paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => console.log('Navigate to course', course.id)}
              />
            ))
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={filteredAndSortedCourses.length}
            pageSize={ITEMS_PER_PAGE}
            showTotal={(total) => `Total ${total} courses`}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Course;