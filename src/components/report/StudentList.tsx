import React from 'react';
import { Button, Input, Card, Avatar, Tooltip } from 'antd';
import { UserOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface StudentListProps {
  students: string[];
  onAddStudent: () => void;
  onRemoveStudent: (index: number) => void;
  onUpdateStudent: (index: number, value: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onAddStudent, 
  onRemoveStudent, 
  onUpdateStudent 
}) => {
  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-[var(--text-primary)]">
            Team Members
          </span>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAddStudent}
            className="ml-4"
          >
            Add Member
          </Button>
        </div>
      }
      className="shadow-md bg-[var(--card-bg)]"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {students.map((student, index) => (
            <Avatar key={index} icon={<UserOutlined />} className="bg-[var(--text-primary)]" />
          ))}
        </div>
        {students.map((student, index) => (
          <div key={index} className="flex items-center gap-3">
            <Avatar icon={<UserOutlined />} className="bg-[var(--text-primary)]" />
            <Input
              value={student}
              onChange={(e) => onUpdateStudent(index, e.target.value)}
              placeholder="Enter student name"
              className="flex-1"
            />
            <Tooltip title="Remove student">
              <Button 
                icon={<DeleteOutlined />}
                onClick={() => onRemoveStudent(index)}
                danger
                className="hover:scale-105 transition-transform"
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StudentList;