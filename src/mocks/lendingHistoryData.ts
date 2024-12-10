// mocks/lendingHistoryData.ts
import { LendingHistoryRecord } from '../types/hardDevice';

export const lendingHistory: LendingHistoryRecord[] = [
    {
        id: 'lh-001',
        deviceId: 'hd-001',
        studentId: 'ST001',
        studentName: 'John Doe',
        borrowDate: '2024-03-01',
        status: 'active',
        notes: 'Project work'
    },
    {
        id: 'lh-002',
        deviceId: 'hd-002',
        studentId: 'ST002',
        studentName: 'Jane Smith',
        borrowDate: '2024-02-15',
        returnDate: '2024-03-01',
        status: 'returned',
        notes: 'Lab experiment'
    },
    {
        id: 'lh-003',
        deviceId: 'hd-003',
        studentId: 'ST003',
        studentName: 'Mike Johnson',
        borrowDate: '2024-03-05',
        status: 'active',
        notes: 'Research project'
    }
];