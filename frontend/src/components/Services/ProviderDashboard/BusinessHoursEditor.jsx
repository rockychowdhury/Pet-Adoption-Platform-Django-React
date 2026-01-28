import React, { useState, useEffect } from 'react';
import { Clock, Check, X } from 'lucide-react';
import Button from '../../common/Buttons/Button';
import { toast } from 'react-toastify';

const DAYS = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' },
];

const BusinessHoursEditor = ({ initialHours = [], onSave, isLoading }) => {
    // Map initial hours to local state or defaults
    const [hours, setHours] = useState([]);

    useEffect(() => {
        // Initialize state with all 7 days
        const initialized = DAYS.map(day => {
            const existing = initialHours.find(h => h.day === day.value);
            return {
                day: day.value,
                day_display: day.label,
                open_time: existing?.open_time || '09:00',
                close_time: existing?.close_time || '17:00',
                is_closed: existing?.is_closed ?? false, // Default to open if not specified, or closed? Let's say open M-F, closed S-S ideally but here default open.
                id: existing?.id
            };
        });
        setHours(initialized);
    }, [initialHours]);

    const handleChange = (dayValue, field, value) => {
        setHours(prev => prev.map(h =>
            h.day === dayValue ? { ...h, [field]: value } : h
        ));
    };

    const handleSave = () => {
        onSave(hours);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">Business Hours</h3>
                    <p className="text-sm text-text-secondary">Set your availability for standard bookings.</p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Hours'}
                </Button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {hours.map((day) => (
                    <div key={day.day} className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-border shadow-sm">
                        <div className="w-28 font-medium text-text-primary">{day.day_display}</div>

                        <div className="flex-1 flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!day.is_closed}
                                    onChange={(e) => handleChange(day.day, 'is_closed', !e.target.checked)}
                                    className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                                />
                                <span className="text-sm text-text-secondary">Open</span>
                            </label>

                            {!day.is_closed ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={day.open_time || ''}
                                        onChange={(e) => handleChange(day.day, 'open_time', e.target.value)}
                                        className="p-1.5 border border-border rounded-md text-sm"
                                    />
                                    <span className="text-text-tertiary">-</span>
                                    <input
                                        type="time"
                                        value={day.close_time || ''}
                                        onChange={(e) => handleChange(day.day, 'close_time', e.target.value)}
                                        className="p-1.5 border border-border rounded-md text-sm"
                                    />
                                </div>
                            ) : (
                                <span className="text-sm text-text-tertiary italic px-2">Closed</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessHoursEditor;
