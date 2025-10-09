import React, { useState, useRef, useEffect } from 'react';
import { Badge, Avatar, Input, Spin, Tabs, Button, Typography, Tooltip } from 'antd';
import { MessageOutlined, SendOutlined, RobotOutlined, SmileOutlined, 
    CloseOutlined, FullscreenOutlined, FullscreenExitOutlined, DragOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import { useNotificationSound } from '../../hooks/useNotificationSound';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { TabType } from '../../types';

interface ChatPopupProps {
    visible: boolean;
    onClose: () => void;
}

interface EmojiData {
    native: string;
    id: string;
    name: string;
    colons: string;
    emoticons: string[];
    unified: string;
    short_name: string;
    short_names: string[];
    text: string;
    texts: string[];
    skin: number | null;
    skin_variations?: Record<string, string>;
    sheet_x: number;
    sheet_y: number;
    tone: number | null;
}

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface MessageDropdownProps {
    children?: React.ReactNode;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ visible, onClose }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('chat');
    const [isResizable] = useState(true);
    const [size, setSize] = useState<Size>({ width: 500, height: 600 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState<Position>({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState<Size>({ width: 500, height: 600 });
    const [position, setPosition] = useState<Position>({ 
        x: window.innerWidth / 2 - 250, 
        y: window.innerHeight / 2 - 300 
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [previousPosition, setPreviousPosition] = useState<Position>({ x: 0, y: 0 });
    const [previousSize, setPreviousSize] = useState<Size>({ width: 500, height: 600 });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { messages, sendMessage, isLoading } = useChat();
    const { playNotification } = useNotificationSound();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Phát âm thanh khi có tin nhắn mới từ AI
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && !lastMessage.isUser && !lastMessage.read) {
            playNotification();
        }
    }, [messages, playNotification]);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        try {
            await sendMessage(inputMessage, activeTab);
            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };

    const handleEmojiSelect = (emoji: EmojiData) => {
        setInputMessage(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    // Xử lý sự kiện kéo thả
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isFullscreen) return;
        
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    // Xử lý sự kiện di chuyển chuột khi đang kéo
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            // Sử dụng requestAnimationFrame để tối ưu hiệu suất
            requestAnimationFrame(() => {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                });
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    // Xử lý sự kiện thay đổi kích thước
    const handleResizeStart = (e: React.MouseEvent) => {
        if (!isResizable || isFullscreen) return;
        
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY
        });
        setInitialSize({ ...size });
    };

    // Xử lý sự kiện di chuyển chuột khi đang thay đổi kích thước
    useEffect(() => {
        const handleResizeMove = (e: MouseEvent) => {
            if (!isResizing) return;
            
            // Sử dụng requestAnimationFrame để tối ưu hiệu suất
            requestAnimationFrame(() => {
                const deltaX = e.clientX - resizeStart.x;
                const deltaY = e.clientY - resizeStart.y;
                
                setSize({
                    width: Math.max(400, initialSize.width + deltaX),
                    height: Math.max(500, initialSize.height + deltaY)
                });
            });
        };

        const handleResizeEnd = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove, { passive: true });
            document.addEventListener('mouseup', handleResizeEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [isResizing, resizeStart, initialSize]);

    // Xử lý sự kiện chế độ toàn màn hình
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            // Lưu vị trí và kích thước hiện tại trước khi mở rộng
            setPreviousPosition(position);
            setPreviousSize(size);
            setPosition({ x: 0, y: 0 });
            setSize({ width: window.innerWidth, height: window.innerHeight });
        } else {
            // Khôi phục vị trí và kích thước trước đó
            setPosition(previousPosition);
            setSize(previousSize);
        }
        setIsFullscreen(!isFullscreen);
    };

    const items = [
        {
            key: 'chat',
            label: 'Chat thông thường',
            icon: <MessageOutlined />
        },
        {
            key: 'iot',
            label: 'Chat IoT',
            icon: <RobotOutlined />
        }
    ];

    return (
        <div 
            ref={chatContainerRef}
            className={`fixed bg-white rounded-lg shadow-xl flex flex-col z-50 overflow-hidden
                ${isFullscreen ? 'rounded-none' : ''}`}
            style={{
                display: visible ? 'flex' : 'none',
                width: isFullscreen ? '100vw' : size.width,
                height: isFullscreen ? '100vh' : size.height,
                top: isFullscreen ? 0 : position.y,
                left: isFullscreen ? 0 : position.x,
                cursor: isDragging ? 'grabbing' : 'default',
                touchAction: 'none',
                transition: isDragging || isResizing ? 'none' : 'all 0.3s ease-in-out',
                willChange: 'transform'
            }}
        >
            <div 
                className="bg-[#4f6f52] text-white p-4 rounded-t-lg flex justify-between items-center cursor-move"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center">
                    <DragOutlined className="mr-2 opacity-70" />
                    <h2 className="text-lg font-semibold">Chat với AI Assistant</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleFullscreen}
                        className="hover:text-white/80 transition-colors"
                    >
                        {isFullscreen ? (
                            <FullscreenExitOutlined />
                        ) : (
                            <FullscreenOutlined />
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="hover:text-white/80 transition-colors"
                    >
                        <CloseOutlined />
                    </button>
                </div>
            </div>

            <div className="flex flex-col h-full">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as TabType)}
                    items={items}
                    className="px-4 pt-2"
                />
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`rounded-lg p-3 max-w-[70%] ${
                                    msg.isUser 
                                        ? 'bg-[#4f6f52] text-white' 
                                        : 'bg-gray-100'
                                }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                    {formatDistanceToNow(msg.timestamp, { 
                                        addSuffix: true,
                                        locale: vi 
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-center">
                            <Spin />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <Input
                                value={inputMessage}
                                onChange={handleInputChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={activeTab === 'chat' ? "Nhập tin nhắn..." : "Nhập câu hỏi về IoT..."}
                                className="flex-1 rounded-full py-2 px-4 border-gray-300 focus:border-[#4f6f52] focus:ring-[#4f6f52]"
                                disabled={isLoading}
                            />
                            <Button
                                type="text"
                                icon={<SmileOutlined className="text-gray-500 hover:text-[#4f6f52] transition-colors" />}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            />
                            {showEmojiPicker && (
                                <div className="absolute bottom-full right-0 mb-2 z-50">
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                        theme="light"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-[#4f6f52] text-white p-3 rounded-full hover:bg-[#3d5740] transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            <SendOutlined className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {isResizable && !isFullscreen && (
                <div 
                    className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize"
                    onMouseDown={handleResizeStart}
                >
                    <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute bottom-1 right-1"
                    >
                        <path 
                            d="M1 1L11 11M1 11L11 1" 
                            stroke="#CBD5E1" 
                            strokeWidth="1.5" 
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export const MessageTooltipContent: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-64 p-2"
    >
        <div className="flex items-center gap-3 mb-2">
            <Avatar 
                icon={<RobotOutlined />} 
                className="bg-[#4f6f52]"
                size="small"
            />
            <div>
                <Typography.Text strong className="text-white">
                    AI Assistant
                </Typography.Text>
                <Typography.Text className="block text-xs text-white/80">
                    Hỗ trợ thực hành 24/7
                </Typography.Text>
            </div>
        </div>
        <Typography.Text className="block text-xs text-white/90 mb-2">
            Tôi có thể giúp bạn với:
        </Typography.Text>
        <ul className="list-disc list-inside text-xs text-white/80 space-y-0.5 ml-1">
            <li>Thực hành IoT</li>
            <li>Lập trình và debug</li>
            <li>Hướng dẫn sử dụng thiết bị</li>
            <li>Giải đáp thắc mắc</li>
        </ul>
    </motion.div>
);

export const MessageDropdown: React.FC<MessageDropdownProps> = () => {
    const [chatVisible, setChatVisible] = useState(false);
    const { messages } = useChat();

    const unreadCount = messages.filter(msg => !msg.isUser && !msg.read).length;

    return (
        <>
            <Tooltip 
                title={<MessageTooltipContent />}
                placement="bottom"
                overlayClassName="!p-0"
                overlayInnerStyle={{
                    background: 'linear-gradient(to right, #4f6f52, #3d5740)',
                    borderRadius: '12px',
                }}
            >
                <Badge count={unreadCount} offset={[-5, 5]}>
                    <MessageOutlined 
                        className="text-xl p-2 rounded-full bg-[#d2e3c8] text-[#4F6F52] hover:bg-[#86A789] hover:text-white transition-all duration-300" 
                        onClick={() => setChatVisible(true)}
                    />
                </Badge>
            </Tooltip>

            <ChatPopup
                visible={chatVisible}
                onClose={() => setChatVisible(false)}
            />
        </>
    );
}; 
