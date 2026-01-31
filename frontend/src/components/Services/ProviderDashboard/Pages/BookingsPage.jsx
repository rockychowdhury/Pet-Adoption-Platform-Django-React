import React, { useState } from 'react';
import {
    Search,
    Calendar,
    Clock,
    Filter,
    Download,
    Plus,
    MoreVertical,
    FileText,
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Button from '../../../../components/common/Buttons/Button';
import Badge from '../../../../components/common/Feedback/Badge';
import useServices from '../../../../hooks/useServices';

const BookingsPage = ({ provider }) => {
    const { useGetMyBookings, useBookingAction } = useServices();
    const { data: bookingsData, isLoading } = useGetMyBookings();
    const bookingAction = useBookingAction();

    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAction = async (id, action, reason = null) => {
        try {
            await bookingAction.mutateAsync({ id, action, data: reason ? { reason } : {} });
            toast.success(`Booking ${action}ed successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${action} booking`);
        }
    };

    // Filter Logic
    const allBookings = bookingsData?.results?.filter(b => b.provider.id === provider.id) || [];

    // Calculate counts for tabs
    const counts = {
        all: allBookings.length,
        pending: allBookings.filter(b => b.status === 'pending').length,
        confirmed: allBookings.filter(b => b.status === 'confirmed').length,
        completed: allBookings.filter(b => b.status === 'completed').length,
        cancelled: allBookings.filter(b => b.status === 'cancelled').length,
    };

    const filteredBookings = allBookings.filter(b => {
        // Status Filter
        if (activeTab !== 'all' && b.status !== activeTab) return false;

        // Search Filter (Client Name or ID)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const clientName = `${b.client.first_name} ${b.client.last_name}`.toLowerCase();
            return clientName.includes(query) || b.id.toString().includes(query);
        }

        return true;
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'pending', label: `Pending (${counts.pending})` },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                    <Button variant="primary" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 shadow-sm">
                        <Plus size={16} />
                        New Booking
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all
                                ${activeTab === tab.id
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by client or booking ID..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                        <Calendar size={18} />
                    </button>
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    filteredBookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            {/* Card Header: ID & Status */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                                <span className="text-sm font-medium text-gray-500">#BK-{booking.id}</span>
                                <Badge variant={
                                    booking.status === 'confirmed' ? 'success' :
                                        booking.status === 'pending' ? 'warning' :
                                            booking.status === 'completed' ? 'info' :
                                                'error'
                                } className="capitalize px-3 py-1">
                                    {booking.status === 'pending' ? 'Pending Request' : booking.status}
                                </Badge>
                            </div>

                            {/* Card Content: Columns */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* 1. Client */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Client</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                            {booking.client.photoURL ? (
                                                <img src={booking.client.photoURL} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 font-bold">
                                                    {booking.client.first_name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{booking.client.first_name} {booking.client.last_name}</div>
                                            <div className="text-xs text-gray-500">Pet: {booking.pet?.name || 'Unknown'} ({booking.pet?.species || 'Pet'})</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Service */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Service</label>
                                    <div className="font-semibold text-gray-900">{booking.service_option?.name || booking.service_name || 'Service'}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Est. {booking.service_option?.duration || '1'} hour</div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Schedule</label>
                                    <div className="font-semibold text-gray-900">
                                        {booking.booking_date ? format(new Date(booking.booking_date), 'MMM dd, yyyy') : 'TBD'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {booking.booking_time ? booking.booking_time : 'Time TBD'}
                                        {booking.end_datetime && ` - ${format(new Date(booking.end_datetime), 'hh:mm a')}`}
                                    </div>
                                </div>

                                {/* 4. Price */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Price</label>
                                    <div className="font-bold text-gray-900">${booking.agreed_price || booking.service_option?.base_price || '0.00'}</div>
                                    <div className="text-xs text-red-500 font-medium mt-0.5">
                                        {booking.payment_status === 'paid' ? 'Paid' : booking.payment_status === 'partial' ? 'Partially Paid' : 'Unpaid'}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info / Footer */}
                            <div className="px-6 pb-6 mt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Notes */}
                                <div className="flex items-start gap-2 text-sm text-gray-500 md:max-w-xl">
                                    {booking.special_requirements ? (
                                        <>
                                            <AlertCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span>{booking.special_requirements}</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-400 italic flex items-center gap-2">
                                            <MessageSquare size={16} /> No additional notes provided.
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 self-end md:self-auto">
                                    {booking.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                                                onClick={() => {
                                                    const reason = prompt("Enter rejection reason:");
                                                    if (reason) handleAction(booking.id, 'reject', reason);
                                                }}
                                            >
                                                Decline
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-teal-600 hover:bg-teal-700 text-white border-transparent"
                                                onClick={() => handleAction(booking.id, 'accept')}
                                            >
                                                Accept Request
                                            </Button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-gray-600 border-gray-200"
                                            onClick={() => {
                                                const reason = prompt("Enter cancellation reason:");
                                                if (reason) handleAction(booking.id, 'cancel', reason);
                                            }}
                                        >
                                            Cancel Booking
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookingsPage;
