import React from 'react';
import { Form, Input, DatePicker, Select, Button, Space, Col, Row } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined,
  CalendarOutlined,
  TeamOutlined,
  TagOutlined
} from '@ant-design/icons';
import { ReportFilters } from '../../types/report';

const { RangePicker } = DatePicker;

interface FilterFormProps {
  onFilter: (filters: ReportFilters) => void;
  loading?: boolean;
  initialValues?: ReportFilters;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  onFilter,
  loading,
  initialValues
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const filters: ReportFilters = {
      search: values.search?.trim(),
      shift: values.shift,
      className: values.className?.trim(),
      classGroup: values.classGroup?.trim()
    };

    if (values.dateRange?.length === 2) {
      filters.startDate = values.dateRange[0].format('YYYY-MM-DD');
      filters.endDate = values.dateRange[1].format('YYYY-MM-DD');
    }

    onFilter(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      onFinish={handleFinish}
      initialValues={initialValues}
      className="bg-white px-4 py-3 rounded-lg shadow-sm"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Row gutter={[16, 8]} className="items-center">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item 
            name="search" 
            className="mb-2"
          >
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tên bài/sinh viên..."
              allowClear
              className="rounded-md"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item 
            name="dateRange"
            className="mb-2"
          >
            <RangePicker
              className="w-full rounded-md"
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              allowEmpty={[true, true]}
              size="middle"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Form.Item 
            name="shift"
            className="mb-2"
          >
            <Select 
                prefix={<CalendarOutlined className="text-gray-400" />}
              placeholder="Ca thực hành"
              className="w-full rounded-md"
              allowClear
              size="middle"
              options={[
                { value: 'Sáng', label: 'Ca 1' },
                { value: 'Chiều', label: 'Ca 2' },
                { value: 'Tối', label: 'Ca 3' }
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Form.Item 
            name="className"
            className="mb-2"
          >
            <Input 
              prefix={<TeamOutlined className="text-gray-400" />}
              placeholder="Lớp" 
              allowClear
              className="rounded-md"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4}>
          <Form.Item 
            name="classGroup"
            className="mb-2"
          >
            <Input 
              prefix={<TagOutlined className="text-gray-400" />}
              placeholder="Nhóm" 
              allowClear
              className="rounded-md"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={4} className="flex justify-end">
          <Form.Item className="mb-2">
            <Space>
              <Button
                icon={<ClearOutlined />}
                onClick={handleReset}
                disabled={loading}
                size="middle"
                className="min-w-[80px]"
              >
                Xóa
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<FilterOutlined />}
                loading={loading}
                size="middle"
                className="min-w-[80px]"
              >
                Lọc
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};