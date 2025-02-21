import React, { useState } from 'react';
import { Card, Button, Form, message, Row, Col, Steps, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, CheckOutlined } from '@ant-design/icons';
import AppLayout from "../components/AppLayout";
import StudentList from '../components/report/StudentList';
import ReportDetails from '../components/report/ReportDetails';
import LabReportCard from '../components/report/LabReportCard';
import TaskList from '../components/report/TaskList';
import { SubTask, LabReport } from '../types/report';

const labReports: LabReport[] = [
    {
      id: 1,
      title: 'Lab 1: Introduction to IoT',
      image: '/images/lab1.jpg',
      description: 'Basic concepts and architecture of IoT systems',
      dueDate: '2025-03-01',
      status: 'draft'
    },
    {
      id: 2,
      title: 'Lab 2: Sensors and Actuators',
      image: '/images/lab2.jpg',
      description: 'Working with various IoT sensors and actuators',
      dueDate: '2025-03-15',
      status: 'submitted'
    },
    {
      id: 3,
      title: 'Lab 3: Network Protocols',
      image: '/images/lab3.jpg',
      description: 'Understanding IoT communication protocols',
      dueDate: '2025-03-30',
      status: 'draft'
    },
    // Add more labs...
  ];

const Report: React.FC = () => {
    const [form] = Form.useForm();
    const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
    const [students, setStudents] = useState<string[]>(['']);
    const [currentStep, setCurrentStep] = useState(0);  

    const handleAddStudent = () => {
        setStudents([...students, '']);
    };

    const handleRemoveStudent = (index: number) => {
        const newStudents = students.filter((_, i) => i !== index);
        setStudents(newStudents);
    };

    const handleUpdateStudent = (index: number, value: string) => {
        const newStudents = [...students];
        newStudents[index] = value;
        setStudents(newStudents);
    };

    const handleSubmit = () => {
        message.success('Report submitted successfully!');
    };

    const [subTasks, setSubTasks] = useState<SubTask[]>([]);

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StudentList 
            students={students}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        );
      case 1:
        return <ReportDetails form={form} />;
      case 2:
        return (
          <TaskList 
            tasks={subTasks}
            students={students}
            onTasksChange={setSubTasks}
          />
        );
      default:
        return null;
    }
  };

    return (
        <AppLayout>
          <div className="max-w-7xl mx-auto py-8 px-4">
            {!selectedReport ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                    Lab Reports
                  </h1>
                  <div className="flex gap-4">
                    {/* Add filters or additional controls here */}
                  </div>
                </div>
                
                <Row gutter={[24, 24]}>
                  {labReports.map(report => (
                    <Col key={report.id} xs={24} sm={12} lg={8}>
                      <LabReportCard 
                        report={report}
                        onClick={() => setSelectedReport(report)}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
) : (
    <div className="space-y-8">
      <Card className="shadow-lg bg-[var(--card-bg)]">
        <div className="flex items-center justify-between mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => setSelectedReport(null)}
          >
            Back to Reports
          </Button>
          <Steps
            current={currentStep}
            items={[
              { title: 'Team', description: 'Add members' },
              { title: 'Details', description: 'Report info' },
              { title: 'Tasks', description: 'Add tasks' },
            ]}
            className="max-w-2xl mx-auto"
          />
        </div>

        <div className="space-y-8">
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Space>
              <Button
                onClick={() => message.success('Draft saved!')}
                icon={<SaveOutlined />}
              >
                Save Draft
              </Button>
              {currentStep < 2 ? (
                <Button type="primary" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleSubmit}
                >
                  Submit Report
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Card>
    </div>
  )}
</div>
</AppLayout>
);
};
    
    export default Report;