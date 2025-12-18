import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, ChevronLeft, Shield, MessageCircle, Home, Users, Info, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import Modal from "../../components/common/Modal"; // Assuming a reusable modal exists or inline

const OwnerApplicationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

    // Mock Data
    const applicant = {
        name: 'John Doe',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80',
        joined: '2022',
        verified: true,
        score: 92,
        email: 'john.doe@example.com',
        phone: '(555) 987-6543',
        details: {
            housing: { type: 'Single-family house', ownership: 'Own', yard: 'Fully Fenced' },
            household: { adults: 2, children: 'Yes (Ages 8, 12)', pets: '1 Dog (Labrador)' },
            experience: { level: 'Experienced', history: 'Owned dogs for 15 years.' },
            lifestyle: { routine: 'Work from home', activity: 'Active (Hikers)' },
            message: "We have a large fenced yard and another golden retriever who needs a friend. I work from home so the dogs are rarely alone. We go hiking every weekend and would love to include Bella in our adventures."
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-brand-primary" onClick={() => navigate(-1)}>
                    <ChevronLeft size={16} className="mr-2" /> Back to Applications
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div className="flex items-center gap-6">
                            <img src={applicant.image} alt={applicant.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                            <div>
                                <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                                    {applicant.name}
                                    {applicant.verified && <Check size={20} className="text-status-info bg-status-info/10 rounded-full p-0.5" />}
                                </h1>
                                <p className="text-text-secondary">Member since {applicant.joined} • Verified Identity</p>
                                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-status-success/10 text-status-success text-sm font-bold border border-status-success/20">
                                    Readiness Score: {applicant.score}%
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <Card className="p-8 space-y-8">
                            {/* Message */}
                            <div>
                                <h2 className="text-xl font-bold text-text-primary mb-4 border-b border-border pb-2">Why John Wants to Adopt</h2>
                                <p className="text-text-secondary leading-relaxed bg-bg-secondary p-4 rounded-xl border border-border italic">
                                    "{applicant.details.message}"
                                </p>
                            </div>

                            {/* Housing */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-text-primary mb-4">
                                    <Home size={18} className="text-brand-primary" /> Housing Information
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-bg-surface border border-border rounded-xl text-center">
                                        <p className="text-xs text-text-tertiary uppercase font-bold">Type</p>
                                        <p className="font-bold">{applicant.details.housing.type}</p>
                                    </div>
                                    <div className="p-3 bg-bg-surface border border-border rounded-xl text-center">
                                        <p className="text-xs text-text-tertiary uppercase font-bold">Ownership</p>
                                        <p className="font-bold">{applicant.details.housing.ownership}</p>
                                    </div>
                                    <div className="p-3 bg-bg-surface border border-border rounded-xl text-center">
                                        <p className="text-xs text-text-tertiary uppercase font-bold">Yard</p>
                                        <p className="font-bold">{applicant.details.housing.yard}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Household */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-text-primary mb-4">
                                    <Users size={18} className="text-brand-primary" /> Household
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border border-border rounded-xl">
                                        <p className="text-sm"><strong>Adults:</strong> {applicant.details.household.adults}</p>
                                        <p className="text-sm"><strong>Children:</strong> {applicant.details.household.children}</p>
                                    </div>
                                    <div className="p-4 border border-border rounded-xl">
                                        <p className="text-sm font-bold text-text-secondary mb-1">Current Pets</p>
                                        <p className="font-medium">{applicant.details.household.pets}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Experience & Lifestyle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-text-primary mb-4">
                                        <Info size={18} className="text-brand-primary" /> Experience
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-sm"><span className="font-bold text-gray-500">Level:</span> {applicant.details.experience.level}</p>
                                        <p className="text-sm"><span className="font-bold text-gray-500">History:</span> {applicant.details.experience.history}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold text-text-primary mb-4">
                                        <Activity size={18} className="text-brand-primary" /> Lifestyle
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-sm"><span className="font-bold text-gray-500">Schedule:</span> {applicant.details.lifestyle.routine}</p>
                                        <p className="text-sm"><span className="font-bold text-gray-500">Activity:</span> {applicant.details.lifestyle.activity}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <Card className="p-6">
                                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Button variant="primary" className="w-full justify-center py-3 shadow-lg" onClick={() => setIsApproveModalOpen(true)}>
                                        <Check size={18} className="mr-2" /> Approve for Meet & Greet
                                    </Button>
                                    <p className="text-xs text-center text-text-tertiary px-2">This will share your contact info with the applicant.</p>

                                    <Button variant="outline" className="w-full justify-center py-3">
                                        Requests More Info
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-center text-status-error hover:bg-status-error/10 hover:text-status-error" onClick={() => setIsRejectModalOpen(true)}>
                                        Reject Application
                                    </Button>
                                </div>
                            </Card>

                            <div className="bg-status-info/10 p-6 rounded-2xl border border-status-info/20">
                                <div className="flex items-start gap-3">
                                    <Shield className="text-status-info shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="font-bold text-status-info text-sm mb-1">Safety Reminder</p>
                                        <p className="text-xs text-status-info leading-relaxed">
                                            Always meet in a public place for the first time. Bring a friend or family member along.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Application">
                <div className="space-y-4">
                    <p className="text-text-secondary">Are you sure you want to reject this application? This action cannot be undone.</p>
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Reason (Optional)</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-border mb-4">
                            <option>Not a good match for needs</option>
                            <option>Housing concerns</option>
                            <option>Experience level</option>
                            <option>Found another home</option>
                        </select>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" className="bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600" onClick={() => {
                            toast.success("Application Rejected");
                            setIsRejectModalOpen(false);
                            navigate(-1);
                        }}>Confirm Rejection</Button>
                    </div>
                </div>
            </Modal>

            {/* Approve Modal */}
            <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Approve for Meet & Greet">
                <div className="space-y-4">
                    <div className="bg-status-success/10 p-4 rounded-xl border border-status-success/20 flex gap-3 text-status-success text-sm">
                        <Info className="shrink-0" size={18} />
                        <p>Your contact information will be shared with <strong>{applicant.name}</strong> to arrange a meeting.</p>
                    </div>
                    <div className="p-4 bg-bg-secondary rounded-xl border border-border">
                        <p className="text-xs font-bold text-text-tertiary uppercase mb-2">Contact Info to Share</p>
                        <p className="font-bold">📞 (555) 123-4567</p>
                        <p className="font-bold">✉️ you@example.com</p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            toast.success("Application Approved! Contact info shared.");
                            setIsApproveModalOpen(false);
                        }}>Confirm Approval</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OwnerApplicationDetailPage;
