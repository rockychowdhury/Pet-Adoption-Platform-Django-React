import React, { useState } from 'react';
import { Users, MessageSquare, Calendar, Share2, LayoutDashboard, FileText } from 'lucide-react';

const FeaturesSection = () => {
    const [activeTab, setActiveTab] = useState('adopters');

    const features = [
        {
            title: "Community Forum",
            tag: "COMMUNITY",
            icon: <Users size={20} />,
            description: "Swap stories, get behaviour tips, and learn from adopters, foster parents, and shelter teams all in one warm feed.",
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
            description: "Pick a time, share who is coming, and confirm a visit with the shelter in a guided, step-by-step flow.",
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
            description: "Track every application from 'New' to 'FurEver Home' with notes, documents, and conversations in a single timeline.",
            subtext: "Less email back-and-forth, more happy matches."
        }
    ];

    return (
        <section className="py-24 bg-bg-primary">
            <div className="max-w-[1440px] mx-auto px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary font-logo mb-4">
                        Everything in <span className="text-brand-secondary">One Place</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-3xl mx-auto">
                        See exactly how FurEver Home supports adopters and shelters — from first community post to signed adoption papers.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Sticky Content */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8">
                        <h3 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                            Built for every step of the <span className="text-brand-secondary">adoption journey.</span>
                        </h3>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            Whether you are discovering your first pet or running a busy shelter, you get clear tools for community, communication, visits, and paperwork — without juggling different apps.
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
                                For shelters
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
                                        <span className="px-4 py-2 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary">Chat with shelters in real time</span>
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
                            <div key={index} className="bg-white p-8 rounded-3xl shadow-soft border border-transparent hover:border-brand-secondary/20 transition-all duration-300 hover:-translate-y-1">
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
