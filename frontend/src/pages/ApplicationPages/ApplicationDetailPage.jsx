import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ChevronLeft, Calendar, User, Mail, Phone, MapPin,
    CheckCircle, XCircle, Clock, MessageSquare, AlertTriangle,
    Home, Briefcase, Dog, Heart
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import Modal from '../../components/common/Modal';

const ApplicationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useAPI();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Modal States
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve_meet', 'reject', 'withdraw'
    const [actionNote, setActionNote] = useState('');

    const { data: application, isLoading, error } = useQuery({
        queryKey: ['application', id],
        queryFn: async () => {
            const res = await api.get(`/adoption/applications/${id}/`);
            return res.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ status, notes, rejection_reason }) => {
            return await api.post(`/adoption/applications/${id}/update_status/`, {
                status,
                owner_notes: notes,
                rejection_reason
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['application', id]);
            toast.success("Status updated successfully");
            setIsActionModalOpen(false);
            setActionNote('');
        },
        onError: () => toast.error("Failed to update status")
    });

    if (isLoading) return <div className="p-12 text-center">Loading details...</div>;
    if (error || !application) return <div className="p-12 text-center text-red-500">Application not found.</div>;

    const isOwner = application.pet_owner_id === user?.id;
    const isApplicant = application.applicant_id === user?.id;

    const handleActionSubmit = () => {
        if (actionType === 'reject') {
            updateStatusMutation.mutate({ status: 'rejected', rejection_reason: actionNote });
        } else if (actionType === 'approve_meet') {
            // Usually this would be a schedule event, but simplified for now
            updateStatusMutation.mutate({ status: 'approved_meet_greet', notes: actionNote });
        } else if (actionType === 'adopted') {
            updateStatusMutation.mutate({ status: 'adopted', notes: actionNote });
        }
    };

    const StatusTimeline = () => {
        const steps = [
            { status: 'pending_review', label: 'Under Review' },
            { status: 'info_requested', label: 'Info Requested' },
            { status: 'approved_meet_greet', label: 'Meet & Greet' },
            { status: 'adopted', label: 'Adopted' }
        ];

        const currentIdx = steps.findIndex(s => s.status === application.status) !== -1
            ? steps.findIndex(s => s.status === application.status)
            : (application.status === 'rejected' ? -1 : 0);

        return (
            <div className="flex items-center justify-between relative mb-8 px-4">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                {steps.map((step, idx) => {
                    // Logic is simplified; if rejected, show red X. If matched, green check.
                    let isActive = currentIdx >= idx;
                    let isCurrent = application.status === step.status;

                    if (application.status === 'rejected') isActive = false;

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 bg-bg-primary px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-gray-300 text-gray-300'
                                }`}>
                                {isActive ? <CheckCircle size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                            </div>
                            <span className={`text-xs font-bold ${isCurrent ? 'text-brand-primary' : 'text-text-tertiary'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-bg-secondary/30 py-8 px-4 font-sans text-text-primary">
            <div className="max-w-5xl mx-auto">
                <Button onClick={() => navigate('/dashboard/applications')} variant="ghost" className="mb-6 pl-0 hover:bg-transparent">
                    <ChevronLeft size={20} className="mr-1" /> Back to Application List
                </Button>

                {/* Header Card */}
                <Card className="p-6 mb-6 border-l-4 border-l-brand-primary shadow-sm bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                                {application.pet_image ? (
                                    <img src={application.pet_image} alt="Pet" className="w-full h-full object-cover" />
                                ) : (
                                    <PawPrint className="m-auto text-gray-300" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black font-logo text-text-primary">
                                    Application for {application.pet_name}
                                </h1>
                                <p className="text-text-secondary font-medium">
                                    Status: <span className="font-bold text-brand-primary uppercase tracking-wide">{application.status.replace('_', ' ')}</span>
                                </p>
                            </div>
                        </div>

                        {/* Actions for Owner */}
                        {isOwner && application.status === 'pending_review' && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                    onClick={() => { setActionType('reject'); setIsActionModalOpen(true); }}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => { setActionType('approve_meet'); setIsActionModalOpen(true); }}
                                >
                                    Request Meet & Greet
                                </Button>
                            </div>
                        )}

                        {isOwner && application.status === 'approved_meet_greet' && (
                            <Button variant="primary" onClick={() => { setActionType('adopted'); setIsActionModalOpen(true); }}>
                                Mark as Adopted
                            </Button>
                        )}
                    </div>

                    <div className="mt-8">
                        <StatusTimeline />
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Application Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Message */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <MessageSquare size={20} className="text-brand-primary" />
                                Personal Message
                            </h2>
                            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {application.message}
                            </p>
                        </Card>

                        {/* Adopter Profile Snapshot (Visible to Owner, or Applicant's own view) */}
                        {application.adopter_profile ? (
                            <Card className="p-6">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <User size={20} className="text-brand-primary" />
                                    Adopter Profile Snapshot
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Home className="text-gray-400 mt-1" size={18} />
                                            <div>
                                                <p className="text-xs text-text-tertiary uppercase font-bold">Living Situation</p>
                                                <p className="font-medium capitalize">{application.adopter_profile.housing_type} • {application.adopter_profile.own_or_rent}</p>
                                                <p className="text-sm text-text-secondary capitalize">{application.adopter_profile.yard_type.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Briefcase className="text-gray-400 mt-1" size={18} />
                                            <div>
                                                <p className="text-xs text-text-tertiary uppercase font-bold">Lifestyle</p>
                                                <p className="font-medium">{application.adopter_profile.work_schedule}</p>
                                                <p className="text-sm text-text-secondary">Activity Lvl: {application.adopter_profile.activity_level}/5</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Dog className="text-gray-400 mt-1" size={18} />
                                            <div>
                                                <p className="text-xs text-text-tertiary uppercase font-bold">Experience</p>
                                                <p className="font-medium">
                                                    Pets: {application.adopter_profile.current_pets?.length || 0}
                                                </p>
                                                <p className="text-sm text-text-secondary">
                                                    {Object.entries(application.adopter_profile.pet_experience || {}).map(([k, v]) => `${k} (${v}y)`).join(', ')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Heart className="text-gray-400 mt-1" size={18} />
                                            <div>
                                                <p className="text-xs text-text-tertiary uppercase font-bold">Why Adopt?</p>
                                                <p className="text-sm text-text-secondary line-clamp-3">
                                                    {application.adopter_profile.why_adopt}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-6 bg-gray-50 border-dashed text-center text-text-secondary">
                                No profile snapshot available.
                            </Card>
                        )}

                    </div>

                    {/* Right Column: Key Info & Actions */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card className="p-6 bg-brand-primary/5 border-brand-primary/10">
                            <h3 className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-4">Application Info</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Applied On</span>
                                    <span className="font-bold">{new Date(application.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Match Score</span>
                                    <Badge variant={application.readiness_score > 70 ? 'success' : 'warning'}>
                                        {application.readiness_score}%
                                    </Badge>
                                </div>
                                {application.rejection_reason && (
                                    <div className="pt-4 border-t border-brand-primary/10">
                                        <span className="text-xs font-bold text-red-600 uppercase block mb-1">Rejection Reason</span>
                                        <p className="text-sm text-red-700 bg-red-50 p-2 rounded-lg">
                                            {application.rejection_reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                    </div>
                </div>
            </div>

            {/* Action Modal */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                title={
                    actionType === 'reject' ? 'Reject Application' :
                        actionType === 'approve_meet' ? 'Approve for Meet & Greet' :
                            'Mark as Adopted'
                }
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">
                        {actionType === 'reject'
                            ? "Are you sure you want to reject this application? Please provide a reason."
                            : actionType === 'approve_meet'
                                ? "Great! You are approving this applicant for a Meet & Greet. Use the notes to suggest times or locations."
                                : "Congratulations! Confirming this adoption will close the listing and reject other pending applications."}
                    </p>

                    <textarea
                        className="w-full h-32 p-3 border border-border rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                        placeholder={actionType === 'reject' ? "Reason for rejection..." : "Add a note..."}
                        value={actionNote}
                        onChange={(e) => setActionNote(e.target.value)}
                    />

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsActionModalOpen(false)}>Cancel</Button>
                        <Button
                            variant={actionType === 'reject' ? 'destructive' : 'primary'}
                            isLoading={updateStatusMutation.isPending}
                            onClick={handleActionSubmit}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ApplicationDetailPage;
