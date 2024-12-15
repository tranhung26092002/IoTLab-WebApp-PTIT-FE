import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Input, Row, Select, Space, Statistic, message } from 'antd';
import { TaskHeader } from '../components/task/TaskHeader';
import { TaskList } from '../components/task/TaskList';
import { TaskForm } from '../components/task//TaskForm';
import { Task } from '../types/task';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayoutAdmin from '../components/AppLayoutAdmin';

const { Search } = Input;

const TaskAdminPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Enhanced filtering and sorting
  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(task =>
      task.title.toLowerCase().includes(searchText.toLowerCase()) &&
      (filterStatus === 'all' || task.status === filterStatus) &&
      (filterPriority === 'all' || task.priority === filterPriority) &&
      (filterType === 'all' || task.type === filterType)
    );

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'priority':
          return b.priority.localeCompare(a.priority);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [tasks, searchText, filterStatus, filterPriority, filterType, sortBy]);

  // Task statistics
  const statistics = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    approved: tasks.filter(t => t.status === 'approved').length,
  }), [tasks]);

  // Batch operations
  const handleBatchApprove = () => {
    setTasks(tasks.map(task =>
      selectedTasks.includes(task.id) ? { ...task, status: 'approved' } : task
    ));
    setSelectedTasks([]);
    message.success('Selected tasks approved');
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchText.toLowerCase()) &&
    (filterStatus === 'all' || task.status === filterStatus)
  );

  const handleCreateTask = (values: Partial<Task>) => {
    const newTask: Task = {
      id: uuidv4(),
      title: values.title || '',
      description: values.description || '',
      assignee: values.assignee || '',
      status: 'pending',
      priority: values.priority || 'low',
      type: values.type || 'assignment',
      ...values,
      startDate: values.dates?.[0] || values.startDate || '',
      endDate: values.dates?.[1] || values.endDate || '',
    };
    setTasks([...tasks, newTask]);
    setIsModalVisible(false);
    message.success('Task created successfully');
  };

  const handleEditTask = (values: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === editingTask?.id ? { ...task, ...values } : task
    );
    setTasks(updatedTasks);
    setEditingTask(undefined);
    setIsModalVisible(false);
    message.success('Task updated successfully');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    message.success('Task deleted successfully');
  };

  const handleApproveTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, status: 'approved' } : task
    );
    setTasks(updatedTasks);
    message.success('Task approved successfully');
  };

  return (
    <AppLayoutAdmin>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-8 bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52] py-10"
      >
        <TaskHeader onCreateClick={() => setIsModalVisible(true)} />

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <Card>
                <Statistic title="Total Tasks" value={statistics.total} />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
              <Card>
                <Statistic title="Pending" value={statistics.pending} className="text-warning" />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
              <Card>
                <Statistic title="Completed" value={statistics.completed} className="text-success" />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
              <Card>
                <Statistic title="Approved" value={statistics.approved} className="text-primary" />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Enhanced Filters */}
        <motion.div className="mb-6 flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search tasks..."
            onChange={e => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />
          <Space wrap>
            <Select
              placeholder="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 120 }}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
            <Select
              placeholder="Priority"
              value={filterPriority}
              onChange={setFilterPriority}
              style={{ width: 120 }}
            >
              <Select.Option value="all">All Priority</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
            <Select
              placeholder="Sort by"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 120 }}
            >
              <Select.Option value="date">Date</Select.Option>
              <Select.Option value="priority">Priority</Select.Option>
              <Select.Option value="title">Title</Select.Option>
            </Select>
          </Space>
          {selectedTasks.length > 0 && (
            <Button type="primary" onClick={handleBatchApprove}>
              Approve Selected ({selectedTasks.length})
            </Button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filterStatus + searchText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TaskList
              tasks={filteredTasks}
              onEdit={task => {
                setEditingTask(task);
                setIsModalVisible(true);
              }}
              onDelete={handleDeleteTask}
              onApprove={handleApproveTask}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isModalVisible && (
            <TaskForm
              visible={isModalVisible}
              onCancel={() => {
                setIsModalVisible(false);
                setEditingTask(undefined);
              }}
              onSubmit={editingTask ? handleEditTask : handleCreateTask}
              initialValues={editingTask}
            />
          )}
        </AnimatePresence>

      </motion.div>
    </AppLayoutAdmin>
  );
};

export default TaskAdminPage;