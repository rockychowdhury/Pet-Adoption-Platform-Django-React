import React, { useState } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, Loader, Edit } from 'lucide-react';
import useServices from '../../hooks/useServices';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Buttons/Button';
import Card from '../../components/common/Layout/Card';
import Badge from '../../components/common/Feedback/Badge';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ProviderDashboardPage = () => {
    const { user } = useAuth();
    const { useGetMyBookings, useBookingAction } = useServices();
    const { data: bookings, isLoading: bookingsLoading } = useGetMyBookings();
    const bookingAction = useBookingAction();
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

    const handleAction = async (id, action, reason = null) => {
        try {
            await bookingAction.mutateAsync({ id, action, data: reason ? { reason } : {} });
            toast.success(`Booking ${action}ed successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${action} booking`);
        }
    };

    if (bookingsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <Loader className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    // Filter bookings where user is the PROVIDER
    const providerBookings = bookings?.results?.filter(b => b.provider.user.id === user?.id) || [];

    // Apply status filter
    const filteredBookings = providerBookings.filter(b => {
        if (filter === 'all') return true;
        return b.status === filter;
    }) || [];

    return (
        <div className="min-h-screen bg-bg-primary font-jakarta">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-merriweather text-text-primary">Provider Dashboard</h1>
                        <p className="text-text-secondary">Manage your bookings and profile</p>
                    </div>
                    {/* Link to Edit Profile (could be implemented later as separate page or modal) */}
                    <Button variant="outline"><Edit size={16} className="mr-2" /> Edit Profile</Button>
                </div>

                {/* Dashboard Stats (Placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-text-secondary text-sm">Total Bookings</p>
                            <p className="text-2xl font-bold text-text-primary">{providerBookings.length}</p>
                        </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-text-secondary text-sm">Pending</p>
                            <p className="text-2xl font-bold text-text-primary">{providerBookings.filter(b => b.status === 'pending').length}</p>
                        </div>
                    </Card>
                    {/* Add more stats */}
                </div>

                {/* Bookings List */}
                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold">Bookings</h2>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
                            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filter === f ? 'bg-white shadow text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No bookings found.</p>
                            </div>
                        ) : (
                            filteredBookings.map(booking => (
                                <div key={booking.id} className="border border-border rounded-xl p-4 md:p-6 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0 overflow-hidden">
                                                {/* Client Avatar if available */}
                                                <User className="w-full h-full p-2 text-gray-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg text-text-primary">
                                                        {booking.client.first_name || 'Client'} {booking.client.last_name}
                                                    </h3>
                                                    <Badge variant={
                                                        booking.status === 'confirmed' ? 'success' :
                                                            booking.status === 'pending' ? 'warning' :
                                                                booking.status === 'cancelled' ? 'error' : 'default'
                                                    }>
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-text-secondary mb-1">
                                                    {booking.service_details?.service_name || 'Service'}
                                                    {booking.pet_details?.name && ` for ${booking.pet_details.name}`}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {format(new Date(booking.start_date), 'MMM dd, yyyy')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} /> Booked on {format(new Date(booking.created_at), 'MMM dd')}
                                                    </span>
                                                </div>
                                                {booking.notes && (
                                                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                        "{booking.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 self-start md:self-center">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="bg-green-600 hover:bg-green-700 border-green-600"
                                                        onClick={() => handleAction(booking.id, 'accept')}
                                                    >
                                                        <CheckCircle size={16} className="mr-1" /> Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => {
                                                            const reason = prompt("Reason for rejection:");
                                                            if (reason) handleAction(booking.id, 'reject', reason);
                                                        }}
                                                    >
                                                        <XCircle size={16} className="mr-1" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <Button size="sm" variant="outline" disabled>
                                                    <CheckCircle size={16} className="mr-1" /> Accepted
                                                </Button>
                                            )}
                                            {booking.status === 'cancelled' && (
                                                <span className="text-xs text-red-500 italic">
                                                    Reason: {booking.cancellation_reason || 'No reason provided'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProviderDashboardPage;
