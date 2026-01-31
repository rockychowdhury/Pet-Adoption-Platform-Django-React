import React from 'react';
import Card from '../../../common/Layout/Card'; // Corrected path to src/components/common

const StatsCard = ({ icon: Icon, iconColor, title, value, subtext, subtextClass, badge, badgeColor, onClick, actionLabel }) => {
    return (
        <Card className="p-5 flex flex-col justify-between h-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${iconColor}`}>
                    <Icon size={24} />
                </div>
                {badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <div className="mt-1">
                    {value && <span className="text-3xl font-bold text-gray-900 block mb-1">{value}</span>}

                    <div className="flex items-center justify-between">
                        {subtext && (
                            <span className={`text-xs font-medium ${subtextClass}`}>
                                {subtext}
                            </span>
                        )}
                        {actionLabel && onClick && (
                            <button onClick={onClick} className="text-xs font-medium text-brand-primary hover:text-brand-dark flex items-center gap-1">
                                {actionLabel} &rarr;
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StatsCard;
