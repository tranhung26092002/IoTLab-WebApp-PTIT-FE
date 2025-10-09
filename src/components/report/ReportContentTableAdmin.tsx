import React, { useState } from 'react';
import { Table, Button, InputNumber, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ReportContent } from '../../types/report';
import ReportImage from './ReportImage';

interface Props {
  practiceContents: ReportContent[];
  onEvaluationChange: (contentId: number, evaluation: number) => Promise<void>;
  isUpdating?: boolean;
}

export const ReportContentTableAdmin: React.FC<Props> = ({
  practiceContents,
  onEvaluationChange,
  isUpdating = false,
}) => {
  // Track evaluation changes before saving
  const [evaluations, setEvaluations] = useState<{ [key: number]: number | null }>({});
  const [savingEvaluation, setSavingEvaluation] = useState<{ [key: number]: boolean }>({});

  const handleEvaluationChange = (contentId: number, value: number | null) => {
    // Update only the specific content's evaluation
    setEvaluations(prev => ({
      ...prev,
      [contentId]: value
    }));
  };

  const handleEvaluationSave = async (contentId: number) => {
    const evaluation = evaluations[contentId];
    if (evaluation === null || evaluation === undefined) return;
    
    setSavingEvaluation(prev => ({ ...prev, [contentId]: true }));
    try {
      await onEvaluationChange(contentId, evaluation);
      
      // Clear only this content's evaluation after saving
      setEvaluations(prev => {
        const copy = { ...prev };
        delete copy[contentId];
        return copy;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
    } finally {
      setSavingEvaluation(prev => ({ ...prev, [contentId]: false }));
    }
  };

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
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      width: '20%',
      render: (imageUrl) => <ReportImage imageUrl={imageUrl} />
    },
    {
      title: 'Đánh giá',
      dataIndex: 'evaluation',
      width: '15%',
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <InputNumber
            min={0}
            max={10}
            value={evaluations[record.id] !== undefined ? evaluations[record.id] : value}
            onChange={(newValue) => handleEvaluationChange(record.id, newValue)}
            className="w-20"
            placeholder="0-10"
            controls={true}
            precision={1}
            step={0.5}
            disabled={isUpdating || savingEvaluation[record.id]}
          />
          {evaluations[record.id] !== undefined && (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              size="small"
              onClick={() => handleEvaluationSave(record.id)}
              loading={savingEvaluation[record.id]}
            />
          )}
        </div>
      )
    }
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
