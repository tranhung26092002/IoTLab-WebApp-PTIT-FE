import React from 'react'
import AppLayoutAdmin from '../components/AppLayoutAdmin'
import { Content } from 'antd/es/layout/layout'
import { motion } from 'framer-motion'
import Title from 'antd/es/typography/Title'
import { Card, Space } from 'antd'

const Admin: React.FC = () => {
    return (
        <AppLayoutAdmin>
            <Content className="p-6 bg-gray-100">
                <Space direction="vertical" size="large" className="w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <Card className="hover:shadow-lg transition-shadow">
                            <Title level={5}>Total Users</Title>
                            <p className="text-2xl font-bold">1,234</p>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <Title level={5}>Active Tasks</Title>
                            <p className="text-2xl font-bold">56</p>
                        </Card>
                        <Card className="hover:shadow-lg transition-shadow">
                            <Title level={5}>Total Courses</Title>
                            <p className="text-2xl font-bold">89</p>
                        </Card>
                    </motion.div>
                </Space>
            </Content>
        </AppLayoutAdmin>
    )
}

export default Admin
