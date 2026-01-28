import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { MapPin, Calendar, Heart, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import usePets from '../../hooks/usePets';
import ApplicationModal from '../../components/Pet/ApplicationModal';

const PetDetailsPage = () => {
    const { id } = useParams();
    const { useGetPet } = usePets();
    const { data: pet, isLoading: loading, error } = useGetPet(id);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !pet) return <div className="min-h-screen flex items-center justify-center">Pet not found.</div>;

    return (
        <div className="min-h-screen bg-bg-primary pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ">
            <div className="max-w-[1200px] mx-auto">
                <Link to="/pets" className="inline-flex items-center text-text-secondary hover:text-brand-secondary mb-8 transition font-medium text-sm">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Pets
                </Link>

                {/* Top Section: Pet Profile Card */}
                <div className="bg-bg-surface rounded-[32px] shadow-soft overflow-hidden border border-white/20 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                        {/* Image Section */}
                        <div className="relative h-[400px] lg:h-auto bg-bg-secondary">
                            <img
                                src={pet.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-6 right-6 flex gap-3">
                                <button className="w-12 h-12 bg-bg-surface/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-status-error transition-all shadow-lg">
                                    <Heart size={24} fill="none" />
                                </button>
                                <button className="w-12 h-12 bg-bg-surface/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-brand-primary transition-all shadow-lg">
                                    <Share2 size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-5xl font-bold text-text-primary font-logo mb-2">{pet.name}</h1>
                                    <p className="text-xl text-text-secondary font-medium">{pet.breed} • Large</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${pet.status === 'available' ? 'bg-status-success text-white' :
                                    pet.status === 'pending' ? 'bg-status-warning text-white' :
                                        'bg-text-tertiary text-white'
                                    }`}>
                                    ● {pet.status}
                                </span>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-bg-primary p-6 rounded-2xl">
                                    <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Age</span>
                                    <span className="text-xl font-bold text-text-primary">{pet.age} months</span>
                                </div>
                                <div className="bg-bg-primary p-6 rounded-2xl">
                                    <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Gender</span>
                                    <span className="text-xl font-bold text-text-primary capitalize">{pet.gender}</span>
                                </div>
                                <div className="bg-bg-primary p-6 rounded-2xl">
                                    <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Color</span>
                                    <span className="text-xl font-bold text-text-primary">{pet.color || "N/A"}</span>
                                </div>
                                <div className="bg-bg-primary p-6 rounded-2xl">
                                    <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Weight</span>
                                    <span className="text-xl font-bold text-text-primary">{pet.weight || "N/A"} kg</span>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-text-primary mb-3">About {pet.name}</h3>
                                <p className="text-text-secondary leading-relaxed text-lg">
                                    {pet.description || `${pet.name} is a wonderful companion looking for a forever home. They are friendly, playful, and ready to be part of your family.`}
                                </p>
                            </div>

                            {pet.is_vaccinated && (
                                <div className="flex items-center gap-3 p-4 bg-status-success/10 rounded-xl text-status-success mb-8 w-fit">
                                    <CheckCircle size={20} className="fill-current" />
                                    <span className="font-bold text-sm">Vaccinated & Healthy</span>
                                </div>
                            )}

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsApplicationModalOpen(true)}
                                    disabled={pet.status !== 'available'}
                                    className="flex-1 py-4 bg-text-primary text-bg-primary rounded-xl font-bold hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                >
                                    {pet.status === 'available' ? `Adopt ${pet.name}` : `Status: ${pet.status}`}
                                </button>
                                <button className="px-8 py-4 text-text-primary font-bold hover:text-brand-secondary transition">
                                    Ask a Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Community & Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Community Questions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-bg-surface rounded-[32px] p-8 shadow-soft border border-white/20">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-text-primary">Community questions about {pet.name}</h3>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-bg-primary rounded-full text-xs font-bold text-text-primary">Questions</button>
                                    <button className="px-4 py-2 hover:bg-bg-primary rounded-full text-xs font-bold text-text-secondary transition">Updates</button>
                                </div>
                            </div>

                            <p className="text-text-secondary text-sm mb-6">Ask current foster parents and adopters about life with {pet.name}.</p>

                            <div className="bg-bg-primary rounded-2xl p-4 mb-8">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-bg-secondary flex-shrink-0"></div>
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            placeholder={`Ask a question about ${pet.name}'s behavior, routine, or needs...`}
                                            className="w-full bg-transparent border-none focus:ring-0 text-text-primary placeholder:text-text-secondary/50 text-sm mb-2"
                                        />
                                        <div className="flex justify-between items-center pt-2 border-t border-border/10">
                                            <span className="text-[10px] text-text-secondary">Visible to shelter staff and public community.</span>
                                            <button className="px-4 py-2 bg-text-primary text-bg-primary rounded-full text-xs font-bold hover:opacity-90">Post question</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Questions */}
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-secondary/10 flex items-center justify-center text-[10px] font-bold text-brand-secondary">AL</div>
                                            <span className="text-sm font-bold text-text-primary">Alex L.</span>
                                        </div>
                                        <span className="text-xs text-text-secondary">2 hours ago</span>
                                    </div>
                                    <p className="text-text-primary font-medium text-sm mb-2">How does {pet.name} do when left alone for a few hours during the workday?</p>
                                    <div className="flex gap-2 mb-2">
                                        <span className="px-2 py-1 bg-bg-primary rounded-md text-[10px] font-bold text-text-secondary">Behavior</span>
                                        <span className="px-2 py-1 bg-bg-primary rounded-md text-[10px] font-bold text-text-secondary">Routine</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-text-secondary font-bold cursor-pointer hover:text-brand-secondary">
                                        <span>3 answers</span>
                                        <span>View thread</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary">MJ</div>
                                            <span className="text-sm font-bold text-text-primary">Maria J.</span>
                                        </div>
                                        <span className="text-xs text-text-secondary">Yesterday</span>
                                    </div>
                                    <p className="text-text-primary font-medium text-sm mb-2">Is {pet.name} comfortable around young children (under 5)?</p>
                                    <div className="flex gap-2 mb-2">
                                        <span className="px-2 py-1 bg-bg-primary rounded-md text-[10px] font-bold text-text-secondary">Family</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-text-secondary font-bold cursor-pointer hover:text-brand-secondary">
                                        <span>1 answer</span>
                                        <span>Answer</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Share Card */}
                        <div className="bg-bg-surface rounded-[32px] p-8 shadow-soft border border-white/20">
                            <h3 className="text-lg font-bold text-text-primary mb-2">Share {pet.name}</h3>
                            <p className="text-text-secondary text-xs mb-6">Invite friends or family to review this profile.</p>
                            <div className="flex gap-2 mb-6">
                                <button className="flex-1 py-2 bg-bg-primary rounded-full text-xs font-bold text-text-primary hover:bg-border transition">Email</button>
                                <button className="flex-1 py-2 bg-bg-primary rounded-full text-xs font-bold text-text-primary hover:bg-border transition">Message</button>
                                <button className="flex-1 py-2 bg-bg-primary rounded-full text-xs font-bold text-text-primary hover:bg-border transition">Copy link</button>
                            </div>
                            <div className="flex items-center gap-2 bg-bg-primary p-2 rounded-xl">
                                <span className="text-xs text-text-secondary truncate flex-grow px-2">https://petshelter.org/p/{pet.id}</span>
                                <button className="px-3 py-1 bg-text-primary text-bg-primary rounded-lg text-[10px] font-bold">Copy</button>
                            </div>
                        </div>

                        {/* Shelter Contact */}
                        <div className="bg-bg-surface rounded-[32px] p-8 shadow-soft border border-white/20">
                            <h3 className="text-lg font-bold text-text-primary mb-2">Shelter & contact</h3>
                            <p className="text-text-secondary text-xs mb-6">Chat directly with {pet.name}'s caretakers.</p>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-bg-secondary"></div>
                                <div>
                                    <h4 className="font-bold text-text-primary text-sm">Sunny Paws Rescue</h4>
                                    <p className="text-xs text-text-secondary">San Diego, CA</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-status-warning/10 text-status-warning rounded-full text-[10px] font-bold">Avg. response &lt; 2 hrs</span>
                                <span className="px-3 py-1 bg-bg-primary text-text-secondary rounded-full text-[10px] font-bold">Open today • 10am–6pm</span>
                            </div>

                            <div className="flex gap-4 items-center">
                                <button className="flex-grow py-3 bg-text-primary text-bg-primary rounded-xl font-bold text-sm hover:opacity-90">Chat with shelter</button>
                                <button className="font-bold text-sm text-text-primary hover:text-brand-secondary">Call</button>
                            </div>
                        </div>

                        {/* Adoption Steps */}
                        <div className="bg-bg-surface rounded-[32px] p-8 shadow-soft border border-white/20">
                            <h3 className="text-lg font-bold text-text-primary mb-2">Adoption next steps</h3>
                            <p className="text-text-secondary text-xs mb-6">What to expect if you apply for {pet.name}.</p>

                            <ul className="space-y-4 text-xs text-text-secondary mb-6">
                                <li className="flex gap-2">
                                    <span className="text-brand-secondary font-bold">•</span>
                                    Submit a short application with details about your home and routine.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-brand-secondary font-bold">•</span>
                                    Schedule a virtual or in-person meet & greet with {pet.name} and shelter staff.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-brand-secondary font-bold">•</span>
                                    Complete a quick reference check and home readiness review.
                                </li>
                            </ul>

                            <p className="text-[10px] text-text-secondary/70">Already applied? Use the chat above to ask about the status of your application.</p>
                        </div>
                    </div>
                </div>
            </div>

            <ApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => setIsApplicationModalOpen(false)}
                petId={pet.id}
                petName={pet.name}
            />
        </div>
    );
};

export default PetDetailsPage;
