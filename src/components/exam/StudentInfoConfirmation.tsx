import React from 'react';
import { Card, Typography, Button, Space, Descriptions, Tag, Avatar } from 'antd';
import { UserOutlined, IdcardOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { User } from '../../types/user';
import { useAvatar } from '../../hooks/useAvatar';

const { Title, Text } = Typography;

interface StudentInfoConfirmationProps {
    student: User;
    onConfirm: () => void;
}

const StudentInfoConfirmation: React.FC<StudentInfoConfirmationProps> = ({
    student,
    onConfirm,
}) => {
    const { imageUrl, isLoading } = useAvatar(student.avatarUrl);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
        >
            <Card className="shadow-lg">
                <div className="text-center mb-8">
                    <Avatar 
                        size={80} 
                        src={imageUrl}
                        icon={<UserOutlined />} 
                        className="bg-primary--color mb-4"
                    />
                    <Title level={2} className="mb-2">Xác nhận thông tin</Title>
                    <Text type="secondary">
                        Vui lòng kiểm tra lại thông tin cá nhân của bạn trước khi tiếp tục
                    </Text>
                </div>

                <Descriptions bordered column={1} className="mb-8">
                    <Descriptions.Item label={<Space><UserOutlined /> Họ và tên</Space>}>
                        {student.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><IdcardOutlined /> Mã sinh viên</Space>}>
                        {student.userName}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                        {student.email}
                    </Descriptions.Item>
                </Descriptions>

                <div className="text-center">
                    <Button
                        type="primary"
                        size="large"
                        onClick={onConfirm}
                        icon={<CheckCircleOutlined />}
                        className="min-w-[200px]"
                    >
                        Xác nhận và tiếp tục
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
};

export default StudentInfoConfirmation; 