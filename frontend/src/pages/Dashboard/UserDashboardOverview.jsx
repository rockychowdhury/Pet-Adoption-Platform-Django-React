import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import useServices from '../../hooks/useServices';
import {
    LayoutDashboard,
    Plus,
    PawPrint,
    Search,
    MapPin,
    Users,
    Mail,
    ChevronRight,
    Eye,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    AlertCircle,
    Briefcase,
    ArrowRight,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboardOverview = () => {
    const api = useAPI();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appTab, setAppTab] = useState('received'); // 'received' | 'submitted'

    const { useGetMyProviderProfile } = useServices();
    const { data: providerProfile, isLoading: isProviderLoading } = useGetMyProviderProfile();

    // Redirect based on role
    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin', { replace: true });
        } else if (user?.role === 'service_provider') {
            navigate('/provider/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Only fetch data for regular users (not admins or providers)
    const isRegularUser = user?.role !== 'admin' && user?.role !== 'service_provider';

    // Fetch My Pets
    const { data: myPets = [] } = useQuery({
        queryKey: ['my-pets'],
        queryFn: async () => {
            const res = await api.get('/pets/profiles/');
            return res.data.results || res.data;
        },
        enabled: isRegularUser,
    });

    // Fetch My Listings
    const { data: myListings = [] } = useQuery({
        queryKey: ['my-listings'],
        queryFn: async () => {
            const res = await api.get('/rehoming/my-listings/');
            return res.data.results || res.data;
        },
        enabled: isRegularUser,
    });

    // Fetch Inquiries (Applications)
    const { data: allInquiries = [] } = useQuery({
        queryKey: ['my-inquiries'],
        queryFn: async () => {
            const res = await api.get('/rehoming/inquiries/');
            return res.data.results || res.data;
        },
        enabled: isRegularUser,
    });

    // Fetch Notifications
    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/notifications/');
            return res.data.results || res.data;
        },
        enabled: isRegularUser,
    });

    // Process Listings
    const activeListings = myListings.filter(l => l.status === 'active');

    // Process Inquiries
    // Check serializer: inquiry has 'listing' object (with owner) and 'requester' object.
    const submittedApplications = allInquiries.filter(app => (app.requester_id || app.requester) === user?.id);
    const receivedApplications = allInquiries.filter(app => app.pet_owner_id === user?.id);

    // Process Notifications
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const stats = [
        { label: 'My Pets', value: myPets.length, icon: PawPrint, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
        { label: 'Active Listings', value: activeListings.length, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Apps Received', value: receivedApplications.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Apps Submitted', value: submittedApplications.length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    const quickActions = [
        { label: 'Start Rehoming', icon: Plus, to: '/rehoming/start', desc: 'Create a listing' },
        { label: 'Browse Pets', icon: Search, to: '/pets', desc: 'Find a friend' },
        { label: 'Services', icon: MapPin, to: '/services', desc: 'Find vets & more' },
        { label: 'My Pets', icon: PawPrint, to: '/dashboard/my-pets', desc: 'Manage profiles' },
        { label: 'My Pets', icon: PawPrint, to: '/dashboard/my-pets', desc: 'Manage profiles' },
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'declined':
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'withdrawn': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-8  text-text-primary">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">
                        Welcome back, {user?.first_name || 'Friend'}!
                    </h1>
                    <p className="text-text-secondary font-medium">Here's what's happening with your pets and applications today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-text-secondary bg-bg-secondary px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -2 }}
                        className="bg-bg-surface p-5 rounded-3xl border border-border shadow-sm flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-text-primary">{stat.value}</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Actions */}
                    <div className="bg-bg-surface rounded-[2rem] p-8 border border-border shadow-sm">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                            <LayoutDashboard className="text-brand-primary" size={24} />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {quickActions.map((action, i) => (
                                <Link to={action.to} key={i}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-bg-secondary p-4 rounded-2xl border border-border hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-colors group h-full"
                                    >
                                        <div className="mb-3 w-10 h-10 bg-bg-surface rounded-xl flex items-center justify-center shadow-sm text-text-primary group-hover:text-brand-primary transition-colors">
                                            <action.icon size={20} />
                                        </div>
                                        <div className="font-bold text-text-primary">{action.label}</div>
                                        <div className="text-xs text-text-secondary">{action.desc}</div>
                                    </motion.div>
                                </Link>
                            ))}

                            {/* --- Provider Status or Call to Action --- */}
                            {isProviderLoading ? (
                                <div className="bg-bg-secondary p-4 rounded-2xl border border-border animate-pulse h-full"></div>
                            ) : providerProfile ? (
                                <div className="bg-bg-secondary p-4 rounded-2xl border border-border hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-colors group h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="mb-3 w-10 h-10 bg-bg-surface rounded-xl flex items-center justify-center shadow-sm text-text-primary group-hover:text-brand-primary transition-colors">
                                            {providerProfile.is_verified ? <CheckCircle size={20} /> : <Clock size={20} />}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${providerProfile.is_verified ? 'bg-green-100 text-green-700' :
                                            providerProfile.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {providerProfile.verification_status || 'Draft'}
                                        </span>
                                    </div>

                                    <div className="font-bold text-text-primary relative z-10">Provider Profile</div>
                                    <p className="text-xs text-text-secondary mb-2 relative z-10">
                                        {providerProfile.is_verified
                                            ? "Manage your services and bookings."
                                            : "Your application status."}
                                    </p>

                                    {providerProfile.is_verified ? (
                                        <Link to="/provider/dashboard" className="text-brand-primary font-semibold text-xs hover:underline flex items-center relative z-10">
                                            Go to Dashboard <ArrowRight size={14} className="ml-1" />
                                        </Link>
                                    ) : providerProfile.verification_status === 'draft' ? (
                                        <Link to="/become-provider" className="text-brand-primary font-semibold text-xs hover:underline flex items-center relative z-10">
                                            Resume Application <ArrowRight size={14} className="ml-1" />
                                        </Link>
                                    ) : (
                                        <span className="text-text-secondary text-xs flex items-center relative z-10 cursor-default">
                                            Under Review
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <Link to="/become-provider">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-brand-primary text-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all group h-full relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                        <div className="mb-3 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-sm text-white">
                                            <Briefcase size={20} />
                                        </div>
                                        <div className="font-bold text-white">Become a Provider</div>
                                        <p className="text-brand-accent/90 text-xs mb-2">Offer services & earn money.</p>
                                        <div className="flex items-center font-semibold text-xs">
                                            Get Started <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Active Listings */}
                    <div>
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <PawPrint className="text-brand-primary" size={24} />
                                My Active Listings
                            </h2>
                            <Link to="/dashboard/rehoming?tab=Active" className="text-sm font-bold text-brand-primary hover:underline">View All</Link>
                        </div>

                        {activeListings.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                {activeListings.slice(0, 4).map((listing) => (
                                    <div key={listing.id} className="bg-bg-surface p-4 rounded-3xl border border-border flex gap-4 items-center hover:shadow-md transition-shadow">
                                        <img
                                            src={listing.pet?.main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                                            alt={listing.pet?.name}
                                            className="w-20 h-20 rounded-2xl object-cover bg-bg-secondary"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg truncate">{listing.pet?.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
                                                <span>{listing.pet?.species || 'Pet'}</span>
                                                <span>•</span>
                                                <span>{listing.location_city}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-bg-secondary px-2 py-1 rounded-lg">
                                                    <Eye size={12} /> {listing.view_count || 0}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-bg-secondary px-2 py-1 rounded-lg">
                                                    <Mail size={12} /> {listing.application_count || 0}
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={`/pets/${listing.id}`}>
                                            <button className="p-2 bg-bg-secondary rounded-full hover:bg-bg-surface text-text-primary">
                                                <ChevronRight size={20} />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-bg-surface rounded-3xl p-8 text-center border border-border border-dashed">
                                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                                    <PawPrint size={32} />
                                </div>
                                <h3 className="font-bold text-lg text-text-primary mb-2">No Active Listings</h3>
                                <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
                                    You don't have any pets listed for rehoming right now.
                                </p>
                                <Link to="/rehoming/start">
                                    <button className="px-6 py-2 bg-bg-secondary border border-border text-text-primary font-bold rounded-full text-sm hover:bg-bg-surface transition-colors">
                                        Create a Listing
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-8">

                    {/* Recent Applications */}
                    <div className="bg-bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                                <FileText className="text-brand-primary" size={24} />
                                Recent Activity
                            </h2>
                            <div className="flex bg-bg-secondary p-1 rounded-xl">
                                <button
                                    onClick={() => setAppTab('received')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${appTab === 'received' ? 'bg-bg-surface shadow-sm text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Received
                                </button>
                                <button
                                    onClick={() => setAppTab('submitted')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${appTab === 'submitted' ? 'bg-bg-surface shadow-sm text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Submitted
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[500px] p-2">
                            {(appTab === 'received' ? receivedApplications : submittedApplications).length > 0 ? (
                                <div className="space-y-2">
                                    {(appTab === 'received' ? receivedApplications : submittedApplications).slice(0, 5).map((app) => (
                                        <div key={app.id} className="p-4 rounded-2xl hover:bg-bg-surface transition-colors border border-transparent hover:border-border cursor-pointer group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                                        {appTab === 'received' ? (app.requester_name?.[0] || 'A') : (app.listing_pet_name?.[0] || 'P')}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-text-primary">
                                                            {appTab === 'received' ? `Inquiry for ${app.listing_pet_name}` : `Inquiry for ${app.listing_pet_name}`}
                                                        </h4>
                                                        <p className="text-xs text-text-secondary">
                                                            {appTab === 'received' ? `From ${app.requester_name || 'Adopter'}` : `To Owner`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 text-xs text-text-secondary pl-13">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} /> {new Date(app.created_at).toLocaleDateString()}
                                                </span>
                                                <Link to={`/dashboard/applications/${app.id}`} className="font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                                    <div className="w-12 h-12 bg-bg-surface rounded-full flex items-center justify-center mb-3 text-text-tertiary">
                                        <FileText size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-text-secondary">No inquiries found</p>
                                    <p className="text-xs text-text-tertiary mt-1">
                                        {appTab === 'received' ? "You haven't received any inquiries yet." : "You haven't sent any inquiries yet."}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-border bg-bg-surface/50">
                            <Link to="/dashboard/applications" className="block w-full text-center py-3 bg-bg-surface border border-border rounded-xl text-sm font-bold text-text-primary hover:bg-bg-secondary transition-colors shadow-sm">
                                View All Applications
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDashboardOverview;
