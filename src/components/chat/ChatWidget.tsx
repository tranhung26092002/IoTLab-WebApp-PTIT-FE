import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChatBubbleLeftIcon, 
    XMarkIcon, 
    ArrowsPointingOutIcon, 
    ArrowsPointingInIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { TabType } from '../../types';
import { useChat } from '../../hooks/useChat';

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('chat');
    const [inputMessage, setInputMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [size, setSize] = useState<Size>({ width: 384, height: 600 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState<Position>({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState<Size>({ width: 384, height: 600 });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const resizeHandleRef = useRef<HTMLDivElement>(null);
    
    const { messages, isLoading, error, sendMessage } = useChat();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;
        
        await sendMessage(inputMessage, activeTab);
        setInputMessage('');
    };

    // Chỉ hiển thị các tab chat và iot
    const availableTabs = ['chat', 'iot'];

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
            
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    // Xử lý sự kiện thay đổi kích thước
    const handleResizeStart = (e: React.MouseEvent) => {
        if (isFullscreen) return;
        
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
            
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            
            setSize({
                width: Math.max(300, initialSize.width + deltaX),
                height: Math.max(400, initialSize.height + deltaY)
            });
        };

        const handleResizeEnd = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [isResizing, resizeStart, initialSize]);

    // Xử lý sự kiện thu nhỏ/mở rộng
    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        if (!isMinimized) {
            // Lưu vị trí hiện tại trước khi thu nhỏ
            setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
        }
    };

    // Xử lý sự kiện chế độ toàn màn hình
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        if (!isFullscreen) {
            // Lưu vị trí và kích thước hiện tại trước khi mở rộng
            setPosition({ x: 0, y: 0 });
            setSize({ width: window.innerWidth, height: window.innerHeight });
        } else {
            // Khôi phục kích thước trước đó
            setSize({ width: 384, height: 600 });
        }
    };

    // Xử lý sự kiện đóng chat
    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
        setIsFullscreen(false);
    };

    return (
        <>
            {!isOpen && (
                <motion.button
                    className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                >
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatContainerRef}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ 
                            opacity: 1, 
                            x: isMinimized ? window.innerWidth - 100 : position.x,
                            y: isMinimized ? window.innerHeight - 100 : position.y,
                            width: isMinimized ? 80 : (isFullscreen ? '100vw' : size.width),
                            height: isMinimized ? 80 : (isFullscreen ? '100vh' : size.height)
                        }}
                        exit={{ opacity: 0, y: 100 }}
                        className={`fixed bg-white rounded-lg shadow-xl flex flex-col z-50 overflow-hidden
                            ${isMinimized ? 'rounded-full' : ''}
                            ${isFullscreen ? 'rounded-none' : ''}`}
                        style={{
                            cursor: isDragging ? 'grabbing' : 'default',
                            touchAction: 'none'
                        }}
                    >
                        {!isMinimized && (
                            <div 
                                className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center cursor-move"
                                onMouseDown={handleMouseDown}
                            >
                                <h2 className="text-lg font-semibold">AI Chat Assistant</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={toggleMinimize}
                                        className="hover:text-white/80 transition-colors"
                                    >
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={toggleFullscreen}
                                        className="hover:text-white/80 transition-colors"
                                    >
                                        {isFullscreen ? (
                                            <ArrowsPointingInIcon className="w-5 h-5" />
                                        ) : (
                                            <ArrowsPointingOutIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="hover:text-white/80 transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {isMinimized ? (
                            <div 
                                className="w-full h-full flex items-center justify-center cursor-pointer"
                                onClick={() => setIsMinimized(false)}
                            >
                                <ChatBubbleLeftIcon className="w-8 h-8 text-primary" />
                            </div>
                        ) : (
                            <>
                                <div className="flex border-b">
                                    {availableTabs.map((tab) => (
                                        <button
                                            key={tab}
                                            className={`flex-1 py-2 px-4 text-sm font-medium ${
                                                activeTab === tab
                                                    ? 'text-primary border-b-2 border-primary'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                            onClick={() => setActiveTab(tab as TabType)}
                                        >
                                            {tab === 'chat' ? 'Chat' : 'IoT Assistant'}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
                                        >
                                            <div
                                                className={`inline-block p-3 rounded-lg ${
                                                    message.isUser
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {message.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <div className="text-center text-gray-500">
                                            Đang xử lý...
                                        </div>
                                    )}
                                    {error && (
                                        <div className="text-center text-red-500">
                                            {error}
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Nhập tin nhắn..."
                                            disabled={isLoading}
                                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={isLoading}
                                            className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>

                                {!isFullscreen && (
                                    <div 
                                        ref={resizeHandleRef}
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
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget; 