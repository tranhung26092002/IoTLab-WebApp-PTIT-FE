import { List, Tag, Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Task } from '../../types/task';

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

export const TaskList: React.FC<{
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onApprove: (id: string) => void;
}> = ({ tasks, onEdit, onDelete, onApprove }) => (
    <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
    >
        <List
            className="animate-fade-in"
            itemLayout="horizontal"
            dataSource={tasks}
            renderItem={(task) => (
                <motion.div
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow"
                >
                    <List.Item
                        className="bg-white rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow"
                        actions={[
                            <Tooltip title="Edit">
                                <Button icon={<EditOutlined />} onClick={() => onEdit(task)} />
                            </Tooltip>,
                            <Tooltip title="Delete">
                                <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(task.id)} />
                            </Tooltip>,
                            <Tooltip title="Approve">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={() => onApprove(task.id)}
                                    className="bg-success"
                                />
                            </Tooltip>
                        ]}
                    >
                        <List.Item.Meta
                            title={<span className="text-lg font-semibold">{task.title}</span>}
                            description={
                                <Space direction="vertical">
                                    <p className="text-gray-600">{task.description}</p>
                                    <Space>
                                        <Tag color="blue">{task.type}</Tag>
                                        <Tag color={
                                            task.priority === 'high' ? 'red' :
                                                task.priority === 'medium' ? 'orange' : 'green'
                                        }>
                                            {task.priority}
                                        </Tag>
                                        <Tag color={
                                            task.status === 'approved' ? 'green' :
                                                task.status === 'rejected' ? 'red' : 'gold'
                                        }>
                                            {task.status}
                                        </Tag>
                                    </Space>
                                    <span className="text-gray-500">
                                        {`${task.startDate} - ${task.endDate}`}
                                    </span>
                                    <span className="text-gray-500">
                                        Assignee: {task.assignee}
                                    </span>
                                </Space>
                            }
                        />
                    </List.Item>
                </motion.div>
            )}
        />
    </motion.div>
);