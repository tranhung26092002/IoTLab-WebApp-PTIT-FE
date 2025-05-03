import { BaseEntity } from './baseEntity';

export enum PracticeProgressStatus {
    LOCKED = 'LOCKED',
    UNLOCKED = 'UNLOCKED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export interface StudentProgress extends BaseEntity {
    id: number;
    studentId: number;
    practiceId: number;
    status: PracticeProgressStatus;
    score?: number;
    comment?: string;
    startedAt?: string;
    completedAt?: string;
}

export interface StudentProgressFilter {
    studentId?: number;
    practiceId?: number;
    status?: PracticeProgressStatus;
    
    page?: number;
    size?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
} 