import React, { useState } from "react";
import AppLayoutAdmin from "../components/AppLayoutAdmin";
import { motion } from "framer-motion";
import { Typography, Card, Tabs } from "antd";
import { BankOutlined, BookOutlined, DatabaseOutlined } from "@ant-design/icons";
import type { TabsProps } from 'antd';
import QuestionBankManager from '../components/exam/QuestionBankManager';
import ExamTemplateManager from '../components/exam/ExamTemplateManager';
import ExamList from '../components/exam/ExamList';
import { ExamProvider } from '../contexts/ExamContext.tsx';

const { Title } = Typography;

const ExamManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <BankOutlined />
          Ngân hàng câu hỏi
        </span>
      ),
      children: <QuestionBankManager />,
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <BookOutlined />
          Mẫu đề thi
        </span>
      ),
      children: <ExamTemplateManager />,
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <DatabaseOutlined />
          Đề thi đã tạo
        </span>
      ),
      children: <ExamList />,
    },
  ];

  return (
    <AppLayoutAdmin>
      <div className="p-6 min-h-screen bg-gradient-to-br from-[#d2e3c8] via-[#86a789] to-[#4f6f52]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg">
            <Title level={2} className="forest--dark--color mb-6 flex items-center gap-2">
              <BankOutlined /> Quản lý ngân hàng đề thi
            </Title>

            <ExamProvider>
              <Tabs 
                activeKey={activeTab} 
                items={items} 
                onChange={setActiveTab}
                className="custom-tabs"
              />
            </ExamProvider>
          </Card>
        </motion.div>

        <style>{`
          .custom-tabs .ant-tabs-tab {
            transition: all 0.3s ease;
          }
          .custom-tabs .ant-tabs-tab:hover {
            color: var(--text-primary);
          }
          .custom-tabs .ant-tabs-tab-active {
            background-color: var(--bg-secondary) !important;
            border-radius: 8px 8px 0 0;
          }
        `}</style>
      </div>
    </AppLayoutAdmin>
  );
};

export default ExamManager;