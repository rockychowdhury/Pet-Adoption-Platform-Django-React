import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heart, FileText, CheckCircle, MapPin, Search } from 'lucide-react';

const RehomingFlowLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    // --- State Management ---
    const [petId, setPetId] = useState(null);
    const [formData, setFormData] = useState({
        reason: '',
        urgency: '',
        location_city: '',
        location_state: '',
        enable_location_edit: false,
        ideal_home_notes: '',
        privacy_level: '',
        terms_accepted: false
    });

    // Track completing steps to unlock future ones
    const [completedSteps, setCompletedSteps] = useState({
        selection: false,
        situation: false,
        details: false
    });

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const markStepComplete = (stepName) => {
        setCompletedSteps(prev => ({ ...prev, [stepName]: true }));
    };

    // Initialize petId from location state if available (e.g., coming from dashboard)
    useEffect(() => {
        if (location.state?.petId) {
            setPetId(location.state.petId);
            markStepComplete('selection');
        }
    }, [location.state]);

    // --- Stepper Config ---
    const steps = [
        { path: '/rehoming/select-pet', label: 'Select Pet', icon: Search, id: 'selection' },
        { path: '/rehoming/situation', label: 'Situation', icon: Heart, id: 'situation' },
        { path: '/rehoming/details', label: 'Details', icon: MapPin, id: 'details' },
        { path: '/rehoming/review', label: 'Review', icon: FileText, id: 'review' },
    ];

    // Helper to find current step index
    const getCurrentStepIndex = () => {
        // Exact match
        const index = steps.findIndex(step => step.path === currentPath);
        if (index !== -1) return index;

        // Fallback logic
        if (currentPath.includes('select-pet')) return 0;
        if (currentPath.includes('situation')) return 1;
        if (currentPath.includes('details')) return 2;
        if (currentPath.includes('review')) return 3;

        return 0;
    };

    const activeStep = getCurrentStepIndex();
    const progressPercentage = Math.round(((activeStep) / (steps.length - 1)) * 100);

    // Track the furthest step reached
    const [maxReachedStep, setMaxReachedStep] = useState(0);

    useEffect(() => {
        setMaxReachedStep(prev => Math.max(prev, activeStep));
    }, [activeStep]);

    const handleStepClick = (stepPath, index) => {
        // Only allow navigation to unlocked steps
        // Logic: Can always go back. Can go forward only if previous steps are completed.
        // Simplified: use maxReachedStep
        if (index <= maxReachedStep) {
            navigate(stepPath);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-16 pb-8">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Progress Header */}
                <div className="max-w-4xl mx-auto mb-6">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                            Rehoming Journey
                        </span>
                        <span className="text-xs font-bold text-text-primary">
                            {progressPercentage}% Complete
                        </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative h-1.5 bg-border/40 rounded-full overflow-hidden mb-6">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-700 ease-out rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    {/* Stepper (Desktop) */}
                    <div className="hidden md:flex items-center justify-between relative z-10 w-full px-4">
                        {/* Connecting Line Background */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 bg-border/40 -z-10" />

                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === activeStep;
                            const isCompleted = index < activeStep;
                            const isUnlocked = index <= maxReachedStep;

                            return (
                                <button
                                    key={step.path}
                                    onClick={() => handleStepClick(step.path, index)}
                                    disabled={!isUnlocked}
                                    className={`
                                        group relative flex flex-col items-center gap-2 bg-bg-primary px-3
                                        transition-all duration-300
                                        ${isUnlocked ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-not-allowed opacity-50'}
                                    `}
                                >
                                    <div
                                        className={`
                                            w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                                            ${isActive
                                                ? 'bg-brand-primary border-brand-primary text-text-inverted scale-105 shadow-brand-primary/25 shadow-md'
                                                : isCompleted
                                                    ? 'bg-status-success border-status-success text-text-inverted'
                                                    : 'bg-bg-surface border-border text-text-tertiary'
                                            }
                                        `}
                                    >
                                        {isCompleted ? <CheckCircle size={14} strokeWidth={3} /> : <Icon size={14} />}
                                    </div>
                                    <span
                                        className={`
                                            text-[10px] font-bold uppercase tracking-wide transition-colors duration-300
                                            ${isActive ? 'text-brand-primary' : isCompleted ? 'text-text-secondary' : 'text-text-tertiary'}
                                        `}
                                    >
                                        {step.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="min-h-[400px]">
                    <Outlet context={{
                        petId,
                        setPetId,
                        formData,
                        updateFormData,
                        markStepComplete
                    }} />
                </div>
            </div>
        </div>
    );
};

export default RehomingFlowLayout;
