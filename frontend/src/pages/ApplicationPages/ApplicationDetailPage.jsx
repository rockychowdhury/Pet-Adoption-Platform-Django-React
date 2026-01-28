import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    ChevronLeft, Calendar, CheckCircle, MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';

const ApplicationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useAPI();

    // Parse Date/Time from owner_notes if available
    const getMeetGreetDetails = (notes) => {
        if (!notes) return null;
        const match = notes.match(/\[SCHEDULED: (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})\]/);
        if (match) {
            return {
                date: match[1],
                time: match[2],
                message: notes.replace(match[0], '').trim()
            };
        }
        return { message: notes, date: null, time: null };
    };

    const { data: fullApplication, isLoading, error } = useQuery({
        queryKey: ['application', id],
        queryFn: async () => {
            const res = await api.get(`/rehoming/inquiries/${id}/`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-[#1A1A1A] border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-[#8F8F8F] font-medium">Loading application...</p>
                </div>
            </div>
        );
    }

    if (error || !fullApplication) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-bold text-lg">Application not found</p>
                    <Button onClick={() => navigate('/dashboard/applications')} className="mt-4">
                        Back to Applications
                    </Button>
                </div>
            </div>
        );
    }

    const application = fullApplication.application;
    const pet = fullApplication.pet;
    const applicant = fullApplication.applicant;
    const listing = fullApplication.listing;
    const trust = fullApplication.trust_snapshot;
    const appMessage = fullApplication.application_message;

    const meetDetails = getMeetGreetDetails(application.owner_notes);

    const StatusTimeline = () => {
        const steps = [
            { status: 'pending_review', label: 'Under Review' },
            { status: 'approved_meet_greet', label: 'Meet & Greet' },
            { status: 'adopted', label: 'Adopted' }
        ];

        const getStepIndex = (status) => {
            const index = steps.findIndex(s => s.status === status);
            return index !== -1 ? index : 0;
        };

        const currentStepIndex = getStepIndex(application.status);
        const isRejected = application.status === 'rejected';

        return (
            <div className="flex items-center justify-between relative mb-8 px-4">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-[#E5E5E5] -z-10" />
                {steps.map((step, idx) => {
                    const isActive = !isRejected && currentStepIndex >= idx;
                    const isCurrent = application.status === step.status;

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 bg-white px-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive
                                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg'
                                    : 'bg-white border-[#E5E5E5] text-[#E5E5E5]'
                                }`}>
                                {isActive ? (
                                    <CheckCircle size={20} strokeWidth={2.5} />
                                ) : (
                                    <div className="w-2.5 h-2.5 rounded-full bg-current" />
                                )}
                            </div>
                            <span className={`text-xs font-bold ${isCurrent ? 'text-[#1A1A1A]' : 'text-[#8F8F8F]'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-8 px-4 font-jakarta">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Button
                    onClick={() => navigate('/dashboard/applications')}
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent text-[#8F8F8F] hover:text-[#1A1A1A]"
                >
                    <ChevronLeft size={20} className="mr-1" /> Back to Applications
                </Button>

                {/* Main Card */}
                <div className="bg-white rounded-[32px] border border-[#E5E5E5] overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="p-8 border-b border-[#E5E5E5]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                                {pet.primary_photo ? (
                                    <img
                                        src={pet.primary_photo}
                                        alt={pet.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#E5E5E5]">
                                        <Calendar size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-black text-[#1A1A1A] mb-1">
                                    Application for {pet.name}
                                </h1>
                                <p className="text-[#5F5F5F] text-sm">
                                    Status: <span className="font-bold text-[#1A1A1A] uppercase tracking-wide">
                                        {application.status.replace(/_/g, ' ')}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <StatusTimeline />
                    </div>

                    {/* Meet & Greet Highlight */}
                    {application.status === 'approved_meet_greet' && meetDetails && meetDetails.date && (
                        <div className="mx-8 mt-8 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-6">
                            <h3 className="text-[#166534] font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <Calendar size={16} /> Meet & Greet Scheduled
                            </h3>
                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-[#166534] uppercase tracking-wider opacity-70 mb-1">Date</p>
                                    <p className="text-xl font-black text-[#15803d]">
                                        {format(new Date(meetDetails.date), 'M/dd/yyyy')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#166534] uppercase tracking-wider opacity-70 mb-1">Time</p>
                                    <p className="text-xl font-black text-[#15803d]">
                                        {meetDetails.time}
                                    </p>
                                </div>
                            </div>
                            {meetDetails.message && (
                                <div className="pt-4 border-t border-[#DCFCE7]">
                                    <p className="text-[#15803d] text-sm leading-relaxed">{meetDetails.message}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                        {/* Left Column - Application Message */}
                        <div className="lg:col-span-2">
                            <Card className="p-6 bg-white border border-[#E5E5E5] rounded-2xl">
                                <h2 className="text-sm font-black uppercase tracking-widest text-[#8F8F8F] mb-4 flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    Application Message
                                </h2>
                                <div className="prose prose-stone max-w-none">
                                    <p className="text-[#5F5F5F] leading-relaxed whitespace-pre-wrap text-sm">
                                        {appMessage.intro_message}
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column - Application Info */}
                        <div>
                            <Card className="p-6 bg-[#FAFAFA] border border-[#E5E5E5] rounded-2xl">
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#8F8F8F] mb-6">
                                    Application Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-[#8F8F8F] uppercase tracking-wider mb-1">
                                            Applied On
                                        </p>
                                        <p className="text-[#1A1A1A] font-bold">
                                            {format(new Date(application.submitted_at), 'M/dd/yyyy')}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold text-[#8F8F8F] uppercase tracking-wider mb-2">
                                            Applicant Verified
                                        </p>
                                        <Badge
                                            variant={trust.identity_verified ? 'success' : 'neutral'}
                                            className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5"
                                        >
                                            {trust.identity_verified ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>

                                    {application.rejection_reason && (
                                        <div className="pt-4 border-t border-[#E5E5E5]">
                                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">
                                                Rejection Reason
                                            </p>
                                            <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg leading-relaxed">
                                                {application.rejection_reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;
