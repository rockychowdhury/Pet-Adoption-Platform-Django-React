import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SortDropdown = ({ currentSort, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const sortRef = useRef(null);

    const sortOptions = [
        { value: '-published_at', label: 'Newest First' },
        { value: 'relevance', label: 'Relevance' },
        { value: 'adoption_fee', label: 'Lowest Fee' },
        { value: '-adoption_fee', label: 'Highest Fee' },
        { value: 'age_months', label: 'Youngest First' },
        { value: '-age_months', label: 'Oldest First' },
    ];

    const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Newest First';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        onSortChange(value);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={sortRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 pl-4 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-[#4B5563] hover:border-gray-300 transition-colors min-w-[200px] justify-between cursor-pointer"
            >
                <span className="truncate">Sort by: {currentSortLabel}</span>
                <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 overflow-hidden"
                    >
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors flex items-center justify-between
                                    ${currentSort === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SortDropdown;
