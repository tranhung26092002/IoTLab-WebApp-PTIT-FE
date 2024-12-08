import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import { motion } from 'framer-motion';
import { Task } from '../../types/task';

interface TaskFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: Partial<Task>) => void;
    initialValues?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    visible,
    onCancel,
    onSubmit,
    initialValues
}) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title={initialValues ? "Edit Task" : "Create New Task"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            modalRender={modal => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    {modal}
                </motion.div>
            )}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={onSubmit}
            >
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="assignee" label="Assignee" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="assignment">Assignment</Select.Option>
                        <Select.Option value="project">Project</Select.Option>
                        <Select.Option value="exam">Exam</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="low">Low</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="dates" label="Duration" rules={[{ required: true }]}>
                    <DatePicker.RangePicker />
                </Form.Item>
                <div className="flex justify-end gap-2">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        {initialValues ? "Update" : "Create"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};
