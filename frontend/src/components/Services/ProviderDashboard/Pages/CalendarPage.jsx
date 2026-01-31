import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import useServices from '../../../../hooks/useServices';
import Button from '../../../common/Buttons/Button';
import Calendar from '../../../common/Calendar';

const CalendarPage = ({ provider }) => {
    const { useGetMyBookings } = useServices();
    const { data: bookingsData, isLoading } = useGetMyBookings();
    const [view, setView] = useState('week');

    // Transform bookings to calendar events format
    const bookings = bookingsData?.results?.filter(b => b.provider?.id === provider?.id) || [];

    const events = bookings.map(booking => ({
        id: booking.id,
        date: booking.booking_date,
        time: booking.booking_time,
        title: `${booking.pet?.name} (${booking.pet?.species})`,
        description: `${booking.service_option?.name || 'Service'} • ${booking.client?.first_name}`,
        color: getStatusColor(booking.status),
        status: booking.status,
        rawData: booking // Keep original booking data
    }));

    // Status color mapping
    function getStatusColor(status) {
        switch (status) {
            case 'confirmed': return 'border-l-blue-500 bg-blue-50/50';
            case 'pending': return 'border-l-yellow-500 bg-yellow-50/50';
            case 'completed': return 'border-l-green-500 bg-green-50/50';
            case 'in_progress': return 'border-l-purple-500 bg-purple-50/50';
            case 'cancelled': return 'border-l-gray-400 bg-gray-50';
            default: return 'border-l-gray-300 bg-gray-50';
        }
    }

    // Event click handler
    const handleEventClick = (event) => {
        console.log('Event clicked:', event.rawData);
        // Could open a modal with booking details
    };

    // Date click handler
    const handleDateClick = (date) => {
        console.log('Date clicked:', date);
        // Could open booking creation modal for that date
    };

    // Time slot click handler
    const handleTimeSlotClick = (date, hour) => {
        console.log('Time slot clicked:', date, hour);
        // Could open booking creation modal for that specific time
    };

    // Custom event renderer with booking-specific info
    const renderBookingEvent = (event) => (
        <div
            onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event);
            }}
            className={`mb-1 p-2 border-l-4 rounded text-xs cursor-pointer hover:shadow-md transition-all ${event.color}`}
        >
            <div className="font-bold text-gray-900 truncate">{event.title}</div>
            {event.time && <div className="text-gray-600 text-[10px] truncate mt-0.5">{event.time}</div>}
            <div className="text-gray-500 text-[10px] truncate">{event.description}</div>
            {event.status === 'in_progress' && (
                <div className="mt-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] text-red-600 font-medium">In Progress</span>
                </div>
            )}
        </div>
    );

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading calendar...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings Calendar</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your appointments and schedule</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                        {['Week', 'Month'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v.toLowerCase())}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${view === v.toLowerCase()
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                        <Plus size={16} className="mr-1" />
                        New Booking
                    </Button>
                </div>
            </div>

            {/* Reusable Calendar Component */}
            <Calendar
                events={events}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                onTimeSlotClick={handleTimeSlotClick}
                view={view}
                renderEvent={renderBookingEvent}
            />

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs bg-white border border-gray-200 rounded-lg p-4">
                <span className="font-medium text-gray-500">Status:</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-gray-600">In Progress</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
