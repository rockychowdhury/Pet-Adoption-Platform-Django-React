import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Calendar, ChevronRight, User, PawPrint, Inbox, Send } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import { toast } from 'react-toastify';

const MyApplicationsPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('submitted'); // 'submitted' | 'received'
    const [filter, setFilter] = useState('All');

    // Fetch Applications
    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await api.get('/adoption/applications/');
            return res.data.results || res.data;
        }
    });

    if (error) {
        toast.error("Failed to load applications.");
    }

    // Split Applications
    const { submittedApps, receivedApps } = useMemo(() => {
        if (!user) return { submittedApps: [], receivedApps: [] };

        const submitted = [];
        const received = [];

        applications.forEach(app => {
            if (app.applicant_id === user.id) {
                submitted.push(app);
            } else if (app.pet_owner_id === user.id) {
                received.push(app);
            }
        });

        return { submittedApps: submitted, receivedApps: received };
    }, [applications, user]);

    const currentList = activeTab === 'submitted' ? submittedApps : receivedApps;

    const getStatusVariant = (status) => {
        switch (status) { // Matching backend status choices
            case 'approved_meet_greet': return 'success';
            case 'meet_greet_success': return 'success';
            case 'adopted': return 'success';
            case 'rejected': return 'error';
            case 'returned': return 'error';
            case 'info_requested': return 'info';
            case 'pending_review': return 'warning';
            case 'trial_period': return 'purple'; // Custom variant if supported, else info
            default: return 'neutral';
        }
    };

    const getStatusLabel = (status) => {
        // Transform snake_case to Title Case
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const filteredApps = useMemo(() => {
        if (filter === 'All') return currentList;
        // Simple filter logic - strictly matching status key would be better but keeping simple for UI
        return currentList.filter(app => app.status.includes(filter.toLowerCase().replace(' ', '_')));
    }, [currentList, filter]);

    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4 md:px-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black font-logo text-text-primary tracking-tight">Adoption Applications</h1>
                <p className="text-text-secondary mt-2">Manage your journey to finding or rehoming a pet.</p>
            </div>

            {/* Main Tabs (Submitted vs Received) */}
            <div className="flex p-1 bg-bg-surface border border-border rounded-xl w-full max-w-md mb-8">
                <button
                    onClick={() => { setActiveTab('submitted'); setFilter('All'); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'submitted'
                        ? 'bg-white shadow-sm text-brand-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                        }`}
                >
                    <Send size={16} />
                    Submitted
                    <span className="ml-1 bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full text-xs">
                        {submittedApps.length}
                    </span>
                </button>
                <button
                    onClick={() => { setActiveTab('received'); setFilter('All'); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'received'
                        ? 'bg-white shadow-sm text-brand-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                        }`}
                >
                    <Inbox size={16} />
                    Received
                    <span className="ml-1 bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full text-xs">
                        {receivedApps.length}
                    </span>
                </button>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {['All', 'Pending Review', 'Info Requested', 'Approved', 'Adopted', 'Rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${filter === status
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20 text-text-tertiary">Loading applications...</div>
                ) : filteredApps.length > 0 ? (
                    filteredApps.map(app => (
                        <Link to={`/dashboard/applications/${app.id}`} key={app.id}>
                            <Card className="group hover:border-brand-primary/40 hover:shadow-md transition-all duration-300 mb-4 cursor-pointer">
                                <div className="flex flex-col sm:flex-row p-5 gap-6 items-center">
                                    {/* Pet Image */}
                                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-bg-secondary border border-border">
                                        {app.pet_image ? (
                                            <img src={app.pet_image} alt={app.pet_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                                                <PawPrint size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-text-primary flex items-center justify-center sm:justify-start gap-2">
                                                    {app.pet_name}
                                                    <span className="text-sm font-medium text-text-tertiary">
                                                        ({app.pet_breed || 'Unknown Breed'})
                                                    </span>
                                                </h3>
                                                <p className="text-sm text-text-secondary mt-1 flex items-center justify-center sm:justify-start gap-2">
                                                    {activeTab === 'submitted' ? (
                                                        <>Listed by <span className="font-bold text-text-primary">{app.owner_name}</span></>
                                                    ) : (
                                                        <>Applicant: <span className="font-bold text-text-primary">{app.applicant}</span></>
                                                    )}
                                                </p>
                                            </div>
                                            <Badge variant={getStatusVariant(app.status)} className="self-center md:self-start">
                                                {getStatusLabel(app.status)}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-text-tertiary mt-4 sm:mt-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> Applied {new Date(app.created_at).toLocaleDateString()}
                                            </span>
                                            {activeTab === 'received' && app.readiness_score !== undefined && (
                                                <span className={`flex items-center gap-1 font-bold ${app.readiness_score >= 80 ? 'text-green-600' :
                                                        app.readiness_score >= 50 ? 'text-yellow-600' : 'text-text-tertiary'
                                                    }`}>
                                                    <User size={14} /> Match Score: {app.readiness_score}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 hidden sm:block">
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-20 bg-bg-surface rounded-3xl border border-dashed border-border">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary shadow-sm">
                            {activeTab === 'submitted' ? <Inbox size={32} /> : <PawPrint size={32} />}
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">No applications found</h3>
                        <p className="text-text-secondary text-sm max-w-xs mx-auto mb-6">
                            {activeTab === 'submitted'
                                ? "You haven't submitted any adoption applications yet."
                                : "You haven't received any applications for your pets yet."}
                        </p>
                        {activeTab === 'submitted' && (
                            <Link to="/pets">
                                <Button variant="primary">Browse Pets</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;
