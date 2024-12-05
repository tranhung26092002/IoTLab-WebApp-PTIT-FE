import { CourseType, SortType } from '../types/course';

export const filterCourses = (
    courses: CourseType[],
    searchTerm: string,
    category: string
): CourseType[] => {
    return courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === 'all' || course.category.toLowerCase() === category)
    );
};

export const sortCourses = (courses: CourseType[], sortBy: SortType) => {
    return [...courses].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'price':
                return a.price - b.price;
            case 'enrolledStudents':
                return b.enrolledStudents - a.enrolledStudents;
            default:
                return 0;
        }
    });
};