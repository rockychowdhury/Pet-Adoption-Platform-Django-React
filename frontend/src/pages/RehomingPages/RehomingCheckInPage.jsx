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
            {/* 1. Visual Header (Full Width) */}
            <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900 overflow-hidden">
                {pet?.media && pet.media.length > 0 ? (
                    <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/20">
                        <Heart size={100} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground drop-shadow-lg">
                        {pet?.name}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">

                {/* 2. Main Content Container */}
                <div className="bg-card rounded-3xl shadow-xl border border-border p-8 md:p-12 text-center">

                    {/* Emotional Message */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl font-bold mb-4 text-foreground">We Understand This Is Difficult</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Rehoming a pet is one of the hardest decisions a pet owner can make.
                            We're here to support you through this process and help find the best
                            possible home for {pet?.name}.
                        </p>
                        <p className="text-lg text-muted-foreground mt-4">
                            Before we continue, we want to make sure you've considered all options:
                        </p>
                    </div>

                    {/* Consideration Prompts */}
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        {considerations.map((item, idx) => (
                            <div key={idx} className="bg-secondary/30 p-4 rounded-xl flex flex-col items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm text-primary">
                                    <item.icon size={20} />
                                </div>
                                <p className="text-sm font-medium text-foreground">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Resource Links (Collapsible) */}
                    <div className="mb-12">
                        <button
                            onClick={() => setShowResources(!showResources)}
                            className="bg-primary/5 text-primary hover:bg-primary/10 px-6 py-3 rounded-full font-medium inline-flex items-center gap-2 transition-colors"
                        >
                            View rehoming alternatives
                            {showResources ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {showResources && (
                            <div className="mt-6 text-left bg-secondary/20 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4">Helpful Resources</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                                            <ExternalLink size={14} /> Local Pet Food Banks
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                                            <ExternalLink size={14} /> Low-Cost Veterinary Care
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                                            <ExternalLink size={14} /> Pet Behavioral Counseling
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Pet Summary (Mini) */}
                    <div className="flex items-center justify-center gap-4 py-6 border-t border-b border-border mb-10">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary">
                            {pet?.media && pet.media.length > 0 ? (
                                <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover" />
                            ) : <Heart className="p-2 text-muted-foreground" />}
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg leading-tight">{pet?.name}</h3>
                            <p className="text-xs text-muted-foreground">{pet?.species} • {pet?.age} yrs</p>
                        </div>
                    </div>

                    {/* Decision Buttons */}
                    <div className="grid md:grid-cols-2 gap-6 items-center max-w-2xl mx-auto">
                        {/* Option 1: Need More Time */}
                        <button
                            onClick={handleExit}
                            className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-border hover:border-text-secondary transition-all group"
                        >
                            <span className="font-bold text-lg text-foreground mb-1">I Need More Time to Decide</span>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground">Save as draft and return later</span>
                        </button>

                        {/* Option 2: Ready */}
                        <button
                            onClick={handleContinue}
                            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 hover:-translate-y-1 transition-all"
                        >
                            <span className="font-bold text-lg mb-1">I'm Ready to Proceed</span>
                            <span className="text-sm opacity-90">Continue to rehoming process</span>
                        </button>
                    </div>

                    <p className="mt-8 text-sm text-muted-foreground">
                        Your draft will be saved and you can return anytime.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default RehomingCheckInPage;
