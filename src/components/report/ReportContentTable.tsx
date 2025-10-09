import React from 'react';
import { Table, Input, Upload, Button, message, Popconfirm, Select } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd/es/upload/interface';
import { ReportContent } from '../../types/report';
import { ReportService } from '../../services/api/reportService';

interface Props {
  practiceContents: ReportContent[];
  students: { id: number; name: string; studentCode: string }[];
  onContentChange: (index: number, value: string) => void;
  onPerformerChange: (index: number, studentId: number, name: string) => void; 
  onImageUpload: (index: number, url: string) => void;
  onDelete: (index: number) => void;
}

export const ReportContentTable: React.FC<Props> = ({
  practiceContents,
  students,  
  onContentChange,
  onPerformerChange,
  onImageUpload,
  onDelete,
}) => {
  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const uploadFile = file as File;
      const url = await ReportService.uploadImage(uploadFile);
      console.log('Uploaded image:', url);
      onSuccess?.(url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
      onError?.(new Error('Upload failed'));
    }
  };

  const columns: ColumnsType<ReportContent> = [
    { 
      title: 'STT', 
      dataIndex: 'key',
      width: '5%',
      className: 'text-center',
      render: (_, __, index) => index + 1
    },
    { 
      title: 'Nội dung thực hành', 
      dataIndex: 'content', 
      width: '35%',
      render: (text, _, index) => (
        <Input.TextArea
          value={text}
          onChange={(e) => onContentChange(index, e.target.value)}
          placeholder="Nhập nội dung thực hành..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          className="w-full"
        />
      )
    },
    { 
      title: 'Người thực hiện', 
      dataIndex: 'performer', 
      width: '25%',
      render: ( _, record, index) => (
        <Select
          value={record.userId || undefined}
          onChange={(value) => {
            const student = students.find(s => s.id === value);
            if (student) {
              onPerformerChange(index, student.id, student.name);
            }
          }}
          placeholder="Chọn người thực hiện"
          className="w-full"
        >
          {students.map(student => (
            <Select.Option key={student.id} value={student.id}>
              {student.name}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Kết quả thực hành',
      dataIndex: 'image',
      width: '20%',
      render: (_, __, index) => (
        <Upload
          customRequest={handleUpload}
          onChange={({ file }) => {
            if (file.status === 'done') {
              onImageUpload(index, file.response);
            }
          }}
          accept="image/*"
          multiple={false}
          showUploadList={true}
          listType="picture"
        >
          <Button icon={<UploadOutlined />} className="w-full">
            Tải ảnh lên
          </Button>
        </Upload>
      )
    },
    {
      title: 'Xóa',
      key: 'action',
      width: '5%',
      render: (_, __, index) => (
        <Popconfirm
          title="Xóa nội dung thực hành"
          description="Bạn có chắc chắn muốn xóa nội dung này?"
          onConfirm={() => onDelete(index)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button 
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={practiceContents}
      pagination={false}
      className="mb-4"
      rowKey="key"
      bordered
      scroll={{ x: true }}
    />
  );
};

export default ReportContentTable;
