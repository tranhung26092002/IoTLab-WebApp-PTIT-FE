import React from 'react';
import { Card, Form, Input, Select, Upload, InputNumber, Button, Collapse, Space, Tag, Badge } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { SubTask } from '../../types/report';

const { Panel } = Collapse;
const { TextArea } = Input;

interface TaskListProps {
  tasks: SubTask[];
  students: string[];
  onTasksChange: (tasks: SubTask[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, students, onTasksChange }) => {
  const handleAddTask = () => {
    onTasksChange([
      ...tasks,
      {
        id: tasks.length + 1,
        title: '',
        responsible: '',
        notes: '',
        images: [],
        status: 'pending',
        score: undefined
      }
    ]);
  };

  const handleTaskChange = (index: number, field: keyof SubTask, value: any) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, [field]: value };
      }
      return task;
    });
    onTasksChange(updatedTasks);
  };

  const handleRemoveTask = (index: number) => {
    onTasksChange(tasks.filter((_, i) => i !== index));
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-[var(--text-primary)]">
              Lab Tasks
            </span>
            <Tag className="ml-2" color="blue">
              {tasks.length} Tasks
            </Tag>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </div>
      }
      className="shadow-md bg-[var(--card-bg)]"
    >
      <Collapse
        className="bg-[var(--bg-secondary)]"
        expandIconPosition="start"
      >
        {tasks.map((task, index) => (
          <Panel
            key={task.id}
            header={
              <Space>
                <span>{task.title || `Task ${index + 1}`}</span>
                <Badge
                  status={task.status === 'completed' ? 'success' : 'processing'}
                  text={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                />
              </Space>
            }
            extra={
              <Space>
                {task.score !== undefined && (
                  <Tag color={task.score >= 5 ? 'success' : 'error'}>
                    Score: {task.score}/10
                  </Tag>
                )}
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTask(index);
                  }}
                  danger
                />
              </Space>
            }
          >
            <Form layout="vertical" className="space-y-4">
              <Form.Item label="Task Title" required>
                <Input
                  value={task.title}
                  onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                  placeholder="Enter task title"
                />
              </Form.Item>

              <Form.Item label="Responsible Student" required>
                <Select
                  value={task.responsible}
                  onChange={(value) => handleTaskChange(index, 'responsible', value)}
                  placeholder="Select student"
                >
                  {students.map((student) => (
                    <Select.Option key={student} value={student}>
                      {student}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Notes">
                <TextArea
                  value={task.notes}
                  onChange={(e) => handleTaskChange(index, 'notes', e.target.value)}
                  placeholder="Add task notes"
                  rows={4}
                />
              </Form.Item>

              <Form.Item label="Score">
                <InputNumber
                  value={task.score}
                  onChange={(value) => handleTaskChange(index, 'score', value)}
                  min={0}
                  max={10}
                  placeholder="Enter score"
                  className="w-32"
                />
              </Form.Item>

              <Form.Item label="Images">
                <Upload
                  listType="picture-card"
                  fileList={task.images.map((url, i) => ({
                    uid: `-${i}`,
                    name: `image-${i}`,
                    status: 'done',
                    url
                  }))}
                  onChange={({ fileList }) =>
                    handleTaskChange(
                      index,
                      'images',
                      fileList.map((file) => file.url || '')
                    )
                  }
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item label="Status">
              <Select
                value={task.status}
                onChange={(value) => handleTaskChange(index, 'status', value)}
              >
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
              </Select>
            </Form.Item>
            </Form>
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
};

export default TaskList;