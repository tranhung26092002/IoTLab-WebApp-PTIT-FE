import { BaseEntity } from './baseEntity';

export enum PracticeStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
}

export interface PracticeVideo extends BaseEntity {
    practice?: Practice;
    videoName: string;
    videoUrl: string;
}

export interface PracticeFile extends BaseEntity {
    practice?: Practice;
    fileName: string;
    fileType: string;
    fileUrl: string;
}

export interface PracticeGuide extends BaseEntity {
    practice?: Practice;
    title: string;
    content: string;
}

export interface PracticeStudent extends BaseEntity {
    practice: Practice;
    userId: number;
    startTime: string;
    endTime?: string;
    status: PracticeStatus;
}

export interface Practice extends BaseEntity {
    title: string;
    description: string;
    imageUrl?: string;
    practiceOrder?: number;
    status: PracticeStatus;
    practiceVideos?: PracticeVideo[];
    practiceFiles?: PracticeFile[];
    practiceGuides?: PracticeGuide[];
}

export interface PracticeFilter {
    id?: number;
    title?: string;
    status?: PracticeStatus;

    page?: number;
    size?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PracticeProgress {
    id?: number;
    practiceId?: number;
    studentId?: number;
    status: 'UNLOCKED' | 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
    score: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    completedAt?: string | null;
}
