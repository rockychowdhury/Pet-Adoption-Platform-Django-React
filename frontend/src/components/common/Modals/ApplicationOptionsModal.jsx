import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../Buttons/Button';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const ApplicationOptionsModal = ({ isOpen, onClose, listingId }) => {
    const navigate = useNavigate();
    const { getUser, user } = useAuth(); // Use 'user' from context

    const [isLoading, setIsLoading] = useState(true);
    // Removed local freshUser state, relying on context 'user' which getUser() updates

    // Fetch fresh user data when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            getUser()
                .finally(() => {
                    // Small artificial delay for smoother UX if fetch is too fast to see loading
                    setTimeout(() => setIsLoading(false), 800);
                });
        }
    }, [isOpen, getUser]);

    // Field Check Logic (Based on context user)
    const missingFields = [];

    // Only run checks if loading is complete to avoid flicker
    if (!isLoading) {
        if (!user) {
            missingFields.push("Please log in to continue.");
        } else {
            // Use backend source of truth if available, otherwise fallback to local check
            if (user.missing_profile_fields && Array.isArray(user.missing_profile_fields)) {
                user.missing_profile_fields.forEach(field => {
                    if (field === 'first_name' || field === 'last_name') {
                        if (!missingFields.includes("Full Name")) missingFields.push("Full Name");
                    }
                    else if (field === 'email') missingFields.push("Email");
                    else if (field === 'phone_number') missingFields.push("Phone Number");
                    else if (field === 'location_city' || field === 'location_state') {
                        if (!missingFields.includes("Location (City/State)")) missingFields.push("Location (City/State)");
                    }
                    else if (field === 'date_of_birth') missingFields.push("Date of Birth");
                    else if (field === 'phone_verified') missingFields.push("Phone Verification (Verify in settings)");
                    else if (field === 'email_verified') missingFields.push("Email Verification");
                });
            } else {
                // Fallback client-side check if backend data not quite clear (e.g. older session)
                if (!user.first_name || !user.last_name) missingFields.push("Full Name");
                if (!user.email) missingFields.push("Email");
                if (!user.phone_number) missingFields.push("Phone Number");
                if (!user.location_city || !user.location_state) missingFields.push("Location (City/State)");
                if (!user.date_of_birth) missingFields.push("Date of Birth");

                // Only check verification in fallback mode if missing
                if (!user.phone_verified) missingFields.push("Phone Verification (Verify in settings)");
                if (!user.email_verified) missingFields.push("Email Verification");
            }

            // Always enforce verification for applications, even if backend "Profile" (data) is complete
            if (!missingFields.includes("Phone Verification (Verify in settings)") && !user.phone_verified) {
                missingFields.push("Phone Verification (Verify in settings)");
            }
            if (!missingFields.includes("Email Verification") && !user.email_verified) {
                missingFields.push("Email Verification");
            }
        }
    }

    const isProfileComplete = user && missingFields.length === 0;



    const handleManual = () => {
        // Redirect to new Mailbox page
        navigate(`/rehoming/listings/${listingId}/inquiry`);
        onClose();
    };

    const handleAI = () => {
        navigate(`/rehoming/listings/${listingId}/apply-ai`);
        onClose();
    };

    const handleCompleteProfile = () => {
        // Redirect to settings
        navigate('/dashboard/profile/settings', { state: { from: `/pets/${listingId}` } });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden pointer-events-auto border border-gray-100"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F9F8F6]">
                                <h3 className="text-lg font-black font-logo tracking-tight flex items-center gap-2">
                                    Start Application
                                </h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 min-h-[300px] flex flex-col justify-center">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-brand-primary/20 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">Verifying Profile...</p>
                                    </div>
                                ) : !isProfileComplete ? (
                                    <div className="space-y-6 text-center animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="w-16 h-16 bg-status-warning/10 rounded-full flex items-center justify-center mx-auto text-status-warning">
                                            <AlertCircle size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-bold text-gray-900">Complete Your Profile</h4>
                                            <p className="text-sm text-gray-500">
                                                To ensure trust and safety, please complete the following fields before applying:
                                            </p>
                                        </div>

                                        <div className="bg-red-50 p-5 rounded-xl text-left space-y-3 border border-red-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Missing Requirements:</p>
                                            <ul className="space-y-2">
                                                {missingFields.map((field, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-red-700 font-bold">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                                        {field}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Button
                                            variant="primary"
                                            onClick={handleCompleteProfile}
                                            className="w-full h-12 text-sm font-bold shadow-lg shadow-brand-primary/20"
                                        >
                                            Complete Profile <ArrowRight size={16} className="ml-2" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-900">Choose Application Method</h4>
                                            <p className="text-sm text-gray-500">Your profile is verified. How would you like to proceed?</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={handleManual}
                                                className="group relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-gray-100 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all text-center"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center text-gray-600 group-hover:text-brand-primary transition-colors">
                                                    <Mail size={24} />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-900 mb-1">Manual Application</h5>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Send Message</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={handleAI}
                                                className="group relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all text-center"
                                            >
                                                <div className="absolute top-3 right-3">
                                                    <Sparkles size={14} className="text-purple-500 animate-pulse" />
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-purple-100 group-hover:bg-white flex items-center justify-center text-purple-600 transition-colors">
                                                    <Sparkles size={24} />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-900 mb-1">AI Assistant</h5>
                                                    <p className="text-[10px] text-purple-600 uppercase tracking-wider font-bold">Smart Draft</p>
                                                </div>
                                            </button>
                                        </div>

                                        <p className="text-center text-[10px] text-gray-400 max-w-xs mx-auto font-bold uppercase tracking-wider">
                                            Both methods submit directly to owner
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ApplicationOptionsModal;
