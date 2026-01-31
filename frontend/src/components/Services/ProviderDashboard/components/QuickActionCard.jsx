import React from 'react';

const QuickActionCard = ({ icon: Icon, title, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm rounded-xl transition-all group h-full w-full"
        >
            <div className="mb-4 p-3 bg-white rounded-full shadow-sm text-gray-700 group-hover:text-brand-primary group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{title}</span>
        </button>
    );
};

export default QuickActionCard;
