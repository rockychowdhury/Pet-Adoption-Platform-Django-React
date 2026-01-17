import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ChevronRight, PauseCircle, Home, Users, Phone, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import usePets from '../../hooks/usePets';
import Card from '../../components/common/Layout/Card';

const RehomingCheckInPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { useGetPet } = usePets();
    const petId = location.state?.petId;

    // Guard: Redirect if no pet ID
    React.useEffect(() => {
        if (!petId) {
            navigate('/rehoming/select-pet');
        }
    }, [petId, navigate]);

    // Fetch pet details
    const { data: pet, isLoading } = useGetPet(petId);

    // Resources Accordion State
    const [showResources, setShowResources] = useState(false);

    const handleExit = () => {
        // "I Need More Time" - Redirect to dashboard
        navigate('/dashboard');
    };

    const handleContinue = () => {
        navigate('/rehoming/create-request', { state: { petId } });
    };

    if (!petId) return null;
    if (isLoading) return <div className="text-center py-20">Loading...</div>;

    const considerations = [
        { icon: Home, text: "Have you explored pet-friendly housing options?" },
        { icon: Users, text: "Are there family or friends who could temporarily help?" },
        { icon: Phone, text: "Have you contacted local pet support organizations?" }
    ];

    return (
        <div className="pb-20">
            {/* 1. Visual Header (Full Width with Blur) */}
            <div className="relative w-full h-[350px] md:h-[450px] bg-gray-900 overflow-hidden">
                {pet?.media && pet.media.length > 0 ? (
                    <>
                        <img src={pet.media[0].url} alt={pet.name} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-gray-900/40 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/10">
                        <Heart size={150} />
                    </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-10 p-6 text-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden mb-6">
                        {pet?.media && pet.media.length > 0 ? (
                            <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover" />
                        ) : <Heart className="w-full h-full p-6 text-white/50 bg-white/10" />}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg mb-2">
                        {pet?.name}
                    </h1>
                    <p className="text-white/80 text-lg font-medium">{pet?.species} • {pet?.age} years old</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">

                {/* 2. Main Content Container */}
                <div className="bg-bg-primary/95 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-8 md:p-12 text-center">

                    {/* Emotional Message */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <Heart className="w-12 h-12 text-brand-primary mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4 text-text-primary font-display">A Safe New Beginning</h2>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            We know that finding a new home for <strong>{pet?.name || 'your pet'}</strong> is an act of love, not giving up.
                            Our community is here to help you find a family that will cherish them just as much as you do.
                        </p>
                    </div>

                    {/* Consideration Prompts */}
                    <div className="bg-bg-secondary/50 rounded-2xl p-8 mb-10 border border-border/50">
                        <h3 className="font-bold text-text-primary mb-6">Before we begin, just a few quick checks:</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {considerations.map((item, idx) => (
                                <div key={idx} className="bg-bg-surface p-4 rounded-xl flex flex-col items-center gap-3 shadow-sm border border-border/50">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                        <item.icon size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-text-secondary">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resource Links (Collapsible) */}
                    <div className="mb-12">
                        <button
                            onClick={() => setShowResources(!showResources)}
                            className="bg-bg-surface border border-border hover:border-brand-primary hover:text-brand-primary text-text-secondary px-6 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-all shadow-sm"
                        >
                            Explore alternatives to rehoming
                            {showResources ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {showResources && (
                            <div className="mt-6 text-left bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-brand-primary">Support Resources</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors">
                                            <ExternalLink size={14} /> Local Pet Food Banks
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors">
                                            <ExternalLink size={14} /> Low-Cost Veterinary Care
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors">
                                            <ExternalLink size={14} /> Pet Behavioral Counseling
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Decision Buttons */}
                    <div className="grid md:grid-cols-2 gap-6 items-center max-w-2xl mx-auto">
                        {/* Option 1: Need More Time */}
                        <button
                            onClick={handleExit}
                            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-border hover:border-text-secondary hover:bg-bg-secondary/50 transition-all group h-full"
                        >
                            <PauseCircle className="w-8 h-8 text-text-tertiary mb-3 group-hover:text-text-primary transition-colors" />
                            <span className="font-bold text-lg text-text-primary mb-1">I Need More Time</span>
                            <span className="text-sm text-text-tertiary">Save draft & return later</span>
                        </button>

                        {/* Option 2: Ready */}
                        <button
                            onClick={handleContinue}
                            className="flex flex-col items-center justify-center p-6 rounded-2xl bg-brand-primary text-white shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 hover:-translate-y-1 transition-all h-full"
                        >
                            <ArrowLeft className="w-8 h-8 mb-3 rotate-180" /> {/* Right arrow icon reuse or custom */}
                            <span className="font-bold text-lg mb-1">Let's Find a Home</span>
                            <span className="text-sm opacity-90">Start the rehoming request</span>
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-text-tertiary">
                        This process is confidential and supportive. You are in control.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default RehomingCheckInPage;
