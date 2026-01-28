import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    MessageCircle, Calendar, ChevronRight, User, PawPrint, Inbox, Send, Archive,
    MapPin, Clock, Star, CheckCircle2, Circle, Mail
} from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MyApplicationsPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('received'); // 'received' | 'submitted' | 'archived'

    // Fetch Applications
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

    // Split Applications based on user role in the application
    const { submittedApps, receivedApps, archivedApps } = useMemo(() => {
        if (!user) return { submittedApps: [], receivedApps: [], archivedApps: [] };

        const submitted = [];
        const received = [];
        const archived = [];

        applications.forEach(app => {
            const status = app.application.status;
            // Archived: Withdrawn, Declined (Legacy), Rejected
            if (['withdrawn', 'declined', 'rejected', 'closed'].includes(status)) {
                archived.push(app);
                return;
            }

            if (app.applicant.id === user.id) {
                submitted.push(app);
            } else {
                received.push(app);
            }
        });

        return { submittedApps: submitted, receivedApps: received, archivedApps: archived };
    }, [applications, user]);

    const currentList = activeTab === 'submitted' ? submittedApps :
        activeTab === 'archived' ? archivedApps : receivedApps;

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
                return 'neutral';
            default: return 'neutral';
        }
    };

    const handleEmail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const handleWhatsApp = (phone) => {
        if (!phone) {
            toast.info("No phone number available.");
            return;
        }
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-12 px-4 md:px-8 font-jakarta">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black font-logo text-[#1A1A1A] tracking-tight">Applications</h1>
                    <p className="text-[#5F5F5F] mt-2 text-sm">Review adoption applications you've received or submitted.</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-[#E5E5E5]">
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === 'received'
                            ? 'text-[#1A1A1A]'
                            : 'text-[#8F8F8F] hover:text-[#1A1A1A]'
                            }`}
                    >
                        Received
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'received' ? 'bg-[#1A1A1A] text-white' : 'bg-[#E5E5E5] text-[#5F5F5F]'
                            }`}>
                            {receivedApps.length}
                        </span>
                        {activeTab === 'received' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A]" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('submitted')}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === 'submitted'
                            ? 'text-[#1A1A1A]'
                            : 'text-[#8F8F8F] hover:text-[#1A1A1A]'
                            }`}
                    >
                        Submitted
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'submitted' ? 'bg-[#1A1A1A] text-white' : 'bg-[#E5E5E5] text-[#5F5F5F]'
                            }`}>
                            {submittedApps.length}
                        </span>
                        {activeTab === 'submitted' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A]" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('archived')}
                        className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === 'archived'
                            ? 'text-[#1A1A1A]'
                            : 'text-[#8F8F8F] hover:text-[#1A1A1A]'
                            }`}
                    >
                        Archived
                        {activeTab === 'archived' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A]" />
                        )}
                    </button>
                </div>



                {/* List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin w-8 h-8 border-4 border-[#6B8E7B] border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest text-[#8F8F8F]">Loading Applications...</p>
                        </div>
                    ) : currentList.length > 0 ? (
                        currentList.map((app) => (
                            <div key={app.application.id} className="bg-white rounded-[20px] p-6 border border-[#E5E5E5] shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex flex-col md:flex-row gap-6">

                                    {/* Main Photo (Pet) */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F9F8F6] border border-[#E5E5E5]">
                                        <img
                                            src={app.pet.primary_photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80"}
                                            alt={app.pet.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    {/* Applicant Avatar (Small) */}
                                                    <div className="w-8 h-8 rounded-full bg-[#E5E5E5] overflow-hidden">
                                                        <img src={activeTab === 'submitted' ? app.listing.owner?.photo_url : app.applicant.photo_url} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-black text-[#1A1A1A] uppercase tracking-tight">
                                                            {activeTab === 'submitted' ? app.listing.owner?.full_name || 'Owner' : app.applicant.full_name}
                                                        </h3>
                                                        <p className="text-xs text-[#8F8F8F]">
                                                            Applied for <span className="text-[#1A1A1A] font-bold">{app.pet.name}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#8F8F8F]">
                                                    <span>#{app.application.id}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{app.application.status}</span>
                                                    <span>•</span>
                                                    <span>Received {format(new Date(app.application.submitted_at), 'MMM d, yyyy')}</span>
                                                </div>
                                            </div>

                                            <Badge variant={getStatusVariant(app.application.status)} className="uppercase tracking-widest text-[10px] font-black px-3 py-1.5 rounded-lg">
                                                {app.application.status}
                                            </Badge>
                                        </div>

                                        {/* Tags Row */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <div className="px-3 py-1.5 bg-[#F9F8F6] rounded-full text-[10px] font-bold text-[#5F5F5F] flex items-center gap-1.5">
                                                <MapPin size={12} />
                                                {app.applicant.location.city}, {app.applicant.location.state}
                                            </div>
                                            <div className="px-3 py-1.5 bg-[#F9F8F6] rounded-full text-[10px] font-bold text-[#5F5F5F] flex items-center gap-1.5">
                                                <Clock size={12} />
                                                Urgency: {app.listing.urgency}
                                            </div>
                                            <div className="px-3 py-1.5 bg-[#F9F8F6] rounded-full text-[10px] font-bold text-[#5F5F5F] flex items-center gap-1.5">
                                                <PawPrint size={12} />
                                                {app.pet.species} • {app.pet.gender} • {app.pet.breed}
                                            </div>
                                            <div className="px-3 py-1.5 bg-[#F9F8F6] rounded-full text-[10px] font-bold text-[#5F5F5F] flex items-center gap-1.5">
                                                <Star size={12} />
                                                {app.trust_snapshot.reviews_count} reviews
                                            </div>
                                        </div>

                                        {/* Verification Row */}
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-[#8F8F8F] mb-6 border-t border-[#F5F5F5] pt-3">
                                            <div className={`flex items-center gap-1.5 ${app.trust_snapshot.email_verified ? 'text-[#10B981]' : ''}`}>
                                                {app.trust_snapshot.email_verified ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                                                Email verified
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${app.trust_snapshot.identity_verified ? 'text-[#10B981]' : ''}`}>
                                                {app.trust_snapshot.identity_verified ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                                                Identity {app.trust_snapshot.identity_verified ? 'verified' : 'not verified'}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] text-[#8F8F8F]">Last updated {format(new Date(app.application.last_updated_at), 'MMM d, yyyy')}</p>

                                            <div className="flex gap-3">
                                                {activeTab === 'received' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F9F8F6] gap-2"
                                                        onClick={() => handleWhatsApp(app.applicant.phone)}
                                                    >
                                                        <MessageCircle size={14} /> WhatsApp
                                                    </Button>
                                                )}

                                                <Link to={activeTab === 'received' ? `/applications/${app.application.id}/review` : `/dashboard/applications/${app.application.id}`}>
                                                    <Button
                                                        className="rounded-full h-8 px-5 text-[10px] font-black uppercase tracking-widest bg-[#2E7D32] text-white border-none hover:bg-[#1B5E20] shadow-lg shadow-[#2E7D32]/20"
                                                    >
                                                        Review Application
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[32px] border border-[#E5E5E5]">
                            <div className="w-16 h-16 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-4 text-[#8F8F8F]">
                                {activeTab === 'submitted' ? <Send size={24} /> : <Inbox size={24} />}
                            </div>
                            <h3 className="text-lg font-black text-[#1A1A1A] mb-2">No applications found</h3>
                            <p className="text-[#8F8F8F] text-sm max-w-xs mx-auto">
                                {activeTab === 'submitted'
                                    ? "You haven't submitted any adoption applications yet."
                                    : "You haven't received any new applications."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyApplicationsPage;
