import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Calendar, Share2, LayoutDashboard, FileText, Sparkles } from 'lucide-react';
import star from '../../assets/star.png';

const FeaturesSection = () => {
    const [activeTab, setActiveTab] = useState('adopters');
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
            description: "Swap stories, get behaviour tips, and learn from adopters, foster parents, and rehomers all in one warm feed.",
            subtext: "React with likes, hearts, and thoughtful comments."
        },
        {
            title: "Chat with Shelters",
            tag: "CHAT",
            icon: <MessageSquare size={20} />,
            description: "Message coordinators directly from any pet page to clarify history, requirements, or next steps before you visit.",
            subtext: "Secure, in-platform messaging for both sides."
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
            title: "Shelter Dashboards",
            tag: "SHELTERS",
            icon: <LayoutDashboard size={20} />,
            description: "See every pet, message, visit, and adoption request at a glance so your team can spend more time with animals.",
            subtext: "Built for busy teams with clear priorities."
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
                <div className="text-center mb-20 relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary font-logo mb-4 relative inline-block">
                        Everything in <span className="text-brand-secondary">One Place</span>
                        <img src={star} alt="" className="absolute -top-6 -right-12 w-10 h-10 animate-spin-slow opacity-80" />
                    </h2>
                    <p className="text-text-secondary text-lg max-w-3xl mx-auto">
                        See exactly how FurEver Home supports adopters and families — from first community post to signed adoption papers.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Sticky Content */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8">
                        <h3 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                            Built for every step of the <span className="text-brand-secondary">adoption journey.</span>
                        </h3>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            Whether you are discovering your first pet or rehoming a pet, you get clear tools for community, communication, visits, and paperwork — without juggling different apps.
                        </p>

                        {/* Toggle */}
                        <div className="inline-flex bg-bg-surface rounded-full p-1 border border-border">
                            <button
                                onClick={() => setActiveTab('adopters')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'adopters' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                For adopters
                            </button>
                            <button
                                onClick={() => setActiveTab('shelters')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'shelters' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                For Rehoming
                            </button>
                        </div>

                        {/* Dynamic List based on Tab */}
                        <div className="space-y-6 pt-4">
                            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                                {activeTab === 'adopters' ? "IF YOU'RE ADOPTING" : "IF YOU RUN A SHELTER"}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {activeTab === 'adopters' ? (
                                    <>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Ask questions in the community</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Follow pets & share profiles</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Chat with owners in real time</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Book meet & greet visits</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">List & update pets in minutes</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Manage adoption requests</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Coordinate visits & follow-ups</span>
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Share updates into the community</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Grid */}
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                ref={el => cardsRef.current[index] = el}
                                className="bg-white p-8 rounded-3xl shadow-soft border border-transparent hover:border-brand-secondary/20 transition-all duration-700 ease-out opacity-0 scale-90 hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-primary">
                                        {feature.icon}
                                    </div>
                                    <span className="px-3 py-1 bg-bg-secondary rounded-lg text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                        {feature.tag}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h4>
                                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                                    {feature.description}
                                </p>
                                <p className="text-xs text-text-secondary/70 font-medium">
                                    {feature.subtext}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
