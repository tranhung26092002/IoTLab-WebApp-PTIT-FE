export interface StudentInfo {
  name: string;
  userId: number;
  studentCode: string;
}

export interface ReportContent {
  id: number;
  content: string;
  performer: string;
  imageUrl: string;
  evaluation: number;
  userId: number;
}

export interface ReportData {
  id?: number;
  practiceId: number;
  title: string;
  students: StudentInfo[];
  classGroup: string;
  className: string;
  instructor: Instructor;
  shift: string;
  reportContents: ReportContent[];
  discussion: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}

export interface Instructor {
  userId: number;
  name: string;
}

export interface Student {
  userId: number;
  name: string;
  studentCode: string;
}

export interface ReportFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  shift?: string;
  className?: string;
  classGroup?: string;
}