import { Button, Typography } from 'antd';
import { OrderedListOutlined, PlusOutlined } from '@ant-design/icons';

export const TaskHeader: React.FC<{ onCreateClick: () => void }> = ({ onCreateClick }) => (
    <div className="flex justify-between items-center mb-6 animate-fade-in">
        <Typography.Title level={2} className="forest--dark--color m-0 flex items-center gap-2">
            <OrderedListOutlined /> Tasks
        </Typography.Title>
        <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateClick}
            className="bg-primary hover:bg-primary-dark"
        >
            Create Task
        </Button>
    </div>
);