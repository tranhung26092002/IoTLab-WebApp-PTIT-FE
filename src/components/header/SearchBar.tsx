// components/Header/SearchComponent.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Input, List, Divider, InputRef } from 'antd';
import { SearchOutlined, HistoryOutlined, CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchProps {
    onSearch: (value: string) => void;
}

export const SearchComponent: React.FC<SearchProps> = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<InputRef>(null);

    const suggestions = [
        'Temperature Sensors',
        'Humidity Data',
        'Device Status',
        'System Alerts',
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    const handleSearch = (value: string) => {
        if (value.trim()) {
            setRecentSearches(prev => {
                const updated = [value, ...prev.filter(item => item !== value)].slice(0, 5);
                return updated;
            });
            onSearch(value);
            setIsDropdownVisible(false);
            setSearchValue(value);
        }
    };

    const handleClearRecent = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRecentSearches([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setIsDropdownVisible(true);
    };

    const handleClearInput = () => {
        setSearchValue('');
        setIsDropdownVisible(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center">
                <Input
                    ref={inputRef}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="Search Dashboard"
                    value={searchValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsDropdownVisible(true)}
                    className="w-[300px] rounded-lg"
                    suffix={
                        searchValue ? (
                            <CloseOutlined
                                className="text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={handleClearInput}
                            />
                        ) : null
                    }
                />
            </div>

            <AnimatePresence>
                {isDropdownVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100"
                    >
                        {/* Rest of the dropdown content remains the same */}
                        {recentSearches.length > 0 && (
                            <>
                                <div className="p-2 flex justify-between items-center text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <HistoryOutlined className="mr-1" /> Recent Searches
                                    </span>
                                    <button
                                        onClick={handleClearRecent}
                                        className="text-xs text-blue-500 hover:text-blue-700"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <List
                                    size="small"
                                    dataSource={recentSearches}
                                    renderItem={item => (
                                        <List.Item
                                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleSearch(item)}
                                        >
                                            <div className="flex items-center text-gray-600">
                                                <HistoryOutlined className="mr-2" />
                                                {item}
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                <Divider className="my-1" />
                            </>
                        )}
                        <List
                            size="small"
                            dataSource={suggestions.filter(item =>
                                item.toLowerCase().includes(searchValue.toLowerCase())
                            )}
                            renderItem={item => (
                                <List.Item
                                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleSearch(item)}
                                >
                                    <div className="flex items-center text-gray-600">
                                        <SearchOutlined className="mr-2" />
                                        {item}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};