import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Calendar, Share2, LayoutDashboard, FileText, Sparkles } from 'lucide-react';
import star from '../../assets/star.png';

const FeaturesSection = () => {
    const [activeTab, setActiveTab] = useState('adopting');
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'scale-90');
                    entry.target.classList.add('opacity-100', 'scale-100');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            title: "Community Forum",
            tag: "COMMUNITY",
            icon: <Users size={20} />,
            description: "Swap stories, get behaviour tips, and learn from other owners, foster parents, and rehomers all in one warm feed.",
            subtext: "React with likes, hearts, and thoughtful comments."
        },
        {
            title: "Direct Owner Chat",
            tag: "CHAT",
            icon: <MessageSquare size={20} />,
            description: "Message current owners directly to clarify history, medical records, or personality quirks before you meet.",
            subtext: "Secure, direct messaging with verified owners."
        },
        {
            title: "Schedule Meet & Greets",
            tag: "VISITS",
            icon: <Calendar size={20} />,
            description: "Pick a time, share who is coming, and confirm a visit with the owner in a guided, step-by-step flow.",
            subtext: "Automatic reminders and clear visit details."
        },
        {
            title: "Share Pets & Updates",
            tag: "SHARING",
            icon: <Share2 size={20} />,
            description: "Turn any pet profile into a beautiful share card for social media or the community feed with one click.",
            subtext: "Boost reach for overlooked and long-stay pets."
        },
        {
            title: "Rehomer Dashboards",
            tag: "REHOMING",
            icon: <LayoutDashboard size={20} />,
            description: "Manage your pet profile, track applications, and coordinate visits from one place while your pet stays home.",
            subtext: "Built for responsible life transitions."
        },
        {
            title: "Adoption Requests",
            tag: "WORKFLOW",
            icon: <FileText size={20} />,
            description: "Track every application from 'New' to 'PetCircle' with notes, documents, and conversations in a single timeline.",
            subtext: "Less email back-and-forth, more happy matches."
        }
    ];

    return (
        <section className="py-24 bg-bg-primary relative">
            {/* Background Decoration Container (Clipped) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
                    <Sparkles className="absolute top-20 left-4 opacity-30 animate-pulse text-brand-secondary fill-current" size={64} />
                    {/* Replaced Star with Image and removed bottom star for cleaner look */}
                    <img src={star} alt="" className="absolute top-1/2 left-0 w-12 h-12 opacity-20 animate-float" style={{ filter: 'brightness(0) sepia(1) hue-rotate(-50deg) saturate(5)' }} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-24 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border/50 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                        <Sparkles size={12} className="fill-current" />
                        Platform Features
                    </div>

                    <div className="relative inline-block mb-6">
                        <h2 className="text-5xl md:text-6xl font-black text-text-primary font-logo leading-tight tracking-tight">
                            Everything in <span className="text-brand-primary">One Place</span>
                        </h2>
                        <img src={star} alt="" className="absolute -top-10 -right-14 w-12 h-12 animate-spin-slow opacity-60 hidden md:block" style={{ filter: 'brightness(0)' }} />
                    </div>

                    <p className="text-text-secondary text-xl max-w-3xl mx-auto font-medium opacity-80 leading-relaxed">
                        See exactly how PetCircle supports communities — from first social post to the final transfer papers.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Sticky Content */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8">
                        <h3 className="text-4xl md:text-5xl font-black text-text-primary leading-[1.1] font-jakarta tracking-tight">
                            Built for every step of the <span className="text-brand-primary">adoption journey.</span>
                        </h3>
                        <p className="text-text-secondary text-lg leading-relaxed font-medium opacity-80">
                            Whether you are discovering your first pet or rehoming a pet, you get clear tools for community, communication, visits, and paperwork — without juggling different apps.
                        </p>

                        {/* Toggle */}
                        <div className="inline-flex bg-bg-secondary/40 rounded-full p-1.5 border border-border/60 shadow-inner">
                            <button
                                onClick={() => setActiveTab('adopting')}
                                className={`px-8 py-3 rounded-full text-xs font-black transition-all duration-500 ease-out transform tracking-[0.1em] uppercase ${activeTab === 'adopting'
                                    ? 'bg-bg-surface text-brand-primary shadow-lg shadow-black/5 scale-100'
                                    : 'text-text-secondary/60 hover:text-text-primary hover:bg-bg-surface/30 scale-95'
                                    }`}
                            >
                                For Adopting
                            </button>
                            <button
                                onClick={() => setActiveTab('rehoming')}
                                className={`px-8 py-3 rounded-full text-xs font-black transition-all duration-500 ease-out transform tracking-[0.1em] uppercase ${activeTab === 'rehoming'
                                    ? 'bg-bg-surface text-brand-primary shadow-lg shadow-black/5 scale-100'
                                    : 'text-text-secondary/60 hover:text-text-primary hover:bg-bg-surface/30 scale-95'
                                    }`}
                            >
                                For Rehoming
                            </button>
                        </div>

                        {/* Dynamic List based on Tab */}
                        <div className="space-y-6 pt-4">
                            <h4 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                                {activeTab === 'adopting' ? "IF YOU'RE ADOPTING" : "IF REHOMING A PET"}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {activeTab === 'adopting' ? (
                                    <>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Direct contact with owners</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Verified pet history & medicals</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Community support & forums</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Guided meeting process</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Create a digital wallet for your pet</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Access rehoming interventions</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Screen applicants directly</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Keep your pet until matched</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Grid */}
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                ref={el => cardsRef.current[index] = el}
                                className="bg-bg-surface p-10 rounded-[48px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] border border-border/40 hover:border-brand-primary/20 transition-all duration-700 ease-out opacity-0 scale-90 hover:-translate-y-2 group"
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-bg-secondary group-hover:bg-brand-primary/10 transition-all duration-500 flex items-center justify-center text-text-primary">
                                        {React.cloneElement(feature.icon, { size: 24, strokeWidth: 1.5 })}
                                    </div>
                                    <span className="px-4 py-1.5 bg-bg-secondary rounded-xl text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] group-hover:text-brand-primary transition-colors">
                                        {feature.tag}
                                    </span>
                                </div>
                                <h4 className="text-2xl font-black text-text-primary mb-4 font-jakarta tracking-tight leading-tight">
                                    {feature.title}
                                </h4>
                                <p className="text-text-secondary text-[15px] leading-relaxed mb-6 font-medium opacity-80">
                                    {feature.description}
                                </p>
                                <div className="w-full h-px bg-border/40 mb-6"></div>
                                <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Sparkles size={12} className="text-brand-primary" />
                                    {feature.subtext}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default FeaturesSection;
