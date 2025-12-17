import React from 'react';
import {
    Search, UserPlus, Send, MessageCircle, Users, Home, PartyPopper,
    ClipboardCheck, FileText, ShieldCheck, FolderOpen, HeartHandshake,
    CheckCircle, Clock, MapPin, FileSignature, ArrowRight
} from 'lucide-react';

import star from '../../assets/star.png';
import stars from '../../assets/stars.png';

const HowItWorks = () => {
    const rehomingSteps = [
        {
            step: "1. Complete Assessment",
            icon: <ClipboardCheck size={24} />,
            description: "We'll help you explore all options first. If rehoming is necessary, we'll guide you through a pre-rehoming assessment to understand your situation.",
            badge: "~15 mins",
            badgeIcon: <Clock size={14} />,
            footer: "Includes resource check"
        },
        {
            step: "2. Create a Detailed Listing",
            icon: <FileText size={24} />,
            description: "Share your pet's story, personality, photos, and medical history. The more details you provide, the better the match.",
            badge: "~30 mins",
            badgeIcon: <Clock size={14} />,
            footer: "Requires medical records"
        },
        {
            step: "3. We Review Your Listing",
            icon: <ShieldCheck size={24} />,
            description: "Our team reviews every listing to ensure quality, safety, and completeness before it goes live to our community.",
            badge: "24-48 hours",
            badgeIcon: <Clock size={14} />,
            footer: null
        },
        {
            step: "4. Review Applications",
            icon: <FolderOpen size={24} />,
            description: "Potential adopters will apply with detailed profiles. You review them and choose the best match for your pet's specific needs.",
            badge: "Varies",
            badgeIcon: <Users size={14} />,
            footer: null
        },
        {
            step: "5. Arrange a Meet & Greet",
            icon: <HeartHandshake size={24} />,
            description: "Meet approved applicants in person in a safe, public place. See how they interact with your pet before making a decision.",
            badge: "In-person",
            badgeIcon: <MapPin size={14} />,
            footer: "Safety guide provided"
        },
        {
            step: "6. Complete the Adoption",
            icon: <CheckCircle size={24} />,
            description: "Sign the rehoming agreement and transfer ownership. We provide all the necessary digital documentation.",
            badge: "Final Step",
            badgeIcon: <FileSignature size={14} />,
            footer: null
        }
    ];

    const adoptionSteps = [
        {
            step: "Step 1",
            icon: <Search size={28} />,
            title: 'Browse',
            description: 'Use our advanced filters to find pets that match your lifestyle, location, and experience level.',
        },
        {
            step: "Step 2",
            icon: <UserPlus size={28} />,
            title: 'Create Profile',
            description: 'Complete your Adopter Profile. This acts as your universal resume for all applications.',
        },
        {
            step: "Step 3",
            icon: <Send size={28} />,
            title: 'Apply',
            description: 'Submit an application for a specific pet. Include a personal message to the current owner.',
        },
        {
            step: "Step 4",
            icon: <MessageCircle size={28} />,
            title: 'Interview',
            description: 'Chat with the owner securely through our platform. They may ask follow-up questions.',
        },
        {
            step: "Step 5",
            icon: <Users size={28} />,
            title: 'Meet & Greet',
            description: 'Arrange an in-person meeting to ensure you and the pet connect well.',
        },
        {
            step: "Step 6",
            icon: <Home size={28} />,
            title: 'Trial',
            description: 'Some owners offer a short trial period or foster-to-adopt arrangement.',
        },
        {
            step: "Step 7",
            icon: <PartyPopper size={28} />,
            title: 'Adopt',
            description: 'Finalize the adoption, pay any fees, and welcome your new family member home!',
        }
    ];

    const faqs = [
        {
            question: "Is there an adoption fee?",
            answer: "Yes, most rehomers ask for a small rehoming fee. This covers basic medical costs and ensures the adopter is serious. Our platform charges a small service fee to cover verification and hosting."
        },
        {
            question: "How do you verify users?",
            answer: "We use a multi-step identity verification process. Users must provide valid ID and pass our background checks before they can post a listing or submit an adoption application."
        },
        {
            question: "What if the adoption doesn't work out?",
            answer: "Our adoption agreement includes a return policy clause. Most owners agree to take the pet back within a certain window if it's not a match, ensuring the pet always has a safe place."
        }
    ];

    return (
        <section className="py-24 bg-bg-primary relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Decorative Stars */}
                <img src={stars} alt="" className="absolute top-10 right-10 w-16 h-16 opacity-20 animate-pulse" style={{ filter: 'brightness(0)' }} />
                <img src={star} alt="" className="absolute bottom-8 -left-5 w-10 h-10 opacity-10 animate-spin-slow" style={{ filter: 'brightness(0)' }} />

                {/* --- Main Section Header --- */}
                <div className="text-center mb-24 relative">
                    <h2 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 font-logo relative inline-block">
                        How PetCircle Works
                        <img src={star} alt="" className="absolute -top-4 -right-10 w-8 h-8 animate-spin-slow opacity-80" style={{ filter: 'brightness(0)' }} />
                    </h2>
                    <p className="text-text-secondary text-xl max-w-3xl mx-auto leading-relaxed">
                        A responsible, transparent, and safe approach to pet rehoming and adoption.
                    </p>
                </div>

                {/* --- Rehoming Section --- */}
                <div className="mb-32">
                    <div className="text-center mb-16 relative">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 font-logo relative inline-block">
                            Rehoming Your <span className="text-brand-secondary">Pet</span>
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            We guide you through every step to ensure your pet finds the perfect new family.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {rehomingSteps.map((item, index) => (
                            <div key={index} className="flex gap-6 md:gap-8 items-start relative">
                                {/* Icon Circle */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-brand-accent/30 flex items-center justify-center text-brand-secondary bg-white z-10 relative mt-2">
                                    {item.icon}
                                </div>

                                {/* Connecting Line */}
                                {index !== rehomingSteps.length - 1 && (
                                    <div className="absolute left-[23px] top-14 bottom-[-32px] w-[2px] bg-brand-accent/20 md:block hidden"></div>
                                )}

                                {/* Card */}
                                <div className="flex-grow bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-transparent hover:border-brand-accent/20 transition-all duration-300 w-full group">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-bold text-text-primary">{item.step}</h3>
                                        <div className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#FFF8E7] rounded-xl text-text-secondary text-sm font-medium">
                                            {item.badgeIcon}
                                            {item.badge}
                                        </div>
                                    </div>

                                    <p className="text-text-secondary leading-relaxed mb-4">
                                        {item.description}
                                    </p>

                                    {item.footer && (
                                        <div className="text-brand-secondary text-sm font-semibold">
                                            {item.footer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Adoption Section --- */}
                <div className="mb-32">
                    <div className="text-center mb-16 relative">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 font-logo relative inline-block">
                            Adopting a <span className="text-brand-secondary">Pet</span>
                            <img src={star} alt="" className="absolute -top-2 -right-8 w-6 h-6 animate-spin-slow opacity-80" style={{ filter: 'brightness(0)' }} />
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Finding your new best friend is a journey we take together.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {adoptionSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-brand-accent/20 group h-full flex flex-col items-start ${index === 6 ? 'lg:col-start-1 lg:row-start-3' : ''}`}
                            >
                                <span className="inline-block px-4 py-1.5 bg-[#FFF0D4] text-brand-secondary text-xs font-bold rounded-full mb-6">
                                    {step.step}
                                </span>

                                <div className="text-brand-secondary mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>

                                <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                                <p className="text-text-secondary leading-relaxed text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- FAQ Section --- */}
                <div className="mb-32">
                    <div className="text-center mb-16 relative">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 font-logo relative inline-block">
                            Frequently Asked <span className="text-brand-secondary">Questions</span>
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-12">
                        {faqs.map((faq, index) => (
                            <div key={index} className="space-y-4">
                                <h3 className="text-xl font-bold text-text-primary">
                                    {faq.question}
                                </h3>
                                <p className="text-text-secondary leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Call to Action --- */}
                <div className="relative">
                    <div className="absolute inset-0 bg-transparent rounded-[48px]"></div>
                    <div className="bg-[#2D2D2D] rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden">
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-logo">
                                Ready to get started?
                            </h2>
                            <p className="text-gray-300 text-lg mb-10">
                                Whether you're looking to adopt or need to find a new home for your pet, we're here to help.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="h-14 px-8 bg-[#A68A6D] text-white font-bold rounded-full hover:bg-[#94785C] transition-colors duration-300 flex items-center gap-2">
                                    Start Rehoming
                                </button>
                                <button className="h-14 px-8 bg-transparent border-2 border-gray-600 text-white font-bold rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center gap-2">
                                    Browse Available Adopt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
