import React from 'react';
import { ShieldCheck, History, HeartHandshake, Sparkles, CheckCircle } from 'lucide-react';
import star from '../../assets/star.png';

const TrustSection = () => {
    const trustCards = [
        {
            icon: <History className="text-brand-secondary" />,
            title: "Full Life History",
            description: "No more guesswork. Get complete records and personal stories directly from the owners who raised them.",
            badge: "Transparency"
        },
        {
            icon: <ShieldCheck className="text-brand-primary" />,
            title: "Verified Trust",
            description: "Every member passes identity and ownership checks. Our community is built on safety and accountability.",
            badge: "Security"
        },
        {
            icon: <HeartHandshake className="text-status-success" />,
            title: "Home-to-Home",
            description: "Skip the stressful shelter environment. Pets transition seamlessly between loving homes in a calm, managed way.",
            badge: "Compassion"
        }
    ];

    return (
        <section className="py-24 bg-bg-primary relative overflow-hidden">
            {/* Background Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-primary/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border/50 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                        <Sparkles size={12} className="fill-current" />
                        The PetCircle Difference
                    </div>

                    <div className="relative inline-block">
                        <h2 className="text-5xl md:text-7xl font-black text-text-primary mb-8 font-logo leading-[1.1] tracking-tight">
                            Built on Trust,<br />
                            <span className="text-brand-primary">Driven by Community</span>
                        </h2>
                        <img
                            src={star}
                            alt=""
                            className="absolute -top-12 -right-16 w-12 h-12 animate-spin-slow opacity-60 hidden md:block"
                            style={{ filter: 'brightness(0)' }}
                        />
                    </div>

                    <p className="text-text-secondary text-xl max-w-2xl mx-auto leading-relaxed font-medium opacity-80 mt-4">
                        We're moving beyond traditional shelters to create a safer, more transparent way for pet lovers to connect and care for animals.
                    </p>
                </div>

                {/* Trust Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {trustCards.map((card, idx) => (
                        <div key={idx} className="group relative bg-bg-white p-12 rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.08)] border border-border/40 transition-all duration-700 hover:-translate-y-3 flex flex-col items-center text-center">
                            <div className="mb-10 p-6 rounded-[32px] bg-bg-secondary group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-700 flex items-center justify-center">
                                {React.cloneElement(card.icon, { size: 36, strokeWidth: 1.5 })}
                            </div>

                            <div className="inline-block px-4 py-1.5 bg-bg-secondary rounded-xl text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-6 group-hover:text-brand-primary transition-colors">
                                {card.badge}
                            </div>

                            <h3 className="text-2xl font-black text-text-primary mb-5 font-jakarta tracking-tight leading-tight">
                                {card.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed font-medium text-[15px] opacity-80">
                                {card.description}
                            </p>

                            {/* Corner Accent */}
                            {idx === 1 && (
                                <div className="absolute top-8 right-8 text-brand-primary/40 group-hover:text-brand-primary transition-colors duration-500">
                                    <CheckCircle size={22} strokeWidth={2} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Highlight */}
                <div className="mt-32 p-12 md:p-20 bg-[#638C7D] rounded-[64px] relative overflow-hidden group shadow-2xl shadow-brand-primary/10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="space-y-6 text-center lg:text-left">
                            <h3 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight font-logo">
                                100% Peer-to-Peer <br />
                                <span className="text-[#C98B6B]">Zero Shelter Stress</span>
                            </h3>
                            <p className="text-white/80 font-medium max-w-lg text-lg leading-relaxed mx-auto lg:mx-0">
                                Every pet on PetCircle stays in their original home or a community foster until they find their new family.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8 bg-black/5 p-4 rounded-[40px] backdrop-blur-sm border border-white/5">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="relative group/avatar">
                                        <img
                                            src={`https://i.pravatar.cc/100?img=${i + 14}`}
                                            className="w-14 h-14 rounded-full border-4 border-[#638C7D] object-cover transition-transform group-hover/avatar:scale-110 group-hover/avatar:z-20 relative shadow-xl"
                                            alt="Community Member"
                                        />
                                    </div>
                                ))}
                                <div className="w-14 h-14 rounded-full border-4 border-[#638C7D] bg-[#C98B6B] flex items-center justify-center text-white font-black text-sm z-10 relative shadow-xl">
                                    +5k
                                </div>
                            </div>
                            <div className="flex flex-col justify-center text-center sm:text-left pr-4">
                                <span className="text-white font-black text-2xl leading-none font-jakarta">Verified</span>
                                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Global Community</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
