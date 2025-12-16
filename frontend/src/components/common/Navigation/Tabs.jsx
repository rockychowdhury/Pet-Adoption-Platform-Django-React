import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Tabs = ({
    tabs = [], // [{ label: 'Tab 1', value: 'tab1', content: <Component /> }]
    variant = 'horizontal', // horizontal, vertical
    defaultTab,
    onChange,
    className = '',
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);

    const handleTabClick = (value) => {
        setActiveTab(value);
        if (onChange) onChange(value);
    };

    if (variant === 'vertical') {
        return (
            <div className={`flex gap-6 ${className}`}>
                {/* Tab List */}
                <div className="flex flex-col min-w-[200px] gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabClick(tab.value)}
                            className={`
                text-left px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${activeTab === tab.value
                                    ? 'bg-brand-secondary text-white shadow-md'
                                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                }
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                    {tabs.find(t => t.value === activeTab)?.content}
                </div>
            </div>
        );
    }

    // Default Horizontal
    return (
        <div className={`w-full ${className}`}>
            {/* Tab List */}
            <div className="flex border-b border-border mb-6 overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabClick(tab.value)}
                        className={`
              px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2
              ${activeTab === tab.value
                                ? 'border-brand-secondary text-brand-secondary'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {tabs.find(t => t.value === activeTab)?.content}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        content: PropTypes.node,
    })).isRequired,
    variant: PropTypes.oneOf(['horizontal', 'vertical']),
    defaultTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    className: PropTypes.string,
};

export default Tabs;
