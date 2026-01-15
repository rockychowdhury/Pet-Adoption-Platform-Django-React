import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heart, FileText, CheckCircle, Clock } from 'lucide-react';

const RehomingFlowLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const steps = [
        { path: '/rehoming', label: 'Start', icon: Heart },
        { path: '/rehoming/select-pet', label: 'Select Pet', icon: CheckCircle },
        { path: '/rehoming/check-in', label: 'Check-in', icon: Heart },
        { path: '/rehoming/create-request', label: 'Details', icon: FileText },
        { path: '/rehoming/status', label: 'Status', icon: Clock },
        { path: '/rehoming/create-listing', label: 'Listing', icon: FileText },
    ];

    // Helper to find current step index
    const getCurrentStepIndex = () => {
        // Exact match or partial match for specialized sub-pages
        const index = steps.findIndex(step => step.path === currentPath);
        if (index !== -1) return index;

        // Fallback logic for sub-routes
        if (currentPath.includes('select-pet')) return 1;
        if (currentPath.includes('pet-incomplete')) return 1; // Treat gate as step 1
        if (currentPath.includes('check-in')) return 2;
        if (currentPath.includes('create-request')) return 3;
        if (currentPath.includes('status')) return 4;
        if (currentPath.includes('create-listing')) return 5;

        return 0; // Default to start
    };

    const activeStep = getCurrentStepIndex();

    // Track the furthest step reached to allow backward/forward navigation within completed range
    const [maxReachedStep, setMaxReachedStep] = useState(0);

    useEffect(() => {
        setMaxReachedStep(prev => Math.max(prev, activeStep));
    }, [activeStep]);

    const handleStepClick = (stepPath, index) => {
        // Allow navigation if the step is within the range of steps we've reached so far
        if (index <= maxReachedStep) {
            navigate(stepPath);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Progress Stepper */}
                <div className="mb-16 overflow-x-auto pb-4 no-scrollbar">
                    <div className="relative min-w-[600px] px-8 max-w-4xl mx-auto">

                        {/* Connecting Line Container */}
                        <div className="absolute top-6 left-0 right-0 px-16 z-0">
                            {/* Gray Background Line */}
                            <div className="w-full h-[2px] bg-border" />

                            {/* Colored Progress Line */}
                            <div
                                className="absolute top-0 left-0 h-[2px] bg-brand-primary transition-all duration-500 ease-in-out origin-left"
                                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                            />
                        </div>

                        <div className="flex items-start justify-between relative z-10">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === activeStep;
                                const isCompleted = index < activeStep;
                                const isUnlocked = index <= maxReachedStep;

                                return (
                                    <div
                                        key={step.path}
                                        onClick={() => handleStepClick(step.path, index)}
                                        className={`flex flex-col items-center group w-24 transition-opacity duration-200 ${isUnlocked ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'}`}
                                    >
                                        <div
                                            className={`
                                                w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border-[1.5px] relative z-20
                                                ${isActive
                                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg scale-110'
                                                    : isCompleted
                                                        ? 'bg-white border-brand-primary text-brand-primary' // Green outline for completed
                                                        : 'bg-white border-border text-text-tertiary shadow-sm'
                                                }
                                                ${!isUnlocked && 'grayscale'}
                                            `}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" /> // Completed Icon
                                            ) : (
                                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                            )}
                                        </div>
                                        <span
                                            className={`
                                                text-sm font-bold font-jakarta text-center tracking-tight transition-colors duration-300
                                                ${isActive ? 'text-brand-primary' : isCompleted ? 'text-text-primary' : 'text-text-tertiary'}
                                            `}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
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
