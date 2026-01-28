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

import ProviderProfileEditor from '../../components/Services/ProviderDashboard/ProviderProfileEditor';
import { Link } from 'react-router-dom';

const ProviderDashboardPage = () => {
    const { user } = useAuth();
    const { useGetMyBookings, useBookingAction, useGetMyProviderProfile } = useServices();

    // Fetch Data
    const { data: bookings, isLoading: bookingsLoading } = useGetMyBookings();
    const { data: provider, isLoading: providerLoading } = useGetMyProviderProfile();
    const bookingAction = useBookingAction();

    // UI State
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
    const [showProfileEditor, setShowProfileEditor] = useState(false);

    const handleAction = async (id, action, reason = null) => {
        try {
            await bookingAction.mutateAsync({ id, action, data: reason ? { reason } : {} });
            toast.success(`Booking ${action}ed successfully`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${action} booking`);
        }
    };

    if (bookingsLoading || providerLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <Loader className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-bg-primary font-jakarta">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                    <User size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Service Provider Profile Not Found</h2>
                    <p className="text-text-secondary mb-8">
                        You need to register as a service provider to access this dashboard.
                    </p>
                    <Link to="/service-provider/register">
                        <Button variant="primary">Register Now</Button>
                    </Link>
                </div>
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

    // Calculate Completion (Simple heuristic)
    const calculateCompletion = () => {
        let completed = 0;
        let total = 4; // Basic, Service, Hours, Media
        if (provider.business_name && provider.description) completed++;
        if (provider.foster_details || provider.vet_details || provider.trainer_details) completed++;
        if (provider.hours && provider.hours.length > 0) completed++;
        if (provider.media && provider.media.length > 0) completed++;
        return Math.round((completed / total) * 100);
    };

    const completionPercentage = calculateCompletion();

    return (
        <div className="min-h-screen bg-bg-primary font-jakarta">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-merriweather text-text-primary">Provider Dashboard</h1>
                        <p className="text-text-secondary">Welcome back, {provider.business_name || user?.first_name}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${provider.verification_status === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                            provider.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                'bg-red-100 text-red-700 border-red-200'
                            }`}>
                            {provider.verification_status === 'verified' ? 'Verified Partner' :
                                provider.verification_status === 'pending' ? 'Verification Pending' :
                                    'Unverified'}
                        </div>

                        <Button
                            variant="primary"
                            onClick={() => setShowProfileEditor(!showProfileEditor)}
                        >
                            <Edit size={18} className="mr-2" />
                            {showProfileEditor ? 'Close Editor' : 'Edit Profile'}
                        </Button>
                    </div>
                </div>

                {/* Profile Completion Alert */}
                {completionPercentage < 100 && !showProfileEditor && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-blue-600" size={24} />
                            <div>
                                <h3 className="font-bold text-text-primary">Complete Your Profile</h3>
                                <p className="text-sm text-text-secondary">
                                    Your profile is {completionPercentage}% complete. Improved profiles get more bookings.
                                </p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setShowProfileEditor(true)}>Finish Setup</Button>
                    </div>
                )}

                {/* Editor Section */}
                {showProfileEditor && (
                    <div className="mb-8 animate-slideDown">
                        <ProviderProfileEditor provider={provider} onClose={() => setShowProfileEditor(false)} />
                    </div>
                )}

                {/* Dashboard Stats */}
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
                    <Card className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-text-secondary text-sm">Completed</p>
                            <p className="text-2xl font-bold text-text-primary">{providerBookings.filter(b => b.status === 'completed').length}</p>
                        </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-text-secondary text-sm">Profile Views</p>
                            <p className="text-2xl font-bold text-text-primary">--</p>
                        </div>
                    </Card>
                </div>

                {/* Bookings List */}
                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-xl font-bold">Bookings Management</h2>
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
