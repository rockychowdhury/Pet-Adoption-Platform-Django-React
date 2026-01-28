import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Share2, Heart, MapPin,
    Clock, Sparkles, ShieldCheck, Scale, Activity,
    Users, Info, MessageCircle, AlertCircle, CheckCircle, CheckCircle2, Flag,
    Cake, Ruler, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useRehoming from '../../hooks/useRehoming';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Buttons/Button';
import IconButton from '../../components/common/Buttons/IconButton';
import { formatDistanceToNow } from 'date-fns';
import ApplicationOptionsModal from '../../components/common/Modals/ApplicationOptionsModal';

const PetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { useGetListingDetail } = useRehoming();
    const { data: listing, isLoading, isError } = useGetListingDetail(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

    // Sync image index if listing changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [listing]);

    if (isLoading) return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-8">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-brand-primary/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-sm font-logo font-black uppercase tracking-[0.3em] text-text-tertiary animate-pulse">Loading Profile</p>
        </div>
    );

    if (isError || !listing) return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-8 text-center text-gray-900">
            <div className="w-20 h-20 bg-status-error/10 rounded-full flex items-center justify-center text-status-error mb-6">
                <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-logo font-black tracking-tight text-text-primary mb-2">Listing Not Found</h1>
            <p className="text-text-secondary  mb-8 max-w-sm">The pet profile you are looking for might have been removed or the link is broken.</p>
            <Button variant="primary" onClick={() => navigate('/pets')}>Browse Other Pets</Button>
        </div>
    );

    const {
        pet,
        owner,
        reason,
        urgency,
        ideal_home_notes,
        location_city,
        location_state,
        published_at,
        created_at
    } = listing;

    const {
        name: pet_name,
        species,
        breed = 'Mixed Breed',
        age_display,
        gender,
        weight_kg,
        size_category,
        spayed_neutered,
        microchipped,
        description,
        traits = [],
        photos = [],
        main_photo
    } = pet;

    const allPhotos = photos.length > 0 ? photos.map(p => p.url) : [main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80'];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);

    const handleMessageOwner = () => {
        if (owner?.phone_number) {
            // Remove any non-digit characters from phone number
            const cleanPhone = owner.phone_number.replace(/\D/g, '');
            const message = encodeURIComponent(`Hi ${owner.first_name}, I'm interested in adopting ${pet_name} from PetCircle!`);
            window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
        } else {
            // Fallback or notification if no phone number
            console.log("No phone number found for owner");
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary pb-24 text-text-primary">
            {/* Context Header */}
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between pointer-events-none sticky top-24 z-10 transition-all duration-300">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors"
                >
                    <ChevronLeft size={14} />
                    Back
                </button>
                <div className="flex items-center gap-3 pointer-events-auto">
                    <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-bg-surface hover:shadow-sm transition-all bg-transparent">
                        <Share2 size={16} />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-bg-surface hover:shadow-sm transition-all bg-transparent">
                        <Heart size={16} />
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT CONTENT AREA */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Gallery Section */}
                        <section className="space-y-6">
                            <div className="relative aspect-[16/9] rounded-[32px] overflow-hidden bg-bg-surface shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-border/40 group">
                                <IconButton
                                    icon={<ChevronLeft size={20} />}
                                    onClick={prevImage}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 text-black border-none transition-all flex items-center justify-center"
                                />
                                <IconButton
                                    icon={<ChevronRight size={20} />}
                                    onClick={nextImage}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 text-black border-none transition-all flex items-center justify-center"
                                />
                                <img
                                    src={allPhotos[currentImageIndex]}
                                    alt={pet_name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-6 right-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur text-white text-[10px] font-bold">
                                    {currentImageIndex + 1} / {allPhotos.length} Photos
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 p-1 overflow-x-auto scrollbar-none">
                                {allPhotos.map((photo, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${currentImageIndex === i ? 'border-brand-primary' : 'border-transparent opacity-60'}`}
                                    >
                                        <img src={photo} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Pet Identity Area */}
                        <section className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <Sparkles size={10} className="fill-current" /> {species}
                                </span>
                                <span className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock size={10} className="fill-current" /> {urgency === 'immediate' ? 'Immediate Need' : urgency}
                                </span>
                                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">
                                    Listed {formatDistanceToNow(new Date(published_at || created_at), { addSuffix: true })}
                                </span>
                            </div>

                            <div className="space-y-0.5">
                                <h1 className="text-5xl font-black tracking-tighter text-text-primary uppercase leading-none">
                                    {pet_name}
                                </h1>
                                <p className="text-xl text-text-tertiary">
                                    {breed} • {age_display}
                                </p>
                            </div>
                        </section>

                        {/* Bento Stats Grid */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Gender" value={gender} icon={<Users size={16} className="text-[#3B82F6]/60" />} />
                            <StatCard label="Weight" value={weight_kg ? `${weight_kg} Kg` : 'N/A'} icon={<Scale size={16} className="text-[#F59E0B]/60" />} />
                            <StatCard label="Size" value={size_category} icon={<Ruler size={16} className="text-[#FEF3C7]/60" />} />
                            <StatCard label="Vaccinated" value="Check w/ Owner" icon={<CheckCircle2 size={16} className="text-[#10B981]/60" />} />
                        </section>

                        <div className="h-px bg-border/50" />

                        {/* Content Sections */}
                        <section className="space-y-16">
                            <div className="space-y-12">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-1 bg-brand-primary rounded-full" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">My Story</h3>
                                </div>

                                <div className="space-y-10">
                                    <ContentBlock title="About Me" text={description || "A wonderful companion looking for a fresh start."} />
                                    <ContentBlock title="Why I need a new home" text={reason} />
                                    <ContentBlock title="My Ideal Home" text={ideal_home_notes || "Looking for a loving family with space to run."} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 pt-4">
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-text-primary mb-8">Compatibility</h3>
                                    <div className="space-y-6">
                                        <CompatibilityItem label="Kids" value={traits.some(t => t.toLowerCase().includes('kids')) ? 'FRIENDLY' : 'UNKNOWN'} />
                                        <CompatibilityItem label="Dogs" value={traits.some(t => t.toLowerCase().includes('dog')) ? 'FRIENDLY' : 'UNKNOWN'} />
                                        <CompatibilityItem label="Cats" value={traits.some(t => t.toLowerCase().includes('cat')) ? 'FRIENDLY' : 'UNKNOWN'} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-text-primary mb-8">Health & Facts</h3>
                                    <div className="space-y-6">
                                        <FactItem label="Spayed / Neutered" value={spayed_neutered ? 'Yes' : 'No'} />
                                        <FactItem label="Microchipped" value={microchipped ? 'Yes' : 'No'} />
                                        <FactItem label="Crate Trained" value={traits.some(t => t.toLowerCase().includes('crate')) ? 'Yes' : 'No'} />
                                        <FactItem label="Vaccinated" value="--" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-40 space-y-8">

                            {/* Adopt Card */}
                            <div className="bg-brand-primary rounded-[32px] p-10 text-text-inverted text-center space-y-6 shadow-xl shadow-brand-primary/20 border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Interested?</p>
                                <h2 className="text-4xl font-black uppercase leading-[0.85] tracking-tight">Adopt {pet_name}</h2>
                                <p className="text-[11px] opacity-80 leading-relaxed max-w-[240px] mx-auto text-white/90">
                                    Start by submitting an inquiry. The owner will review your application and get in touch.
                                </p>
                                <Button
                                    onClick={() => setIsApplicationModalOpen(true)}
                                    className="w-full bg-[#FCF5E5] text-brand-primary hover:bg-white hover:text-brand-primary h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] border-none shadow-xl transition-all duration-300"
                                >
                                    Start Application
                                </Button>
                                <div className="flex items-center justify-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
                                    <ShieldCheck size={12} />
                                    Secure Process
                                </div>
                            </div>

                            {/* Owner Card */}
                            <div className="bg-bg-surface rounded-[32px] border border-border/50 shadow-sm p-10 space-y-8">
                                <div className="space-y-6">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Listed By</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-secondary border border-border">
                                            <img
                                                src={owner.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                                                className="w-full h-full object-cover"
                                                alt={owner.first_name}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-text-primary capitalize">{owner.first_name} {owner.last_name}</h4>
                                            <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mt-1">Identity Unverified</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-bg-secondary rounded-xl p-4 text-center border border-border/50">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-text-tertiary mb-1">City</p>
                                        <p className="text-[11px] font-black text-text-primary truncate">{location_city || 'N/A'}</p>
                                    </div>
                                    <div className="bg-bg-secondary rounded-xl p-4 text-center border border-border/50">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-text-tertiary mb-1">State</p>
                                        <p className="text-[11px] font-black text-text-primary truncate">{location_state || 'N/A'}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleMessageOwner}
                                    className="w-full h-14 rounded-2xl border border-border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-primary hover:bg-bg-secondary transition-all"
                                >
                                    <MessageCircle size={16} />
                                    Message Owner
                                </button>

                                <button className="w-full text-center text-[9px] font-black uppercase tracking-widest text-text-tertiary hover:text-status-error transition-colors opacity-50">
                                    Report Listing
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <ApplicationOptionsModal
                isOpen={isApplicationModalOpen}
                onClose={() => setIsApplicationModalOpen(false)}
                user={user}
                listingId={id}
            />
        </div>
    );
};

// --- Helper Components ---

const StatCard = ({ label, value, icon }) => (
    <div className="bg-bg-surface/40 border border-border/50 rounded-[24px] p-8 space-y-6 hover:bg-bg-surface hover:shadow-sm transition-all group">
        <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
            {icon}
        </div>
        <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-text-tertiary mb-1">{label}</p>
            <p className="text-sm font-black text-text-primary capitalize truncate">{value}</p>
        </div>
    </div>
);

const ContentBlock = ({ title, text }) => (
    <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">{title}</h4>
        <p className="text-base text-text-secondary leading-relaxed ">
            {text || "Information not provided."}
        </p>
    </div>
);

const CompatibilityItem = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 pb-4">
        <span className="text-sm font-bold text-text-primary">{label}</span>
        <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black tracking-widest ${value === 'FRIENDLY' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-bg-secondary text-text-tertiary'}`}>
            {value}
        </span>
    </div>
);

const FactItem = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 pb-4">
        <span className="text-sm font-bold text-text-primary">{label}</span>
        <span className="text-[13px] font-bold text-text-tertiary">{value}</span>
    </div>
);

export default PetDetailPage;
