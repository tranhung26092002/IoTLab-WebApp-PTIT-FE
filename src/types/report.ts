export interface LabReport {
    id: number;
    title: string;
    image: string;
    description: string;
    status?: 'draft' | 'submitted';
    dueDate?: string;
  }
  
  export interface SubTask {
    id: number;
    title: string;
    responsible: string;
    notes: string;
    images: string[];
    score?: number;
    status: 'pending' | 'completed';
  }