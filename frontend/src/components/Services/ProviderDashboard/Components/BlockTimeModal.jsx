import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../../components/common/Buttons/Button';
import DatePicker from 'react-datepicker';

const BlockTimeModal = ({ isOpen, onClose, onSubmit }) => {
    const [blockType, setBlockType] = useState('single'); // single, all-day, recurring
    const [blockDate, setBlockDate] = useState(new Date());
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [dayOfWeek, setDayOfWeek] = useState(0); // Monday
    const [recurrencePattern, setRecurrencePattern] = useState('weekly');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const daysOfWeek = [
        { value: 0, label: 'Monday' },
        { value: 1, label: 'Tuesday' },
        { value: 2, label: 'Wednesday' },
        { value: 3, label: 'Thursday' },
        { value: 4, label: 'Friday' },
        { value: 5, label: 'Saturday' },
        { value: 6, label: 'Sunday' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (blockType !== 'recurring' && !blockDate) {
            toast.error('Please select a date');
            return;
        }

        if (blockType === 'single' && startTime >= endTime) {
            toast.error('End time must be after start time');
            return;
        }

        setSubmitting(true);

        const blockData = {
            is_recurring: blockType === 'recurring',
            is_all_day: blockType === 'all-day',
        };

        if (blockType === 'recurring') {
            blockData.day_of_week = dayOfWeek;
            blockData.recurrence_pattern = recurrencePattern;
            blockData.start_time = startTime;
            blockData.end_time = endTime;
        } else {
            blockData.block_date = blockDate.toISOString().split('T')[0];
            if (blockType === 'single') {
                blockData.start_time = startTime;
                blockData.end_time = endTime;
            }
        }

        if (reason.trim()) {
            blockData.reason = reason;
        }

        try {
            await onSubmit(blockData);
            toast.success('Time blocked successfully');
            onClose();
            // Reset form
            setBlockType('single');
            setReason('');
            setStartTime('09:00');
            setEndTime('17:00');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to block time');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Block Time</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Block Type */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Block Type
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="blockType"
                                    value="single"
                                    checked={blockType === 'single'}
                                    onChange={(e) => setBlockType(e.target.value)}
                                    className="text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm text-gray-700">Single Date & Time</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="blockType"
                                    value="all-day"
                                    checked={blockType === 'all-day'}
                                    onChange={(e) => setBlockType(e.target.value)}
                                    className="text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm text-gray-700">All Day Block</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="blockType"
                                    value="recurring"
                                    checked={blockType === 'recurring'}
                                    onChange={(e) => setBlockType(e.target.value)}
                                    className="text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm text-gray-700">Recurring Block</span>
                            </label>
                        </div>
                    </div>

                    {/* Date Selection (for non-recurring) */}
                    {blockType !== 'recurring' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Date
                            </label>
                            <DatePicker
                                selected={blockDate}
                                onChange={(date) => setBlockDate(date)}
                                minDate={new Date()}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                dateFormat="MMMM d, yyyy"
                            />
                        </div>
                    )}

                    {/* Recurring Options */}
                    {blockType === 'recurring' && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Day of Week
                                </label>
                                <select
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                                >
                                    {daysOfWeek.map((day) => (
                                        <option key={day.value} value={day.value}>
                                            {day.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Recurrence Pattern
                                </label>
                                <select
                                    value={recurrencePattern}
                                    onChange={(e) => setRecurrencePattern(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="biweekly">Bi-weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Time Range (for single and recurring) */}
                    {blockType !== 'all-day' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Reason (Optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Personal appointment, Vacation, etc."
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={submitting}
                            className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                        >
                            {submitting ? 'Blocking...' : 'Block Time'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlockTimeModal;
