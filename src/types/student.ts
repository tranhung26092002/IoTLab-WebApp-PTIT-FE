import { BaseEntity } from './baseEntity';
import { StudentProgress } from './studentProgress';

export interface Student extends BaseEntity {
    userId: number;
    name: string;
    studentCode: string;
    studentProgresses?: StudentProgress[];
} 