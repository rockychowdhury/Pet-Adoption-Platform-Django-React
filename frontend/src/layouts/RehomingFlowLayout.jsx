import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { ChevronRight, Heart, FileText, CheckCircle, Clock } from 'lucide-react';

const RehomingFlowLayout = () => {
    const location = useLocation();
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

        // Fallback logic
        if (currentPath.includes('select-pet')) return 1;
        if (currentPath.includes('check-in')) return 2;
        if (currentPath.includes('create-request')) return 3;
        if (currentPath.includes('status')) return 4;
        if (currentPath.includes('create-listing')) return 5;

        return 0; // Default to start
    };

    const activeStep = getCurrentStepIndex();

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Progress Stepper */}
                {/* Progress Stepper */}
                <div className="mb-10 overflow-x-auto pb-4">
                    <div className="relative min-w-[600px] px-10">
                        {/* Connecting Line - Background */}
                        <div className="absolute top-5 left-0 w-full h-1 bg-secondary rounded-full -z-10" />

                        {/* Connecting Line - Progress */}
                        <div
                            className="absolute top-5 left-0 h-1 bg-green-500 rounded-full transition-all duration-500 -z-10"
                            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                        />

                        <div className="flex items-start justify-between">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === activeStep;
                                const isCompleted = index < activeStep;

                                return (
                                    <div key={step.path} className="flex flex-col items-center relative z-10 w-24">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 border-2 ${isActive
                                                ? 'bg-primary border-primary text-white shadow-lg scale-110'
                                                : isCompleted
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'bg-background border-border text-muted-foreground'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span
                                            className={`text-xs md:text-sm font-bold text-center ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-10 min-h-[500px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RehomingFlowLayout;
