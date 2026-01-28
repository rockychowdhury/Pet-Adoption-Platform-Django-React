import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    MessageCircle, Calendar, ChevronRight, User, PawPrint, Inbox, Send, Archive,
    MapPin, Clock, Star, CheckCircle2, Circle, Mail, Filter, Search, LayoutGrid, List
} from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MyApplicationsPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('adopter'); // 'adopter' | 'owner'

    // Fetch Applications
    // We fetch ALL inquiries related to the user (sent or received)
    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await api.get('/rehoming/inquiries/');
            return res.data.results || res.data;
        }
    });

    if (error) {
        toast.error("Failed to load applications.");
    }

    // Split & Group Data
    const { submittedApps, receivedGroups } = useMemo(() => {
        if (!user) return { submittedApps: [], receivedGroups: [] };

        const submitted = [];
        const receivedMap = {};

        applications.forEach(app => {
            // Adopter View: Apps I SENT
            if (app.applicant.id === user.id) {
                submitted.push(app);
            }
            // Owner View: Apps I RECEIVED
            else if (app.listing.owner?.id === user.id || app.listing.owner === user.id) { // Handle object or ID
                const listingId = app.listing.id;
                if (!receivedMap[listingId]) {
                    receivedMap[listingId] = {
                        listing: app.listing,
                        pet: app.pet,
                        applications: [],
                        pendingCount: 0
                    };
                }
                receivedMap[listingId].applications.push(app);
                if (['pending_review', 'pending'].includes(app.application.status)) {
                    receivedMap[listingId].pendingCount++;
                }
            }
        });

        // Convert map to array and sort by urgency/recent
        const groups = Object.values(receivedMap).sort((a, b) => {
            return b.pendingCount - a.pendingCount; // Most pending first
        });

        return { submittedApps: submitted, receivedGroups: groups };
    }, [applications, user]);


    const getStatusVariant = (status) => {
        switch (status) {
            case 'accepted':
            case 'approved_meet_greet':
            case 'adopted':
                return 'success';
            case 'pending':
            case 'pending_review':
                return 'warning';
            case 'declined':
            case 'rejected':
                return 'error';
            case 'withdrawn':
            case 'closed':
                return 'neutral';
            default: return 'neutral';
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header & Toggle */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">My Applications</h1>
                        <p className="text-text-secondary font-medium">Manage adoption requests and listings.</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="bg-bg-surface p-1.5 rounded-full border border-border shadow-sm flex items-center gap-1">
                        <button
                            onClick={() => setViewMode('adopter')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${viewMode === 'adopter'
                                ? 'bg-brand-primary text-text-inverted shadow-md'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                }`}
                        >
                            I'm an Adopter
                        </button>
                        <button
                            onClick={() => setViewMode('owner')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${viewMode === 'owner'
                                ? 'bg-brand-primary text-text-inverted shadow-md'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                }`}
                        >
                            I'm an Owner
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest text-text-tertiary">Loading Applications...</p>
                    </div>
                ) : (
                    <>
                        {/* ================= ADOPTER VIEW ================= */}
                        {viewMode === 'adopter' && (
                            <div className="space-y-6">
                                {submittedApps.length > 0 ? (
                                    submittedApps.map(app => (
                                        <div key={app.application.id} className="bg-bg-surface rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Pet Image */}
                                                <div className="w-full md:w-48 h-48 md:h-auto rounded-2xl overflow-hidden bg-bg-secondary shrink-0 relative">
                                                    <img
                                                        src={app.pet.primary_photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80"}
                                                        alt={app.pet.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <Badge variant={getStatusVariant(app.application.status)} className="px-2.5 py-1 text-[10px] uppercase font-black tracking-widest backdrop-blur-md shadow-sm">
                                                            {app.application.status.replace(/_/g, ' ')}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="text-2xl font-black text-text-primary">{app.pet.name}</h3>
                                                            <p className="text-text-secondary text-sm font-medium">{app.pet.breed} • {app.pet.age_display || 'Age N/A'}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-text-tertiary bg-bg-secondary px-3 py-1 rounded-full">
                                                            ID #{app.application.id}
                                                        </span>
                                                    </div>


                                                    <div className="grid grid-cols-2 gap-4 my-4 p-4 bg-bg-secondary/50 rounded-2xl border border-border/50">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-0.5">Application Date</p>
                                                            <p className="text-sm font-bold text-text-primary">{format(new Date(app.application.submitted_at), 'MMM d, yyyy')}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-0.5">Last Update</p>
                                                            <p className="text-sm font-bold text-text-primary">{format(new Date(app.application.last_updated_at), 'MMM d')}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-bg-secondary overflow-hidden">
                                                                <img src={app.listing.owner?.photo_url} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-xs font-bold text-text-secondary">Owner: {app.listing.owner?.full_name}</span>
                                                        </div>

                                                        <Link to={`/dashboard/applications/${app.application.id}`}>
                                                            <Button className="rounded-full px-6 py-2 bg-text-primary text-text-inverted text-xs font-black uppercase tracking-widest hover:bg-black hover:scale-105 transition-all">
                                                                View details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-24 bg-bg-surface rounded-[32px] border border-border">
                                        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                                            <Send size={24} />
                                        </div>
                                        <h3 className="text-lg font-black text-text-primary mb-2">No adoption requests</h3>
                                        <p className="text-text-tertiary text-sm">You haven't submitted any applications yet.</p>
                                        <Link to="/pets" className="inline-block mt-4">
                                            <Button variant="primary">Browse Pets</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ================= OWNER VIEW ================= */}
                        {viewMode === 'owner' && (
                            <div className="space-y-6">
                                {receivedGroups.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6">
                                        {receivedGroups.map(group => (
                                            <div key={group.listing.id} className="bg-bg-surface rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all">
                                                <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-start">

                                                    {/* 1. Pet Info */}
                                                    <div className="flex items-center gap-6 w-full xl:w-1/3 xl:border-r border-border xl:pr-8 pb-8 xl:pb-0 border-b xl:border-b-0">
                                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-bg-secondary shrink-0 shadow-sm">
                                                            <img
                                                                src={group.pet.primary_photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80"}
                                                                alt={group.pet.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-2xl font-black text-text-primary tracking-tight">{group.pet.name}</h3>
                                                            </div>
                                                            <p className="text-sm text-text-secondary font-medium mb-3">{group.pet.breed}</p>
                                                            <Badge variant={group.listing.status === 'active' ? 'success' : 'neutral'} className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5">
                                                                {group.listing.status}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* 2. Stats Grid */}
                                                    <div className="flex-1 w-full xl:w-auto">
                                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                                            {/* Stat 1: Total */}
                                                            <div className="flex flex-col items-center justify-center p-4 bg-bg-secondary/30 rounded-2xl border border-transparent hover:border-border transition-colors">
                                                                <span className="text-3xl font-black text-text-primary">{group.applications.length}</span>
                                                                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mt-1">Total Apps</span>
                                                            </div>

                                                            {/* Stat 2: Pending (Highlighted) */}
                                                            <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-colors ${group.pendingCount > 0 ? 'bg-orange-50 border-orange-100' : 'bg-bg-secondary/30 border-transparent hover:border-border'}`}>
                                                                <span className={`text-3xl font-black ${group.pendingCount > 0 ? 'text-orange-600' : 'text-text-tertiary'}`}>{group.pendingCount}</span>
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${group.pendingCount > 0 ? 'text-orange-600' : 'text-text-tertiary'}`}>Pending Review</span>
                                                            </div>

                                                            {/* Stat 3: Listed Date */}
                                                            <div className="flex flex-col items-center justify-center p-4 bg-bg-secondary/30 rounded-2xl border border-transparent hover:border-border transition-colors">
                                                                <span className="text-lg font-bold text-text-primary mt-1">
                                                                    {group.listing.created_at ? format(new Date(group.listing.created_at), 'MMM d, yyyy') : 'N/A'}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mt-2">Listed On</span>
                                                            </div>
                                                        </div>

                                                        {/* 3. Actions Row */}
                                                        <div className="flex items-center justify-between gap-4">
                                                            {/* Applicant Faces */}
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex -space-x-3">
                                                                    {group.applications.slice(0, 5).map((app, i) => (
                                                                        <div key={app.application.id} className="w-10 h-10 rounded-full border-2 border-bg-surface overflow-hidden bg-bg-secondary relative z-10 hover:z-20 transition-all hover:scale-110 shadow-sm" title={app.applicant.full_name}>
                                                                            <img src={app.applicant.photo_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" className="w-full h-full object-cover" />
                                                                        </div>
                                                                    ))}
                                                                    {group.applications.length > 5 && (
                                                                        <div className="w-10 h-10 rounded-full border-2 border-bg-surface bg-bg-secondary flex items-center justify-center text-xs font-bold text-text-secondary relative z-0">
                                                                            +{group.applications.length - 5}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {group.pendingCount > 0 && <span className="text-xs font-bold text-orange-600 animate-pulse">• Action Needed</span>}
                                                            </div>

                                                            {/* CTA */}
                                                            <Link to={`/rehoming/listings/${group.listing.id}/applications`}>
                                                                <Button className="rounded-full h-12 px-8 bg-text-primary text-text-inverted hover:bg-black hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group">
                                                                    <span className="text-xs font-black uppercase tracking-widest">Review Applications</span>
                                                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-bg-surface rounded-[32px] border border-border">
                                        <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-text-tertiary">
                                            <Inbox size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">No incoming applications</h3>
                                        <p className="text-text-secondary font-medium max-w-md mx-auto">
                                            Once adopters apply for your pets, they will appear here grouped by listing.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;
