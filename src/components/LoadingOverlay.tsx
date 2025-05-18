import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const LoadingOverlay: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 48,
                color: '#4F6F52'
              }}
              spin
            />
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg font-medium text-[#4F6F52]"
        >
          Đang tải...
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay; 