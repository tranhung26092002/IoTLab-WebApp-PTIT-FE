// src/components/todo/TaskModal.tsx
import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { UserOutlined, TagOutlined } from '@ant-design/icons';
import { TodoTask } from '../../types/TodoTask';
import dayjs from 'dayjs';

interface TaskModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: Partial<TodoTask>) => void;
    initialValues?: Partial<TodoTask>;
    title?: string;
}

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export const TaskModal: React.FC<TaskModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    title = 'Create New Task'
}) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        try {
            console.log('Form values:', values); // Debug log

            // Validate required fields
            if (!values.timeline || !values.timeline[0] || !values.timeline[1]) {
                console.error('Timeline is required');
                return;
            }

            const formattedValues = {
                title: values.title,
                description: values.description,
                assignee: values.assignee,
                startDate: values.timeline[0].format('YYYY-MM-DD'),
                endDate: values.timeline[1].format('YYYY-MM-DD'),
                priority: values.priority,
                status: values.status || 'todo', // Default status
                tags: values.tags || [], // Default empty array for tags
            };

            console.log('Formatted values:', formattedValues); // Debug log

            onSubmit(formattedValues);
            form.resetFields();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <Modal
            title={<span className="text-lg primary--color">{title}</span>}
            open={visible}
            onCancel={onCancel}
            footer={null}
            className="rounded-lg"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues ? {
                    ...initialValues,
                    timeline: initialValues.startDate && initialValues.endDate ?
                        [dayjs(initialValues.startDate), dayjs(initialValues.endDate)] : undefined
                } : undefined}
                onFinish={handleSubmit}
                className="space-y-4"
            >
                <Form.Item
                    name="title"
                    label="Task Title"
                    rules={[{ required: true, message: 'Please enter task title' }]}
                >
                    <Input
                        placeholder="Enter task title"
                        className="h-10 hover:border-[#86a789] focus:border-[#4f6f52]"
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter task description' }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Enter task description"
                        className="hover:border-[#86a789] focus:border-[#4f6f52]"
                    />
                </Form.Item>

                <Form.Item
                    name="assignee"
                    label="Assignee"
                    rules={[{ required: true, message: 'Please select assignee' }]}
                >
                    <Select
                        placeholder="Select assignee"
                        className="h-10"
                        suffixIcon={<UserOutlined className="text-[#86a789]" />}
                    >
                        <Select.Option value="John Doe">John Doe</Select.Option>
                        <Select.Option value="Jane Smith">Jane Smith</Select.Option>
                        <Select.Option value="Bob Johnson">Bob Johnson</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="timeline"
                    label="Timeline"
                    rules={[{ required: true, message: 'Please select timeline' }]}
                >
                    <RangePicker
                        className="w-full h-10 hover:border-[#86a789] focus:border-[#4f6f52]"
                    />
                </Form.Item>

                <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[{ required: true, message: 'Please select priority' }]}
                >
                    <Select placeholder="Select priority" className="h-10">
                        <Select.Option value="high">High</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="low">Low</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status' }]}
                >
                    <Select placeholder="Select status" className="h-10">
                        <Select.Option value="todo">Todo</Select.Option>
                        <Select.Option value="in-progress">In Progress</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="tags"
                    label="Tags"
                >
                    <Select
                        mode="tags"
                        placeholder="Add tags"
                        className="h-10"
                        suffixIcon={<TagOutlined className="text-[#86a789]" />}
                    />
                </Form.Item>

                <Form.Item className="mb-0 pt-4">
                    <Space className="w-full justify-end">
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-[#4f6f52] hover:bg-[#739072]"
                        >
                            {initialValues ? 'Update' : 'Create'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};