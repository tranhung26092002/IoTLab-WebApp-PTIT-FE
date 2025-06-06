import React, { useState, useRef } from 'react';
import { Card, Input, Button, Space, Typography, Form, Collapse, Select, List, Tag, message, Alert } from 'antd';
import { 
  CloudServerOutlined,
  SendOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  GlobalOutlined, 
  KeyOutlined, 
  UserOutlined, 
  LockOutlined,
  MessageOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  ApiOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useControlBroker } from '../../hooks/useControlBroker';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface BrokerControlCardProps {
  deviceId: string;
}

interface Message {
  topic: string;
  payload: string;
  time: string;
  type: 'sent' | 'received';
}

export const BrokerControlCard: React.FC<BrokerControlCardProps> = ({ deviceId }) => {
  const [brokerConfig, setBrokerConfig] = useState({
    address: '',
    port: '9001',
    username: '',
    password: '',
    protocol: 'ws' as 'ws' | 'wss',
    path: '/mqtt',
    clientId: '',
    keepalive: 60,
    reconnectPeriod: 1000,
    connectTimeout: 4000
  });

  const [publishTopic, setPublishTopic] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [publishQos, setPublishQos] = useState<0 | 1 | 2>(0);

  const [subscribeTopic, setSubscribeTopic] = useState('');
  const [subscribeQos, setSubscribeQos] = useState<0 | 1 | 2>(0);

  const [messages, setMessages] = useState<Message[]>([]);

  const [collapseActiveKey, setCollapseActiveKey] = useState<string | string[]>('1');

  const {
    connectionStatus,
    isConnected,
    subscribedTopics,
    lastError,
    publishMessage: publishToBroker,
    subscribeToTopic,
    unsubscribeFromTopic,
    connectBroker,
    disconnect
  } = useControlBroker({
    deviceId,
    onMessage: (topic, payload) => {
      setMessages(prev => [{
        topic,
        payload,
        time: new Date().toLocaleTimeString(),
        type: 'received' as const
      }, ...prev].slice(0, 3));
    },
    onConnect: () => {
      message.success('Connected to MQTT broker successfully');
      setCollapseActiveKey([]);
    },
    onDisconnect: () => {
      message.info('Disconnected from MQTT broker');
    },
    onError: (error) => {
      message.error(`MQTT Error: ${error.message}`);
    }
  });

  const handleConnect = () => {
    if (!brokerConfig.address.trim() || !brokerConfig.port.trim()) {
      message.error('Please enter broker address and port');
      return;
    }

    try {
      // Clean the address and remove any protocols/slashes
      let address = brokerConfig.address.trim();
      address = address.replace(/^(mqtt|ws|wss):\/\//, '');
      address = address.replace(/\/$/, '');
      
      // Clean port
      let port = brokerConfig.port.trim();
      // Update config with broker settings
      const config = {
        ...brokerConfig,
        address,
        port,
        clientId: brokerConfig.clientId || `mqtt-client-${Math.random().toString(16).substring(2, 10)}`,
      };

      console.log('Connecting to broker:', config);
      connectBroker(config);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      message.error(`Connection failed: ${errorMessage}`);
      console.error('Connection error:', error);
    }
  };

  const handlePublish = () => {
    const topic = publishTopic.trim();
    const msg = publishMessage;
    if (!topic || !msg) {
      message.error('Please enter topic and message');
      return;
    }

    publishToBroker(topic, msg, publishQos);
    setMessages(prev => [{
      topic,
      payload: msg,
      time: new Date().toLocaleTimeString(),
      type: 'sent' as const
    }, ...prev].slice(0, 3));
  };

  const handleSubscribe = () => {
    const topic = subscribeTopic.trim();
    if (!topic) {
      message.error('Please enter topic to subscribe');
      return;
    }

    subscribeToTopic(topic, subscribeQos);
  };

  const handleUnsubscribe = (topic: string) => {
    unsubscribeFromTopic(topic);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const formatJson = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return jsonString;
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 shadow-lg border border-green-100" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={4} className="mb-4 flex items-center">
        <CloudServerOutlined className="mr-2 text-green-500 text-2xl" />
        Broker Control
        <div className="ml-2 flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${getConnectionStatusColor()} animate-pulse`} />
          <span className="text-sm text-gray-500">
            {getConnectionStatusText()}
          </span>
        </div>
      </Title>

      {lastError && (
        <Alert
          message="Connection Error"
          description={lastError.message}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Collapse className="mb-4" activeKey={collapseActiveKey} onChange={setCollapseActiveKey}>
          <Panel header={
            <div className="flex items-center">
              <ThunderboltOutlined className="mr-2 text-blue-500 text-xl" />
              <span>Broker Configuration</span>
            </div>
          } key="1">
            <Form layout="vertical">
              <div className="grid grid-cols-2 gap-4">
                <Form.Item label="Broker Address">
                  <Input
                    prefix={<GlobalOutlined className="text-blue-500" />}
                    value={brokerConfig.address}
                    onChange={e => setBrokerConfig(prev => ({ ...prev, address: e.target.value.replace(/\s+/g, '') }))}
                    placeholder="e.g., broker.example.com"
                  />
                </Form.Item>
                <Form.Item label="Port">
                  <Input
                    prefix={<KeyOutlined className="text-blue-500" />}
                    value={brokerConfig.port}
                    onChange={e => setBrokerConfig(prev => ({ ...prev, port: e.target.value.replace(/\s+/g, '') }))}
                    placeholder="e.g., 9001"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Form.Item label="Protocol">
                  <Select
                    value={brokerConfig.protocol}
                    onChange={value => setBrokerConfig(prev => ({ ...prev, protocol: value }))}
                  >
                    <Option value="ws">WebSocket (ws)</Option>
                    <Option value="wss">WebSocket Secure (wss)</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Path">
                  <Input
                    prefix={<SafetyCertificateOutlined className="text-blue-500" />}
                    value={brokerConfig.path}
                    onChange={e => setBrokerConfig(prev => ({ ...prev, path: e.target.value }))}
                    placeholder="/mqtt"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Form.Item label="Username">
                  <Input
                    prefix={<UserOutlined className="text-blue-500" />}
                    value={brokerConfig.username}
                    onChange={e => setBrokerConfig(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Optional"
                  />
                </Form.Item>
                <Form.Item label="Password">
                  <Input.Password
                    prefix={<LockOutlined className="text-blue-500" />}
                    value={brokerConfig.password}
                    onChange={e => setBrokerConfig(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Optional"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Form.Item label="Keep Alive (seconds)">
                  <Input
                    type="number"
                    value={brokerConfig.keepalive}
                    onChange={e => setBrokerConfig(prev => ({ ...prev, keepalive: parseInt(e.target.value) }))}
                    min={0}
                  />
                </Form.Item>
                <Form.Item label="Reconnect Period (ms)">
                  <Input
                    type="number"
                    value={brokerConfig.reconnectPeriod}
                    onChange={e => setBrokerConfig(prev => ({ ...prev, reconnectPeriod: parseInt(e.target.value) }))}
                    min={0}
                  />
                </Form.Item>
              </div>

              <div className="flex gap-2">
                <Button
                  type="primary"
                  onClick={handleConnect}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                  icon={<ThunderboltOutlined />}
                  disabled={isConnected}
                  loading={connectionStatus === 'connecting'}
                >
                  Connect
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={disconnect}
                  className="flex-1"
                  icon={<ThunderboltOutlined />}
                  disabled={!isConnected}
                >
                  Disconnect
                </Button>
              </div>
            </Form>
          </Panel>
        </Collapse>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Title level={5} className="flex items-center mb-2">
                <SendOutlined className="mr-2 text-blue-500 text-xl" />
                Publish Message
              </Title>
              <Space direction="vertical" className="w-full">
                <Input
                  placeholder="Topic"
                  value={publishTopic}
                  onChange={e => setPublishTopic(e.target.value.replace(/^\s+|\s+$/g, ''))}
                  prefix={<MessageOutlined className="text-blue-500" />}
                />
                <TextArea
                  placeholder="Message"
                  value={publishMessage}
                  onChange={e => setPublishMessage(e.target.value)}
                  rows={4}
                />
                <Select
                  value={publishQos}
                  onChange={setPublishQos}
                  className="w-full"
                >
                  <Option value={0}>QoS 0 - At most once</Option>
                  <Option value={1}>QoS 1 - At least once</Option>
                  <Option value={2}>QoS 2 - Exactly once</Option>
                </Select>
                <Button
                  type="primary"
                  onClick={handlePublish}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  icon={<SendOutlined />}
                  disabled={!isConnected}
                >
                  Publish
                </Button>
              </Space>
            </div>

            <div>
              <Title level={5} className="flex items-center mb-2">
                <PlusOutlined className="mr-2 text-green-500 text-xl" />
                Subscribe to Topic
              </Title>
              <Space direction="vertical" className="w-full">
                <Input
                  placeholder="Topic"
                  value={subscribeTopic}
                  onChange={e => setSubscribeTopic(e.target.value.replace(/^\s+|\s+$/g, ''))}
                  prefix={<MessageOutlined className="text-green-500" />}
                />
                <Select
                  value={subscribeQos}
                  onChange={setSubscribeQos}
                  className="w-full"
                >
                  <Option value={0}>QoS 0 - At most once</Option>
                  <Option value={1}>QoS 1 - At least once</Option>
                  <Option value={2}>QoS 2 - Exactly once</Option>
                </Select>
                <Button
                  type="primary"
                  onClick={handleSubscribe}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  icon={<PlusOutlined />}
                  disabled={!isConnected}
                >
                  Subscribe
                </Button>
              </Space>
            </div>

            {subscribedTopics.length > 0 && (
              <div>
                <Title level={5} className="flex items-center mb-2">
                  <ApiOutlined className="mr-2 text-purple-500 text-xl" />
                  Subscribed Topics
                </Title>
                <List
                  dataSource={subscribedTopics}
                  renderItem={topic => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleUnsubscribe(topic.topic)}
                        />
                      ]}
                    >
                      <Space>
                        <Tag color="green">{topic.topic}</Tag>
                        <Text type="secondary">QoS {topic.qos}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>

          <div>
            <Title level={5} className="flex items-center mb-2" style={{ position: 'relative' }}>
              <CodeOutlined className="mr-2 text-purple-500 text-xl" />
              Message History
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleClearMessages}
                style={{ position: 'absolute', right: 0, top: 0 }}
                title="Xóa lịch sử"
              />
            </Title>
            <List
              className="bg-white rounded-lg shadow-inner p-4"
              dataSource={messages}
              renderItem={message => (
                <List.Item>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <Tag color={message.type === 'sent' ? 'blue' : 'green'}>
                        {message.type === 'sent' ? 'Sent' : 'Received'}
                      </Tag>
                      <Text type="secondary">{message.time}</Text>
                    </div>
                    <div className="mb-2">
                      <Text strong>Topic:</Text> {message.topic}
                    </div>
                    <div>
                      <Text strong>Payload:</Text>
                      <pre className="bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                        {formatJson(message.payload)}
                      </pre>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}; 