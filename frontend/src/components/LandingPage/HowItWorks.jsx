import React from 'react';
import { Search, MessageSquare, Home } from 'lucide-react';

import star from '../../assets/star.png';
import stars from '../../assets/stars.png';

const HowItWorks = () => {
    const steps = [
        {
            step: "STEP 1",
            icon: <Search size={32} />,
            title: 'Browse verified pets',
            description: 'Explore thousands of profiles from trusted shelters. Filter by species, age, size, and more to find your perfect match.',
            iconBg: 'bg-[#F5F1E8]'
        },
        {
            step: "STEP 2",
            icon: <MessageSquare size={32} />,
            title: 'Connect & ask questions',
            description: 'Chat directly with shelters, ask about behavior and history, and get guidance from our community.',
            iconBg: 'bg-[#F5F1E8]'
        },
        {
            step: "STEP 3",
            icon: <Home size={32} />,
            title: 'Bring them home',
            description: 'Complete your application, schedule a visit, and welcome your new family member into a loving home.',
            iconBg: 'bg-[#F5F1E8]'
        }
    ];

    return (
        <section className="py-24 bg-bg-primary relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-8 relative z-10">
                {/* Decorative Stars (Inside Container) */}
                <img src={stars} alt="" className="absolute top-10 right-10 w-16 h-16 opacity-20 animate-pulse" style={{ filter: 'brightness(0)' }} />
                <img src={star} alt="" className="absolute bottom-8 -left-5 w-10 h-10 opacity-10 animate-spin-slow" style={{ filter: 'brightness(0)' }} />

                <div className="text-center mb-16 relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-logo relative inline-block">
                        How It <span className="text-brand-secondary">Works</span>
                        <img src={star} alt="" className="absolute -top-2 -right-8 w-6 h-6 animate-spin-slow opacity-80" style={{ filter: 'brightness(0)' }} />
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Three simple steps to welcome a new friend into your life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-[32px] shadow-soft hover:shadow-xl transition duration-300 border border-transparent hover:border-brand-secondary/20 group">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>
                                <span className="px-3 py-1 bg-brand-secondary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                                    {step.step}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-text-primary mb-3">{step.title}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
