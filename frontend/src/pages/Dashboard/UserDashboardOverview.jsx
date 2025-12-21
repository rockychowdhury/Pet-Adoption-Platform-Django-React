
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
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
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboardOverview = () => {
    const api = useAPI();
    const { user } = useAuth();
    const [appTab, setAppTab] = useState('received'); // 'received' | 'submitted'

    // Fetch Active Listings
    const { data: activeListings = [] } = useQuery({
        queryKey: ['my-active-listings'],
        queryFn: async () => {
            const res = await api.get('/pets/?owner=me&status=active');
            return res.data.results || res.data;
        }
    });

    // Fetch Applications
    const { data: allApplications = [] } = useQuery({
        queryKey: ['my-applications'],
        queryFn: async () => {
            const res = await api.get('/adoption/applications/');
            return res.data.results || res.data;
        }
    });

    // Filter Applications
    const receivedApps = allApplications.filter(app => app.pet_owner_id === user?.id || app.pet_owner === user?.id || (app.pet_details && app.pet_details.owner === user?.id)); // Adjusting for likely API response structure, assuming backend logic
    // Actually, based on previous ViewSet: "filter(models.Q(applicant=user) | models.Q(pet__pet_owner=user))"
    // So we need to separate them on client.
    // If I am the applicant, it's 'submitted'. If I am the pet owner, it's 'received'.

    // Logic: if app.applicant === user.id -> Submitted. Else -> Received.
    const submittedApplications = allApplications.filter(app => app.applicant === user?.id || app.applicant_id === user?.id);
    const receivedApplications = allApplications.filter(app => (app.applicant !== user?.id && app.applicant_id !== user?.id));

    const stats = [
        { label: 'Active Listings', value: activeListings.length, icon: PawPrint, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
        { label: 'Apps Received', value: receivedApplications.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Apps Submitted', value: submittedApplications.length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Unread Messages', value: 0, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100' }, // Placeholder
    ];

    const quickActions = [
        { label: 'Create Listing', icon: Plus, to: '/dashboard/rehoming/create', desc: 'Rehome a pet' },
        { label: 'My Pets', icon: PawPrint, to: '/dashboard/my-pets', desc: 'Manage profiles' },
        { label: 'Browse Pets', icon: Search, to: '/pets', desc: 'Find a friend' },
        { label: 'Services', icon: MapPin, to: '/services', desc: 'Find vets & more' },
        { label: 'Community', icon: Users, to: '/community', desc: 'Join discussions' },
        { label: 'Messages', icon: Mail, to: '/dashboard/messages', desc: 'View inbox' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto p-6 md:p-8 font-jakarta text-text-primary">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <h1 className="text-3xl font-black font-logo text-text-primary tracking-tight mb-2">
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
                        className="bg-white p-5 rounded-3xl border border-border shadow-sm flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="text-2xl font-black font-logo text-text-primary">{stat.value}</div>
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
                    <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm">
                        <h2 className="text-xl font-black font-logo mb-6 flex items-center gap-2">
                            <LayoutDashboard className="text-brand-primary" size={24} />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {quickActions.map((action, i) => (
                                <Link to={action.to} key={i}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-bg-surface p-4 rounded-2xl border border-border hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-colors group h-full"
                                    >
                                        <div className="mb-3 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-text-primary group-hover:text-brand-primary transition-colors">
                                            <action.icon size={20} />
                                        </div>
                                        <div className="font-bold text-text-primary">{action.label}</div>
                                        <div className="text-xs text-text-secondary">{action.desc}</div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Active Listings */}
                    <div>
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h2 className="text-xl font-black font-logo flex items-center gap-2">
                                <PawPrint className="text-brand-primary" size={24} />
                                My Active Listings
                            </h2>
                            <Link to="/dashboard/my-pets" className="text-sm font-bold text-brand-primary hover:underline">View All</Link>
                        </div>

                        {activeListings.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                {activeListings.slice(0, 4).map((pet) => (
                                    <div key={pet.id} className="bg-white p-4 rounded-3xl border border-border flex gap-4 items-center hover:shadow-md transition-shadow">
                                        <img
                                            src={pet.images?.[0]?.image || 'https://via.placeholder.com/150'}
                                            alt={pet.pet_name}
                                            className="w-20 h-20 rounded-2xl object-cover bg-bg-secondary"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg truncate">{pet.pet_name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
                                                <span>{pet.breed || 'Mixed'}</span>
                                                <span>•</span>
                                                <span>{pet.age_months}mo</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-bg-surface px-2 py-1 rounded-lg">
                                                    <Eye size={12} /> {pet.views || 0}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-medium text-text-secondary bg-bg-surface px-2 py-1 rounded-lg">
                                                    <Mail size={12} /> {pet.applications_count || 0}
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={`/pets/${pet.id}`}>
                                            <button className="p-2 bg-bg-surface rounded-full hover:bg-bg-secondary text-text-primary">
                                                <ChevronRight size={20} />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-bg-surface rounded-3xl p-8 text-center border border-border border-dashed">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                                    <PawPrint size={32} />
                                </div>
                                <h3 className="font-bold text-lg text-text-primary mb-2">No Active Listings</h3>
                                <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
                                    You don't have any pets listed for rehoming right now.
                                </p>
                                <Link to="/dashboard/rehoming/create">
                                    <button className="px-6 py-2 bg-white border border-border text-text-primary font-bold rounded-full text-sm hover:bg-bg-secondary transition-colors">
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
                    <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-black font-logo mb-4 flex items-center gap-2">
                                <FileText className="text-brand-primary" size={24} />
                                Recent Activity
                            </h2>
                            <div className="flex bg-bg-surface p-1 rounded-xl">
                                <button
                                    onClick={() => setAppTab('received')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${appTab === 'received' ? 'bg-white shadow-sm text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Received
                                </button>
                                <button
                                    onClick={() => setAppTab('submitted')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${appTab === 'submitted' ? 'bg-white shadow-sm text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
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
                                                        {appTab === 'received' ? (app.applicant_name?.[0] || 'A') : (app.pet_name?.[0] || 'P')}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-text-primary">
                                                            {appTab === 'received' ? `Review for ${app.pet_name}` : `App for ${app.pet_name}`}
                                                        </h4>
                                                        <p className="text-xs text-text-secondary">
                                                            {appTab === 'received' ? `From ${app.applicant_name || 'Applicant'}` : `To ${app.owner_name || 'Owner'}`}
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
                                    <p className="text-sm font-bold text-text-secondary">No applications found</p>
                                    <p className="text-xs text-text-tertiary mt-1">
                                        {appTab === 'received' ? "You haven't received any adopter applications yet." : "You haven't submitted any adoption applications yet."}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-border bg-bg-surface/50">
                            <Link to="/dashboard/applications" className="block w-full text-center py-3 bg-white border border-border rounded-xl text-sm font-bold text-text-primary hover:bg-bg-secondary transition-colors shadow-sm">
                                View All Applications
                            </Link>
                        </div>
                    </div>

                    {/* Pending Messages Placeholder */}
                    <div className="bg-brand-secondary/5 rounded-[2rem] p-6 border border-brand-secondary/10 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-lg font-black font-logo mb-2 text-brand-secondary-dark flex items-center gap-2">
                                <MessageSquare size={20} />
                                Need Help?
                            </h2>
                            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                                Join our community forum to get advice from experienced pet owners and fosters.
                            </p>
                            <Link to="/community">
                                <button className="px-5 py-2 bg-white text-brand-secondary-dark font-bold rounded-full text-xs shadow-sm hover:shadow-md transition-shadow">
                                    Visit Community
                                </button>
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDashboardOverview;
