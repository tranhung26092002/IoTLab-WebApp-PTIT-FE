// components/Header/MessageDropdown.tsx
import React, { useState } from 'react';
import { Badge, Dropdown, List, Avatar, Modal, Input } from 'antd';
import { MessageOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface Message {
    sender: string;
    content: string;
    time: string;
}

interface ChatPopupProps {
    visible: boolean;
    sender: string;
    onClose: () => void;
}

interface MessageContentProps {
    onMessageClick: (sender: string) => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ visible, sender, onClose }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { sender, content: 'Hello! How can I help you?', time: 'just now' }
    ]);

    const handleSend = () => {
        if (!inputMessage.trim()) return;

        const newMessage = {
            sender: 'You',
            content: inputMessage,
            time: 'just now'
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
    };

    return (
        <Modal
            title={`Chat with ${sender}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            <div className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg p-3 max-w-[70%] ${msg.sender === 'You' ? 'bg-[#4f6f52] text-white' : 'bg-gray-100'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-[#4f6f52] text-white p-2 rounded-lg hover:bg-[#3d5740] transition-colors"
                        >
                            <SendOutlined />
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const MessageContent: React.FC<MessageContentProps> = ({ onMessageClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-80 bg-white rounded-lg shadow-lg"
    >
        <List
            className="max-h-96 overflow-y-auto"
            itemLayout="horizontal"
            dataSource={[
                { sender: 'Admin', message: 'System maintenance', time: '5m ago' },
                { sender: 'Support', message: 'New feature available', time: '1h ago' },
            ]}
            renderItem={(item) => (
                <List.Item
                    className="p-4 hover:bg-gray-50 transition-all cursor-pointer"
                    onClick={() => onMessageClick(item.sender)}
                >
                    <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.sender}
                        description={
                            <div className="flex flex-col">
                                <span>{item.message}</span>
                                <span className="text-xs text-gray-400">{item.time}</span>
                            </div>
                        }
                    />
                </List.Item>
            )}
        />
    </motion.div>
);

export const MessageDropdown: React.FC = () => {
    const [chatVisible, setChatVisible] = useState(false);
    const [activeSender, setActiveSender] = useState('');

    const handleMessageClick = (sender: string) => {
        setActiveSender(sender);
        setChatVisible(true);
    };

    return (
        <>
            <Dropdown
                overlay={<MessageContent onMessageClick={handleMessageClick} />}
                trigger={['click']}
                placement="bottomRight"
            >
                <div>
                    <Badge count={5}>
                        <MessageOutlined className="bg-[#d2e3c8] p-2 rounded-md text-sm text-[#4f6f52] cursor-pointer" />
                    </Badge>
                </div>
            </Dropdown>

            <ChatPopup
                visible={chatVisible}
                sender={activeSender}
                onClose={() => setChatVisible(false)}
            />
        </>
    );
};