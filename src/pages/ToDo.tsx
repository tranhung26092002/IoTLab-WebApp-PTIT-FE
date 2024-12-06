import React, { useState } from 'react';
import { Card, Typography, Button, Table, Tag, Space, Tooltip, Popconfirm } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TagOutlined,
  OrderedListOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTodoTasks } from '../hooks/useTodoTasks';
import { TaskFilters } from '../components/todo/TaskFilters';
import { TaskModal } from '../components/todo/TaskModal';
import { sortTasks, getPriorityColor, getStatusColor } from '../utils/todoUtils';
import type { TodoTask } from '../types/TodoTask';
import AppLayout from '../components/AppLayout';

const { Title, Text } = Typography;

const ToDo: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleStatus } = useTodoTasks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [sortBy, setSortBy] = useState('');

  const handleAddTask = (values: Partial<TodoTask>) => {
    console.log('Adding task:', values); // Debug log
    addTask(values as Omit<TodoTask, 'id'>);
    setIsModalVisible(false);
  };

  const handleUpdateTask = (values: Partial<TodoTask>) => {
    if (editingTask?.id) {
      console.log('Updating task:', editingTask.id, values); // Debug log
      updateTask(editingTask.id, values);
      setIsModalVisible(false);
      setEditingTask(null);
    }
  };

  const columns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: TodoTask) => (
        <Space direction="vertical" size={0}>
          <Text strong className="text-[#4f6f52]">{text}</Text>
          <Text type="secondary" className="text-sm">{record.description}</Text>
        </Space>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (text: string) => (
        <Tag icon={<UserOutlined />} color="#86a789">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (_: undefined, record: TodoTask) => (
        <Space>
          <ClockCircleOutlined className="text-[#86a789]" />
          <Text>{record.startDate} - {record.endDate}</Text>
        </Space>
      ),
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <Space>
          {tags.map(tag => (
            <Tag key={tag} icon={<TagOutlined />} color="#d2e3c8">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: undefined, record: TodoTask) => (
        <Space>
          <Tooltip title="Toggle Status">
            <Button
              type="text"
              icon={<CheckOutlined className={
                record.status === 'completed' ? 'text-[#4f6f52]' : 'text-[#86a789]'
              } />}
              onClick={() => toggleStatus(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-[#86a789] hover:text-[#4f6f52]" />}
              onClick={() => {
                setEditingTask(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => deleteTask(record.id)}
              okButtonProps={{ className: 'bg-[#4f6f52]' }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredTasks = tasks
    .filter(task => !filters.status || task.status === filters.status)
    .filter(task => !filters.priority || task.priority === filters.priority);

  const sortedTasks = sortTasks(filteredTasks, sortBy);

  return (
    <AppLayout>
      <motion.div
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography.Title level={2} className="forest--dark--color m-0 flex items-center gap-2">
            <OrderedListOutlined /> IoT Dashboard
          </Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTask(null);
              setIsModalVisible(true);
            }}
            className="h-10 bg-[#4f6f52] hover:bg-[#739072]"
          >
            Add Task
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TaskFilters
            onStatusFilter={(status) => setFilters({ ...filters, status })}
            onPriorityFilter={(priority) => setFilters({ ...filters, priority })}
            onSort={setSortBy}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <Table
              columns={columns}
              dataSource={sortedTasks}
              pagination={{
                pageSize: 8,
                className: 'text-[#4f6f52]'
              }}
              className="fade-enter"
              rowClassName={(record) =>
                record.status === 'completed' ? 'opacity-60' : ''
              }
            />
          </Card>
        </motion.div>

        <TaskModal
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingTask(null);
          }}
          onSubmit={(values) => {
            if (editingTask) {
              handleUpdateTask(values);
            } else {
              handleAddTask(values);
            }
          }}
          initialValues={editingTask || undefined}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        />
      </motion.div>
    </AppLayout>
  );
};

export default ToDo;