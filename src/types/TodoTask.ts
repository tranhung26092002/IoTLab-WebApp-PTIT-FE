export interface TodoTask {
    id: string;
    title: string;
    description: string;
    assignee: string;
    startDate: string;
    endDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'completed';
    tags: string[];
}
