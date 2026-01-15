import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertOctagon, ArrowRight, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import useRehoming from '../../hooks/useRehoming';
import useAuth from '../../hooks/useAuth';
import RehomingCancellationModal from '../../components/Rehoming/Modals/RehomingCancellationModal';
import RehomingConfirmationModal from '../../components/Rehoming/Modals/RehomingConfirmationModal';

const RehomingStatusPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { useGetRehomingRequests, useConfirmRehomingRequest, useCancelRehomingRequest } = useRehoming();

    // Fetch latest request
    const { data: requests, isLoading } = useGetRehomingRequests();

    const { mutate: confirmRequest, isLoading: isConfirming } = useConfirmRehomingRequest();
    const { mutate: cancelRequest, isLoading: isCancelling } = useCancelRehomingRequest();

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Handle pagination or flat array
    const results = Array.isArray(requests) ? requests : (requests?.results || []);
    const request = results.length > 0 ? results[0] : null;

    if (isLoading) return <div className="text-center py-20">Loading status...</div>;

    if (!request) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold mb-4">No Active Requests</h1>
                <p className="text-muted-foreground mb-8">You don't have any pending rehoming requests.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                    Go to Dashboard
                </button>
            </div>
        );
    }

    const isCooling = request.status === 'cooling_period';
    const isConfirmed = request.status === 'confirmed';
    const isCancelled = request.status === 'cancelled';
    const isActive = request.status === 'active';

    const coolingEnds = request.cooling_period_end ? new Date(request.cooling_period_end) : null;
    const now = new Date();
    // Logic: If cooling period exists and is in the future
    const isCoolingActive = coolingEnds && coolingEnds > now;

    // --- Actions ---
    const handleConfirm = () => {
        confirmRequest(request.id, {
            onSuccess: () => {
                setIsConfirmModalOpen(false);
                navigate('/rehoming/create-listing', { state: { requestId: request.id } });
            }
        });
    };

    const handleCancel = (reason) => {
        cancelRequest(request.id, {
            onSuccess: () => {
                setIsCancelModalOpen(false);
                // Refresh happens via query invalidation usually, or manual
            }
        });
    };

    // --- Components ---
    const Timeline = ({ status }) => {
        // status: 'submitted', 'cooling', 'ready', 'live'
        const steps = [
            { label: 'Submitted', active: true, completed: true },
            {
                label: 'Cooling Period',
                active: isCooling || isConfirmed || isActive,
                completed: !isCooling && !isConfirmed // Technically completed if we are past it? Simplified for visual:
                // If we are 'ready' or 'live', cooling is done.
            },
            { label: 'Listing Live', active: isActive, completed: false },
        ];

        // Refined visual logic
        const isReady = isConfirmed && !isActive;
        const isLive = isActive;

        const step1 = { label: 'Submitted', active: true, completed: true };
        const step2 = { label: 'Cooling Period', active: true, completed: isReady || isLive };
        const step3 = { label: 'Listing Live', active: isLive, completed: false };

        const timelineSteps = [step1, step2, step3];

        return (
            <div className="flex items-center justify-center gap-2 mb-10 w-full max-w-lg mx-auto">
                {timelineSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${step.completed ? 'bg-primary border-primary' :
                                step.active && !step.completed ? 'bg-background border-primary animate-pulse' : 'bg-background border-muted'
                                }`} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step.active ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                        </div>
                        {idx < timelineSteps.length - 1 && (
                            <div className={`h-1 flex-1 rounded-full -mt-6 mx-2 min-w-[30px] transition-colors ${timelineSteps[idx + 1].active ? 'bg-primary/50' : 'bg-secondary'
                                }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    // --- VIEW: Cooling Period (Page 7) ---
    // If status is cooling OR (status is confirmed but cooling end date is future - unlikely but safe)
    if (isCooling || (isConfirmed && isCoolingActive)) {
        return (
            <div className="max-w-2xl mx-auto text-center py-10 pb-20">
                <Timeline status="cooling" />

                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-inner">
                    <Clock className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                    5-Minute Reflection Period Started
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                    We've received your request for <strong>{request.pet_details?.name || 'your pet'}</strong>.
                    This period gives you time to reconsider or explore alternatives before making the listing public.
                </p>

                <div className="bg-card border border-border p-8 rounded-2xl inline-block text-left w-full max-w-md shadow-sm mb-10">
                    <div className="flex justify-between items-center mb-4 border-b border-border pb-4">
                        <span className="text-muted-foreground font-medium">Time Remaining</span>
                        <span className="font-mono font-bold text-xl text-primary">
                            {/* Simple Logic for now */}
                            ~5 Minutes
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Ends At</span>
                        <span className="font-medium text-foreground">{coolingEnds?.toLocaleString()}</span>
                    </div>
                    <div className="mt-6 text-sm text-center text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                        We'll email you when the period ends.
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary px-8 btn-lg"
                    >
                        Return to Dashboard
                    </button>
                    <button
                        onClick={() => setIsCancelModalOpen(true)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm underline hover:no-underline"
                    >
                        Cancel This Request
                    </button>
                </div>

                <RehomingCancellationModal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    onConfirm={handleCancel}
                    petName={request.pet_details?.name}
                    isLoading={isCancelling}
                />
            </div>
        );
    }

    // --- VIEW: Ready to Confirm (Post-Cooling) ---
    // If confirmed and cooling passed, OR cooling status but time passed (safety fallback)
    if ((isConfirmed && !isCoolingActive && !isActive) || (isCooling && !isCoolingActive)) {
        return (
            <div className="max-w-2xl mx-auto text-center py-10 pb-20">
                <Timeline status="ready" />

                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                    Ready to Publish
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    The cooling period for <strong>{request.pet_details?.name}</strong> has ended.
                    You can now confirm and publish your listing.
                </p>

                <div className="flex flex-col gap-4 items-center">
                    <button
                        onClick={() => setIsConfirmModalOpen(true)}
                        className="btn btn-primary btn-lg shadow-xl shadow-brand-primary/20 px-10"
                    >
                        Confirm & Publish Listing
                    </button>
                    <div className="flex gap-4 text-sm mt-4">
                        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-primary">
                            Return to Dashboard
                        </button>
                        <span className="text-border">|</span>
                        <button onClick={() => setIsCancelModalOpen(true)} className="text-red-500 hover:text-red-700">
                            Cancel Request
                        </button>
                    </div>
                </div>

                <RehomingConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirm}
                    pet={request.pet_details}
                    isLoading={isConfirming}
                />
                <RehomingCancellationModal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    onConfirm={handleCancel}
                    petName={request.pet_details?.name}
                    isLoading={isCancelling}
                />
            </div>
        );
    }

    // --- VIEW: Active / Immediate Success (Page 8) ---
    if (isActive) {
        return (
            <div className="max-w-2xl mx-auto text-center py-10 pb-20">
                <Timeline status="live" />

                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                    Your Listing Is Live
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    We're helping you find a new home for <strong>{request.pet_details?.name}</strong>.
                    You will be notified when someone inquires.
                </p>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-8 text-left max-w-md mx-auto">
                    <h3 className="font-bold mb-4">What Happens Next?</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-2"><div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">1</div> Listing is visible to potential adopters</li>
                        <li className="flex gap-2"><div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">2</div> Receive notifications for inquiries</li>
                        <li className="flex gap-2"><div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">3</div> Respond via secure messaging</li>
                    </ul>
                </div>

                <div className="flex gap-4 justify-center">
                    <button onClick={() => navigate('/dashboard/listings')} className="btn btn-primary">
                        View My Listing
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isCancelled) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                    <AlertOctagon className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Request Cancelled</h1>
                <p className="text-muted-foreground mb-6">This rehoming request has been cancelled.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return <div>Status: {request.status}</div>;
};

export default RehomingStatusPage;
