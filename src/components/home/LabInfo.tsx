import React from 'react';
import { Card, Typography, Timeline, Row, Col } from 'antd';
import { 
    ClockCircleOutlined, 
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    LaptopOutlined,
    ExperimentOutlined,
    TeamOutlined,
    ToolOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const LabInfo: React.FC = () => {
    const labHours = [
        { day: 'Thứ 2 - Thứ 6', hours: '8:00 - 20:00' },
        { day: 'Thứ 7', hours: '9:00 - 17:00' },
        { day: 'Chủ nhật', hours: 'Đóng cửa' }
    ];

    const locations = [
        { building: 'Trung tâm nghiên cứu', room: 'IoT LAB', floor: 'Tầng 8 - A2' }
    ];

    const facilities = [
        { icon: <LaptopOutlined />, name: 'Development Stations', count: 20 },
        { icon: <ExperimentOutlined />, name: 'Testing Areas', count: 4 },
        { icon: <TeamOutlined />, name: 'Meeting Rooms', count: 2 },
        { icon: <ToolOutlined />, name: 'Workshop Spaces', count: 3 }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card className="bg-white/90 backdrop-blur shadow-xl">
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Title level={2} className="text-[#4f6f52] !mb-2 font-bold">
                            Thông tin phòng nghiên cứu
                        </Title>
                        <Paragraph className="text-[#3a5a40] text-lg font-medium">
                            Cung cấp thông tin chi tiết về vị trí, giờ mở cửa và các tiện nghi của phòng
                            nghiên cứu IoT LAB.
                        </Paragraph>
                    </Col>

                    <Col span={12}>
                        <Card className="bg-[#f0f5f1] border-none h-full">
                            <Title level={4} className="text-[#4f6f52] !mb-6 flex items-center font-bold">
                                <EnvironmentOutlined className="mr-2 text-xl" />
                                Địa chỉ và Liên hệ
                            </Title>
                            {locations.map((location, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    className="mb-4 p-4 bg-white rounded-lg shadow-sm"
                                >
                                    <div className="font-bold text-[#4f6f52] text-lg">
                                        {location.building}
                                    </div>
                                    <div className="text-[#3a5a40] font-medium">
                                        {location.room} - {location.floor}
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div
                                whileHover={{ x: 5 }}
                                className="mb-4 p-4 bg-white rounded-lg shadow-sm"
                            >
                                <div className="mt-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <MailOutlined className="text-[#4f6f52]" />
                                        <span className="font-medium">openlab.user@gmail.com
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <PhoneOutlined className="text-[#4f6f52]" />
                                        <span className="font-medium">(+84) 123-456-789</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card className="bg-[#f0f5f1] border-none h-full">
                            <Title level={4} className="text-[#4f6f52] !mb-6 flex items-center font-bold">
                                <ClockCircleOutlined className="mr-2 text-xl" />
                                Giờ mở cửa
                            </Title>
                            <Timeline
                                items={labHours.map((schedule) => ({
                                    dot: <ClockCircleOutlined className="text-[#4f6f52]" />,
                                    children: (
                                        <div className="bg-white p-3 rounded-lg shadow-sm">
                                            <div className="font-bold text-[#4f6f52]">{schedule.day}</div>
                                            <div className="text-[#3a5a40] font-medium">{schedule.hours}</div>
                                        </div>
                                    ),
                                }))}
                            />
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card className="bg-[#f0f5f1] border-none">
                            <Title level={4} className="text-[#4f6f52] !mb-6 font-bold">
                                Các tiện nghi khác
                            </Title>
                            <Row gutter={[16, 16]}>
                                {facilities.map((facility, index) => (
                                    <Col span={6} key={index}>
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-4 rounded-lg shadow-sm text-center"
                                        >
                                            <div className="text-3xl text-[#4f6f52] mb-2">
                                                {facility.icon}
                                            </div>
                                            <div className="font-bold text-[#3a5a40]">
                                                {facility.name}
                                            </div>
                                            <div className="text-[#4f6f52] font-medium">
                                                Số lượng {facility.count}
                                            </div>
                                        </motion.div>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                </Row>
                
            </Card>
        </motion.div>
    );
};

export default LabInfo;