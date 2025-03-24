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

export enum ShiftType {
  Sáng= 'Sáng',
  Chiều= 'Chiều',
  Tối= 'Tối'
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ReportFilters {
  id?: number;
  title?: string;
  classGroup?: string;
  className?: string;
  shift?: ShiftType;
  status?: ReportStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}