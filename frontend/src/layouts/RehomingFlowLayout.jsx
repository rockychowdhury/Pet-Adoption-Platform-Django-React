import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heart, FileText, CheckCircle, Clock } from 'lucide-react';

const RehomingFlowLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const steps = [
        { path: '/rehoming/select-pet', label: 'Select Pet', icon: CheckCircle },
        { path: '/rehoming/check-in', label: 'Check-in', icon: Heart },
        { path: '/rehoming/create-request', label: 'Details', icon: FileText },
        { path: '/rehoming/status', label: 'Status', icon: Clock },
    ];

    // Helper to find current step index
    const getCurrentStepIndex = () => {
        // Exact match
        const index = steps.findIndex(step => step.path === currentPath);
        if (index !== -1) return index;

        // Fallback logic
        if (currentPath.includes('select-pet')) return 0;
        if (currentPath.includes('pet-incomplete')) return 0;
        if (currentPath.includes('check-in')) return 1;
        if (currentPath.includes('create-request')) return 2;
        if (currentPath.includes('status')) return 3;

        return 0;
    };

    const activeStep = getCurrentStepIndex();
    const progressPercentage = Math.round(((activeStep) / (steps.length - 1)) * 100);

    // Track the furthest step reached to allow backward/forward navigation within completed range
    const [maxReachedStep, setMaxReachedStep] = useState(0);

    useEffect(() => {
        setMaxReachedStep(prev => Math.max(prev, activeStep));
    }, [activeStep]);

    const handleStepClick = (stepPath, index) => {
        if (index <= maxReachedStep) {
            navigate(stepPath);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Progress Header */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-brand-primary uppercase tracking-wider">
                            Rehoming Journey
                        </span>
                        <span className="text-sm font-bold text-text-primary">
                            {progressPercentage}% Complete
                        </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative h-2 bg-border/40 rounded-full overflow-hidden mb-8">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-700 ease-out rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    {/* Stepper (Desktop) */}
                    <div className="hidden md:flex items-center justify-between relative z-10">
                        {/* Connecting Line Background */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-border/40 -z-10" />

                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            // Active: Current Step
                            // Completed: Past Step
                            // Unlocked: Reached previously
                            const isActive = index === activeStep;
                            const isCompleted = index < activeStep;
                            const isUnlocked = index <= maxReachedStep;

                            return (
                                <button
                                    key={step.path}
                                    onClick={() => handleStepClick(step.path, index)}
                                    disabled={!isUnlocked}
                                    className={`
                                        group relative flex flex-col items-center gap-3 bg-bg-primary px-2
                                        transition-all duration-300
                                        ${isUnlocked ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-50'}
                                    `}
                                >
                                    <div
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                                            ${isActive
                                                ? 'bg-brand-primary border-brand-primary text-text-inverted scale-110 shadow-brand-primary/25 shadow-md'
                                                : isCompleted
                                                    ? 'bg-status-success border-status-success text-text-inverted'
                                                    : 'bg-bg-surface border-border text-text-tertiary'
                                            }
                                        `}
                                    >
                                        {isCompleted ? <CheckCircle size={18} strokeWidth={3} /> : <Icon size={18} />}
                                    </div>
                                    <span
                                        className={`
                                            text-xs font-bold uppercase tracking-wide transition-colors duration-300
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

                <div className="min-h-[500px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RehomingFlowLayout;
