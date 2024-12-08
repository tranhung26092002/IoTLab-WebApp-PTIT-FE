export interface Comment {
    id: string;
    content: string;
    userId: string;
    entityId: string;
    entityType: 'blog' | 'product';
    createdAt: string;
}
