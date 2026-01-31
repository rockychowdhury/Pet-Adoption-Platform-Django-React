import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    DollarSign,
    Star,
    User,
    ShieldCheck,
    Plus,
    UserPlus,
    Image,
    Edit,
    FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../common/Buttons/Button'; // Corrected path to src/components/common
import StatsCard from '../components/StatsCard';
import QuickActionCard from '../components/QuickActionCard';
import RecentBookingsTable from '../components/RecentBookingsTable';
import RecentReviewsList from '../components/RecentReviewsList';

const DashboardOverview = ({ provider, stats, onNavigate }) => {
    // Use stats directly
    const totalBookings = stats?.total_bookings || 0;
    const pendingBookings = stats?.pending_bookings || 0;
    const earnings = stats?.this_month?.earnings || 0;
    const rating = stats?.rating || 0;
    const todaySchedule = stats?.today_schedule || []; // Assuming backend provides this, or use similar logic

    const handleQuickAction = (action) => {
        // Map actions to navigation or modals
        switch (action) {
            case 'new_booking':
                // Open new booking modal or navigate
                break;
            case 'availability':
                onNavigate('calender'); // Assuming calendar/availability view
                break;
            case 'edit_profile':
                onNavigate('profile');
                break;
            default:
                break;
        }
    };

    const businessName = provider?.business_name || provider?.user?.first_name || 'Provider';

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {businessName}!</h1>
                    <p className="text-gray-500 text-sm mt-1">Here's what's happening with your business today.</p>
                </div>
                <Button variant="primary" className="bg-teal-600 hover:bg-teal-700 text-white shadow-soft">
                    New Booking
                </Button>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Verification Status"
                    badge={provider?.verification_status === 'verified' ? "Verified Business" : "Pending Verification"}
                    badgeColor={provider?.verification_status === 'verified' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                    subtext={provider?.verification_status === 'verified' ? "Your profile is fully visible" : "Complete steps to go live"}
                    subtextClass="text-gray-500"
                    icon={ShieldCheck}
                    iconColor={provider?.verification_status === 'verified' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}
                />
                <StatsCard
                    title="Active Bookings"
                    value={totalBookings}
                    actionLabel="View all bookings"
                    onClick={() => onNavigate('bookings')}
                    icon={Calendar}
                    iconColor="bg-blue-50 text-blue-600"
                />
                <StatsCard
                    title="Pending Reviews"
                    value={stats?.pending_reviews_count || 0}
                    actionLabel="Respond now"
                    onClick={() => onNavigate('reviews')}
                    icon={Star} // Or MessageSquare
                    iconColor="bg-yellow-50 text-yellow-600"
                />
                <StatsCard
                    title="Revenue (Month)"
                    value={`$${earnings.toLocaleString()}`}
                    subtext="vs last month"
                    subtextClass="text-green-600"
                    icon={DollarSign}
                    iconColor="bg-gray-100 text-gray-600"
                />
            </div>

            {/* 3. Today's Schedule */}
            {stats?.today_schedule && stats.today_schedule.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Today's Schedule</h3>
                        <p className="text-sm text-gray-500">
                            Open • {provider?.hours?.[0]?.open_time || '08:00 AM'} - {provider?.hours?.[0]?.close_time || '08:00 PM'}
                        </p>
                    </div>

                    <div className="flex-1 w-full md:w-auto">
                        <div className="bg-blue-50/50 rounded-lg p-3 flex items-center gap-4 border border-blue-100">
                            <div className="flex-1">
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-0.5">NEXT APPOINTMENT IN 15 MIN</div>
                                <div className="font-semibold text-gray-900 text-sm">
                                    {stats.today_schedule[0].client?.first_name} ({stats.today_schedule[0].pet?.species || 'Pet'}) - {stats.today_schedule[0].service_option?.name || 'Service'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => onNavigate('calendar')}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            View Calendar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Today's Schedule</h3>
                        <p className="text-sm text-gray-500">
                            Open • {provider?.hours?.[0]?.open_time || '08:00 AM'} - {provider?.hours?.[0]?.close_time || '08:00 PM'}
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => onNavigate('calendar')}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            View Calendar
                        </button>
                    </div>
                </div>
            )}

            {/* 4. Quick Actions */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <QuickActionCard icon={Plus} title="New Booking" onClick={() => handleQuickAction('new_booking')} />
                    <QuickActionCard icon={Clock} title="Availability" onClick={() => handleQuickAction('availability')} />
                    <QuickActionCard icon={UserPlus} title="Add Client" onClick={() => handleQuickAction('add_client')} />
                    <QuickActionCard icon={Image} title="Upload Photos" onClick={() => handleQuickAction('upload_photos')} />
                    <QuickActionCard icon={Edit} title="Edit Profile" onClick={() => handleQuickAction('edit_profile')} />
                    <QuickActionCard icon={FileText} title="Reports" onClick={() => handleQuickAction('reports')} />
                </div>
            </section>

            {/* 5. Bookings & Reviews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentBookingsTable
                        bookings={stats?.recent_bookings} // Pass real data if avail
                        onManage={(id) => onNavigate('bookings')}
                    />
                </div>
                <div className="lg:col-span-1">
                    <RecentReviewsList
                        reviews={stats?.recent_reviews} // Pass real data if avail
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
