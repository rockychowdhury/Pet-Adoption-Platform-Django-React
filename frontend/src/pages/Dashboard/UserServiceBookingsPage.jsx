import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    MapPin,
    PawPrint,
    ChevronRight,
    Search,
    AlertCircle,
    Filter,
    X,
    CalendarDays,
    DollarSign,
    ExternalLink
} from 'lucide-react';
import useServices from '../../hooks/useServices';
import BookingStatusBadge from '../../components/Services/BookingStatusBadge';
import Button from '../../components/common/Buttons/Button';
import { format, isAfter, isBefore } from 'date-fns';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserServiceBookingsPage = () => {
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'all'
    const { useGetMyBookings, useBookingAction } = useServices();
    const { data: bookingsData, isLoading, refetch } = useGetMyBookings();
    const bookingAction = useBookingAction();

    const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.results || []);

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await bookingAction.mutateAsync({ id, action: 'cancel' });
            toast.success('Booking cancelled successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const filterBookings = (list) => {
        const now = new Date();
        if (activeTab === 'upcoming') {
            return list.filter(b => (isAfter(new Date(b.start_date), now) || b.status === 'pending' || b.status === 'confirmed') && b.status !== 'cancelled' && b.status !== 'completed' && b.status !== 'rejected');
        }
        if (activeTab === 'past') {
            return list.filter(b => isBefore(new Date(b.start_date), now) || b.status === 'cancelled' || b.status === 'completed' || b.status === 'rejected');
        }
        return list;
    };

    const filteredBookings = filterBookings(bookings);

    return (
        <div className="space-y-8 ">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <h1 className="text-3xl font-black font-logo text-text-primary tracking-tight mb-2">
                        My Service <span className="text-brand-primary">History</span>
                    </h1>
                    <p className="text-text-secondary font-medium">
                        Track your appointments with veterinary clinics, trainers, and foster homes.
                    </p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    {['upcoming', 'past', 'all'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'bg-brand-primary text-text-inverted shadow-lg shadow-brand-primary/20'
                                : 'text-text-muted hover:text-text-secondary'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : filteredBookings.length > 0 ? (
                <div className="grid gap-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredBookings.map((booking) => {
                            const petImage = booking.pet?.media?.find(m => m.is_primary)?.url || booking.pet?.media?.[0]?.url;
                            const providerImage = booking.provider?.user?.photoURL;

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={booking.id}
                                    className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
                                >
                                    {/* Provider Info with Image */}
                                    <div className="flex items-center gap-4 min-w-[240px]">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-brand-primary shrink-0 overflow-hidden border border-gray-100 shadow-inner">
                                            {providerImage ? (
                                                <img src={providerImage} alt={booking.provider?.business_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <CalendarDays size={28} strokeWidth={1.5} className="opacity-40" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-1">
                                                {booking.provider?.business_name || 'Service Provider'}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-wider border border-gray-100">
                                                    {booking.provider?.category?.name || 'Service'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                    <MapPin size={10} /> {booking.provider?.city}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pet & Time Details - Layout Improvement */}
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                        {/* Pet Slot */}
                                        <div className="flex items-center gap-3 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 border border-white shadow-sm shrink-0">
                                                {petImage ? (
                                                    <img src={petImage} alt={booking.pet?.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                        <PawPrint size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">For Pet</p>
                                                <p className="font-bold text-gray-900 text-sm truncate">{booking.pet?.name || 'The Pet'}</p>
                                            </div>
                                        </div>

                                        {/* DateTime Slot */}
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shrink-0">
                                                <Clock size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Scheduled</p>
                                                <p className="font-bold text-gray-900 text-sm whitespace-nowrap">
                                                    {booking.start_date ? format(new Date(booking.start_date), 'EEE, MMM dd • p') : 'TBD'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price/Duration Slot */}
                                        <div className="hidden lg:flex items-center gap-3 px-1">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                                <DollarSign size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">
                                                    {parseFloat(booking.agreed_price) > 0 ? 'Agreed Price' : 'Duration'}
                                                </p>
                                                <p className="font-bold text-gray-900 text-sm">
                                                    {parseFloat(booking.agreed_price) > 0
                                                        ? `$${booking.agreed_price}`
                                                        : booking.duration_hours > 0
                                                            ? `${Math.round(booking.duration_hours)} hrs`
                                                            : 'Quote Pending'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status & Final Actions */}
                                    <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[180px] justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                                        <BookingStatusBadge status={booking.status} />

                                        <div className="flex gap-2">
                                            {/* Cancel only if pending or upcoming confirmed */}
                                            {(booking.status === 'pending' || (booking.status === 'confirmed' && isAfter(new Date(booking.start_date), new Date()))) && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="p-2.5 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                                                    title="Cancel Booking"
                                                >
                                                    <X size={18} />
                                                </button>
                                            )}
                                            <Link
                                                to={`/services/${booking.provider?.id}`}
                                                className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 transition-all"
                                                title="View Provider"
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                            <button className="p-2.5 rounded-xl border border-text-primary bg-text-primary text-text-inverted hover:bg-brand-primary hover:border-brand-primary transition-all group/btn active:scale-95 shadow-sm">
                                                <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-100 flex flex-col items-center max-w-2xl mx-auto mt-12">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                        <CalendarDays size={48} strokeWidth={1} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No {activeTab} bookings found</h2>
                    <p className="text-gray-500 font-medium mb-8 max-w-sm">
                        {activeTab === 'upcoming'
                            ? "You don't have any appointments scheduled. Your pets are waiting for some care!"
                            : "Your booking history is currently empty."
                        }
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/services'}
                        className="shadow-xl shadow-brand-primary/20 px-10 py-4 scale-110"
                    >
                        Browse Services
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserServiceBookingsPage;
