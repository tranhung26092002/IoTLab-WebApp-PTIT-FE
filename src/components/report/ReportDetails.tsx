import React from 'react';
import { Form, Input, Select, Card, Space, Tag, Divider } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const supervisors = [
  "Dr. Nguyen Van A",
  "Dr. Tran Thi B",
  "Dr. Le Van C"
];

const shifts = [
  { id: 1, name: "Morning Shift", time: "7:30 - 11:30" },
  { id: 2, name: "Afternoon Shift", time: "13:30 - 17:30" },
  { id: 3, name: "Evening Shift", time: "18:00 - 22:00" }
];

const ReportDetails: React.FC<{ form: any }> = ({ form }) => {
  const currentDate = dayjs().format('DD/MM/YYYY');
  const currentTime = dayjs().format('HH:mm:ss');

  return (
    <Card 
      title="Report Details" 
      className="shadow-md bg-[var(--card-bg)]"
    >
      <Form 
        form={form} 
        layout="vertical"
        requiredMark="optional"
        className="space-y-6"
      >
        <Form.Item
          name="title"
          label="Report Title"
          rules={[{ required: true, message: 'Please enter report title' }]}
        >
          <Input placeholder="Enter report title" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="supervisor"
            label="Supervisor"
            rules={[{ required: true, message: 'Please select a supervisor' }]}
          >
            <Select placeholder="Select supervisor">
              {supervisors.map(supervisor => (
                <Option key={supervisor} value={supervisor}>
                  <Space>
                    <TeamOutlined />
                    {supervisor}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="shift"
            label="Lab Shift"
            rules={[{ required: true, message: 'Please select a shift' }]}
          >
            <Select placeholder="Select shift">
              {shifts.map(shift => (
                <Option key={shift.id} value={shift.id}>
                  <Space>
                    <ClockCircleOutlined />
                    {shift.name} ({shift.time})
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Divider className="my-6" />

        <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-4 rounded-lg">
          <Space direction="vertical">
            <div className="text-sm text-[var(--text-secondary)]">Submission Date & Time</div>
            <Space size="large">
              <Tag color="green" className="px-3 py-1">
                <Space>
                  <CalendarOutlined />
                  {currentDate}
                </Space>
              </Tag>
              <Tag color="blue" className="px-3 py-1">
                <Space>
                  <ClockCircleOutlined />
                  {currentTime}
                </Space>
              </Tag>
            </Space>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default ReportDetails;