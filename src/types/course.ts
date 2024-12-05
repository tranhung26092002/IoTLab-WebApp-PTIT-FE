export interface CourseType {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor: string;
  enrolledStudents: number;
  tags: string[];
  lastUpdated: string;
}

export type SortType = 'rating' | 'price' | 'enrolledStudents';
