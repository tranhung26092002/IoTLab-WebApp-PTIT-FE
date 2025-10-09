import React from 'react';
import { Form, Input, DatePicker, Select, Button, Space, Card } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { ReportFilters, ReportStatus, ShiftType } from '../../types/report';

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
      title: values.title?.trim(),
      status: values.status,
      shift: values.shift,
      className: values.className?.trim(),
      classGroup: values.classGroup?.trim(),
      sortField: values.sortField,
      sortOrder: values.sortOrder
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
    <Card className="mb-6 shadow-sm">
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
        layout="vertical"
        className="gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Form.Item name="title" className="mb-2">
            <Input.Search
              placeholder="Tìm kiếm theo tên..."
              allowClear
              onSearch={() => form.submit()}
              className="w-full"
            />
          </Form.Item>

          <Form.Item name="status" className="mb-2">
            <Select
              placeholder="Trạng thái"
              allowClear
              className="w-full"
              options={Object.values(ReportStatus).map(status => ({
                value: status,
                label: status === 'DRAFT' ? 'Bản nháp' :
                       status === 'SUBMITTED' ? 'Đã nộp' :
                       status === 'PENDING' ? 'Chờ duyệt' :
                       status === 'APPROVED' ? 'Đã duyệt' :
                       'Từ chối'
              }))}
            />
          </Form.Item>

          <Form.Item name="shift" className="mb-2">
            <Select
              placeholder="Ca thực hành"
              allowClear
              className="w-full"
              options={Object.values(ShiftType).map(shift => ({
                value: shift,
                label: `Ca ${shift}`
              }))}
            />
          </Form.Item>

          <Form.Item name="dateRange" className="mb-2">
            <RangePicker 
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              className="w-full"
            />
          </Form.Item>

          <Form.Item name="className" className="mb-2">
            <Input placeholder="Nhập mã lớp..." allowClear className="w-full" />
          </Form.Item>

          <Form.Item name="classGroup" className="mb-2">
            <Input placeholder="Nhập nhóm..." allowClear className="w-full" />
          </Form.Item>
        </div>

        <Form.Item className="flex justify-end mb-0">
          <Space>
            <Button 
              onClick={handleReset}
              icon={<ReloadOutlined />}
              className="bg-gray-100 hover:bg-gray-200"
            >
              Đặt lại
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              icon={<FilterOutlined />}
              loading={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Áp dụng bộ lọc
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
