import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, CheckCircle2, User, Phone, MapPin, ChevronRight, ArrowRight, Info, Heart, FileText, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const RehomingLandingPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // Helper: Determine status of specific fields
    const checklist = [
        {
            label: "First Name",
            isComplete: !!user?.first_name,
            icon: User
        },
        {
            label: "Last Name",
            isComplete: !!user?.last_name,
            icon: User
        },
        {
            label: "Phone Number",
            isComplete: !!user?.phone_number,
            icon: Phone
        },
        {
            label: "Location (City & State)",
            isComplete: !!(user?.location_city && user?.location_state),
            icon: MapPin
        },
        {
            label: "Email Verification",
            isComplete: !!user?.email_verified,
            icon: Shield
        }
    ];

    // Calculate completion percentage
    const completedCount = checklist.filter(i => i.isComplete).length;
    const totalCount = checklist.length;
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const isProfileComplete = completionPercentage === 100;

    const handleStart = () => {
        if (isProfileComplete) {
            navigate('/rehoming/select-pet');
        }
    };

    if (loading) return <div className="text-center py-20 font-jakarta">Loading...</div>;
    // If user is null, we might redirect or show nothing, but for now return null to avoid errors
    if (!user) return null;

    return (
        <div className="w-full pb-32">
            {/* Header */}
            <div className="text-center mb-16 pt-4">
                <h1 className="text-4xl md:text-5xl font-logo font-black text-text-primary mb-4 tracking-tight">
                    Start Your Rehoming Journey
                </h1>
                <p className="font-jakarta text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    We're here to help you find a safe, loving new home for your pet.
                    Before we begin, we need to ensure your profile is ready.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">

                {/* Visual Side - Process Info */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[32px] p-8 border border-border shadow-soft">
                        <h2 className="text-2xl font-bold font-logo text-brand-primary mb-6">How It Works</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 text-brand-primary font-bold">1</div>
                                <div>
                                    <h3 className="font-bold font-jakarta text-text-primary">Create a Request</h3>
                                    <p className="text-text-secondary text-sm mt-1">Provide details about your pet and your situation. This helps us find the best match.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 text-brand-primary font-bold">2</div>
                                <div>
                                    <h3 className="font-bold font-jakarta text-text-primary">Review & Publish</h3>
                                    <p className="text-text-secondary text-sm mt-1">Our team reviews every listing to ensure safety. Once approved, your listing goes live.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 text-brand-primary font-bold">3</div>
                                <div>
                                    <h3 className="font-bold font-jakarta text-text-primary">Find the Right Adopter</h3>
                                    <p className="text-text-secondary text-sm mt-1">Review applications, chat with potential owners, and choose the perfect home.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm flex items-start gap-3 border border-blue-100">
                            <Info className="w-5 h-5 shrink-0" />
                            <p>Our platform is free for pet owners rehoming their pets. We prioritize safety and transparency.</p>
                        </div>
                    </div>
                </div>

                {/* Action Side - Profile Check */}
                <div className="bg-white rounded-[32px] p-8 border border-border shadow-lg relative overflow-hidden">
                    {/* Decorative bg element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-[100px] -z-10" />

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold font-logo text-text-primary">Profile Status</h2>
                            <p className="text-text-secondary font-medium mt-1">Completion Required</p>
                        </div>
                        {/* Percentage Circle */}
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-bg-secondary" />
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={226}
                                    strokeDashoffset={226 - (226 * completionPercentage) / 100}
                                    className={`transition-all duration-1000 ease-out ${isProfileComplete ? 'text-brand-primary' : 'text-brand-secondary'}`}
                                />
                            </svg>
                            <span className="absolute text-xl font-black font-logo text-text-primary">{completionPercentage}%</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        {checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full transition-colors ${item.isComplete ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                        {item.isComplete ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    </div>
                                    <span className={`text-sm font-bold font-jakarta ${item.isComplete ? 'text-text-primary' : 'text-text-secondary'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {item.isComplete ? (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">DONE</span>
                                ) : (
                                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">MISSING</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Main Action Button */}
                    {isProfileComplete ? (
                        <button
                            onClick={handleStart}
                            className="w-full btn-primary rounded-full h-14 text-lg font-bold shadow-lg shadow-brand-primary/20 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2"
                        >
                            Start Rehoming <ArrowRight size={22} />
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/dashboard/profile/edit')}
                                className="w-full bg-brand-secondary hover:bg-brand-secondary/90 text-white rounded-full h-14 text-lg font-bold shadow-lg shadow-brand-secondary/20 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2"
                            >
                                Complete My Profile <ChevronRight size={22} />
                            </button>
                            <p className="text-xs text-center text-text-tertiary">
                                You must complete your profile to proceed.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RehomingLandingPage;
