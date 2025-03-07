import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReportContent } from '../../types/report';
import ReportImage from './ReportImage';

interface Props {
  practiceContents: ReportContent[];
}

export const ReportHistoryDetail: React.FC<Props> = ({
  practiceContents,
}) => {

  const columns: ColumnsType<ReportContent> = [
    { 
      title: 'STT', 
      width: '5%',
      className: 'text-center',
      render: (_, __, index) => index + 1
    },
    { 
      title: 'Nội dung thực hành', 
      dataIndex: 'content', 
      width: '30%',
      className: 'font-medium',
      render: (text) => (
        <div className="whitespace-pre-wrap">{text}</div>
      )
    },
    { 
      title: 'Người thực hiện', 
      dataIndex: 'performer', 
      width: '20%',
      className: 'font-medium',
      render: (text) => (
        <div className="whitespace-pre-wrap">{text}</div>
      )
    },
    {
      title: 'Ảnh minh họa',
      dataIndex: 'imageUrl',
      width: '20%',
      render: (imageUrl) => <ReportImage imageUrl={imageUrl} />
    },
    {
        title: 'Đánh giá',
        dataIndex: 'evaluation',
        width: '15%',
        render: (value) => (
            <div className="text-center font-medium">
            {value !== undefined && value !== null ? value.toFixed(1) : '-'}
            </div>
        )
        },
  ];

  return (
    <Table
      columns={columns}
      dataSource={practiceContents}
      pagination={false}
      className="mb-4"
      rowKey="id"
      bordered
      scroll={{ x: true }}
    />
  );
};