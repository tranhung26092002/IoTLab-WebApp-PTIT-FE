import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const onFinish = (values: any) => {
    console.log('Received values:', values);
    // Chuyển hướng sang trang Login sau khi đăng ký thành công
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      <Form name="register" onFinish={onFinish} initialValues={{ remember: true }}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
