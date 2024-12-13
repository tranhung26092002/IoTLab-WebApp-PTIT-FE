export enum PracticeStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
}

export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string;
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
    status: PracticeStatus;
    practiceVideos?: PracticeVideo[];
    practiceFiles?: PracticeFile[];
    practiceGuides?: PracticeGuide[];
}

export interface PageResponse<T> {
    data: T[];
    metadata: {
        page: number;
        size: number;
        total: number;
    };
}