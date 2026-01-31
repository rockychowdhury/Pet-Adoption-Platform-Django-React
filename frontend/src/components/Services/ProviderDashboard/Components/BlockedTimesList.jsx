import React from 'react';
import { Calendar, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../../../../components/common/Buttons/Button';

const BlockedTimesList = ({ blocks, onDelete, loading }) => {
    const oneTimeBlocks = blocks?.filter(b => !b.is_recurring) || [];
    const recurringBlocks = blocks?.filter(b => b.is_recurring) || [];

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (loading) {
        return (
            <div className="text-center py-8 text-gray-500">
                Loading blocks...
            </div>
        );
    }

    if (blocks?.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600 font-medium">No blocked times yet</p>
                <p className="text-sm text-gray-500 mt-1">Click "Block Time" to add unavailable slots</p>
            </div>
        );
    }

    const BlockCard = ({ block, isRecurring }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {isRecurring ? (
                            <div className="flex items-center gap-2 text-purple-600">
                                <Clock size={16} />
                                <span className="font-bold text-gray-900">
                                    Every {daysOfWeek[block.day_of_week]}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-600">
                                <Calendar size={16} />
                                <span className="font-bold text-gray-900">
                                    {format(new Date(block.block_date), 'MMMM d, yyyy')}
                                </span>
                            </div>
                        )}
                    </div>

                    {block.is_all_day ? (
                        <div className="text-sm text-gray-600">All Day</div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            {block.start_time} - {block.end_time}
                        </div>
                    )}

                    {block.reason && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                            {block.reason}
                        </div>
                    )}

                    {isRecurring && (
                        <div className="mt-2 text-xs text-purple-600 font-medium capitalize">
                            {block.recurrence_pattern}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onDelete(block.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors ml-4"
                    title="Remove block"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* One-time Blocks */}
            {oneTimeBlocks.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Blocked Dates</h3>
                    <div className="space-y-3">
                        {oneTimeBlocks.map(block => (
                            <BlockCard key={block.id} block={block} isRecurring={false} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recurring Blocks */}
            {recurringBlocks.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Recurring Blocks</h3>
                    <div className="space-y-3">
                        {recurringBlocks.map(block => (
                            <BlockCard key={block.id} block={block} isRecurring={true} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockedTimesList;
