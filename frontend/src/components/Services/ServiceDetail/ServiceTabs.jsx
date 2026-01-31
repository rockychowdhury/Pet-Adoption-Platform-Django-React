import React from 'react';

const ServiceTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'services', label: 'Services & Pricing' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'about', label: 'About' },
    ];

    return (
        <div className="sticky top-[73px] z-30 bg-white border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <nav className="flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                                }
                            `}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default ServiceTabs;
