export interface Task {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    assignee: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    priority: 'low' | 'medium' | 'high';
    type: 'assignment' | 'project' | 'exam';
}
