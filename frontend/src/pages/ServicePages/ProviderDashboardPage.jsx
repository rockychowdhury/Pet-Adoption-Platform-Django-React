import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import useServices from '../../hooks/useServices';
import useAuth from '../../hooks/useAuth';

// Components
import DashboardLayout from '../../components/Services/ProviderDashboard/Layout/DashboardLayout';
import DashboardOverview from '../../components/Services/ProviderDashboard/Pages/DashboardOverview';
import BookingsPage from '../../components/Services/ProviderDashboard/Pages/BookingsPage';
import CalendarPage from '../../components/Services/ProviderDashboard/Pages/CalendarPage';
import AvailabilityManager from '../../components/Services/ProviderDashboard/Pages/AvailabilityManager';
import ProfileManager from '../../components/Services/ProviderDashboard/Pages/ProfileManager';
import ReviewsManager from '../../components/Services/ProviderDashboard/Pages/ReviewsManager';
import AnalyticsPage from '../../components/Services/ProviderDashboard/Pages/AnalyticsPage';
import SettingsPage from '../../components/Services/ProviderDashboard/Pages/SettingsPage';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Buttons/Button';
import { User } from 'lucide-react';

const ProviderDashboardPage = () => {
    const { user } = useAuth();
    const { useGetMyProviderProfile, useGetDashboardStats } = useServices();

    // State
    const [activeView, setActiveView] = useState('overview');

    // Data Fetching
    const { data: provider, isLoading: profileLoading } = useGetMyProviderProfile();
    const { data: stats, isLoading: statsLoading } = useGetDashboardStats();

    // Loading State
    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    // Unregistered State
    if (!provider) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Service Provider</h2>
                    <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto">
                        Complete your profile to start offering services like Pet Sitting, Grooming, Training, and Veterinary care.
                    </p>
                    <Link to="/service-provider/register">
                        <Button variant="primary" size="lg">Create Provider Profile</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout
            activeView={activeView}
            onViewChange={setActiveView}
            provider={provider}
        >
            {activeView === 'overview' && (
                <DashboardOverview
                    provider={provider}
                    stats={stats}
                    onNavigate={setActiveView}
                />
            )}

            {activeView === 'bookings' && (
                <BookingsPage provider={provider} />
            )}

            {activeView === 'calendar' && (
                <CalendarPage provider={provider} />
            )}

            {activeView === 'availability' && (
                <AvailabilityManager provider={provider} />
            )}

            {activeView === 'profile' && (
                <ProfileManager provider={provider} />
            )}

            {activeView === 'reviews' && (
                <ReviewsManager provider={provider} />
            )}

            {activeView === 'analytics' && (
                <AnalyticsPage />
            )}

            {activeView === 'settings' && (
                <SettingsPage />
            )}
        </DashboardLayout>
    );
};

export default ProviderDashboardPage;
