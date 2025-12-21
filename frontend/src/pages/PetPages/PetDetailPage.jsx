import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Share2, Heart, MapPin,
    Calendar, CheckCircle, AlertCircle, Maximize2,
    Flag, MessageCircle, Clock, Sparkles, ShieldCheck,
    Scale, Activity, Home, Users, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import usePets from '../../hooks/usePets';
import Button from '../../components/common/Buttons/Button';

const PetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useGetPet } = usePets();
    const { data: pet, isLoading, isError } = useGetPet(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Sync image index if pet changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [pet]);

    if (isLoading) return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-sm font-logo font-black uppercase tracking-[0.3em] text-text-tertiary animate-pulse">Loading Profile</p>
        </div>
    );

    if (isError || !pet) return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-status-error/10 rounded-full flex items-center justify-center text-status-error mb-6">
                <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-logo font-black tracking-tight text-text-primary mb-2">Pet Not Found</h1>
            <p className="text-text-secondary font-jakarta mb-8 max-w-sm">The pet profile you are looking for might have been removed or the link is broken.</p>
            <Button variant="primary" onClick={() => navigate('/adopt')}>Browse Other Pets</Button>
        </div>
    );

    const {
        pet_name,
        species,
        breed = 'Mixed Breed',
        age_display,
        gender,
        weight,
        location_city,
        location_state,
        rehoming_story,
        photos = [],
        main_photo,
        urgency_level = 'flexible',
        behavioral_profile = {},
        medical_history = {},
        owner_name,
        pet_owner_avatar,
        published_at,
        is_active
    } = pet;

    const allPhotos = photos.length > 0 ? photos : [main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80'];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);

    // Helpers for compatibility
    const compatibility = [
        { label: 'Kids', value: behavioral_profile.good_with_children || behavioral_profile.good_with_kids, icon: Users },
        { label: 'Dogs', value: behavioral_profile.good_with_dogs, icon: Sparkles },
        { label: 'Cats', value: behavioral_profile.good_with_cats, icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-bg-secondary/30 pb-32">
            {/* Top Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary hover:text-brand-primary transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full border border-border/40 group-hover:border-brand-primary flex items-center justify-center transition-all">
                            <ChevronLeft size={18} />
                        </div>
                        Back to Search
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-text-secondary hover:bg-brand-secondary/5 hover:text-brand-secondary hover:border-brand-secondary transition-all">
                            <Share2 size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-text-secondary hover:bg-status-error/5 hover:text-status-error hover:border-status-error transition-all">
                            <Heart size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN - GALLERY & STORY */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Hero Image Section */}
                        <section className="relative space-y-6">
                            <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl bg-bg-surface border border-border/20">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={allPhotos[currentImageIndex]}
                                        alt={pet_name}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                                    <div className="flex gap-3">
                                        <button onClick={prevImage} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-text-primary transition-all pointer-events-auto shadow-lg">
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button onClick={nextImage} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-text-primary transition-all pointer-events-auto shadow-lg">
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                    <div className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest pointer-events-auto">
                                        {currentImageIndex + 1} / {allPhotos.length} Photos
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-none">
                                {allPhotos.map((photo, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`w-28 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${currentImageIndex === i ? 'border-brand-primary scale-105 shadow-lg shadow-brand-primary/20' : 'border-border/10 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={photo} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Pet Name & Badge Quick Row */}
                        <section className="bg-bg-surface p-12 rounded-[48px] border border-border/20 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-brand-primary/10 transition-all duration-1000" />

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="px-5 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={12} /> {species}
                                        </div>
                                        <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${urgency_level === 'immediate' ? 'bg-status-error/10 text-status-error border-status-error/20' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'}`}>
                                            <Clock size={12} /> {urgency_level.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <h1 className="text-6xl md:text-8xl font-logo font-black tracking-tighter text-text-primary leading-[0.8] mb-4">
                                        {pet_name}
                                    </h1>
                                    <p className="text-2xl font-jakarta font-medium text-text-secondary flex items-center gap-3">
                                        {breed} <span className="w-2 h-2 rounded-full bg-brand-primary/30" /> {age_display}
                                    </p>
                                </div>
                                <div className="p-6 bg-bg-secondary rounded-[32px] border border-border/20 flex items-center gap-4">
                                    <MapPin className="text-brand-primary" size={24} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Located In</p>
                                        <p className="font-logo font-black uppercase text-text-primary whitespace-nowrap">{location_city}, {location_state}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Gender', value: gender, icon: Users, color: 'text-brand-primary' },
                                    { label: 'Weight', value: `${weight} lbs`, icon: Scale, color: 'text-brand-secondary' },
                                    { label: 'Energy', value: behavioral_profile.energy_level || 'Medium', icon: Activity, color: 'text-status-warning' },
                                    { label: 'Health', value: medical_history.vaccination_status || 'Up to Date', icon: ShieldCheck, color: 'text-status-success' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-bg-secondary/40 p-6 rounded-3xl border border-border/10 flex flex-col gap-3 group/stat hover:bg-white hover:border-brand-primary/30 transition-all duration-300">
                                        <stat.icon className={`${stat.color} transition-transform group-hover/stat:scale-110`} size={24} />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary mb-1">{stat.label}</p>
                                            <p className="font-jakarta font-bold text-text-primary capitalize">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Story Section */}
                        <section className="bg-bg-surface p-12 rounded-[48px] border border-border/20 shadow-sm">
                            <h2 className="text-3xl font-logo font-black tracking-tight text-text-primary uppercase mb-8 flex items-center gap-4">
                                <span className="w-12 h-1 bg-brand-primary rounded-full" />
                                My Story
                            </h2>
                            <div className="text-lg font-jakarta font-medium text-text-secondary leading-relaxed space-y-6">
                                {rehoming_story || "No story provided yet. This wonderful companion is looking for a loving forever home where they can share their unique personality and charm."}
                            </div>
                        </section>

                        {/* Behavior & Compatibility */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-bg-surface p-10 rounded-[40px] border border-border/20 shadow-sm">
                                <h3 className="text-xl font-logo font-black text-text-primary uppercase tracking-wider mb-8 flex items-center gap-3">
                                    <Users size={20} className="text-brand-primary" />
                                    Compatibility
                                </h3>
                                <div className="space-y-4">
                                    {compatibility.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-bg-secondary/30">
                                            <div className="flex items-center gap-3">
                                                <item.icon size={18} className="text-text-tertiary" />
                                                <span className="text-sm font-jakarta font-bold text-text-secondary">{item.label}</span>
                                            </div>
                                            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.value === true || item.value === 'yes' ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'}`}>
                                                {item.value === true || item.value === 'yes' ? 'Excellent' : 'Not Recommended'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-bg-surface p-10 rounded-[40px] border border-border/20 shadow-sm">
                                <h3 className="text-xl font-logo font-black text-text-primary uppercase tracking-wider mb-8 flex items-center gap-3">
                                    <Info size={20} className="text-brand-secondary" />
                                    House Rules
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'House Trained', value: behavioral_profile.house_trained },
                                        { label: 'Crate Trained', value: behavioral_profile.crate_trained },
                                        { label: 'Spayed / Neutered', value: medical_history.spayed_neutered },
                                    ].map((rule, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-bg-secondary/30">
                                            <span className="text-sm font-jakarta font-bold text-text-secondary">{rule.label}</span>
                                            {rule.value ? (
                                                <CheckCircle className="text-status-success" size={20} />
                                            ) : (
                                                <AlertCircle className="text-text-tertiary" size={20} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN - ADOPT CTA & OWNER */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* ADOPT CARD */}
                        <section className="sticky top-32">
                            <div className="bg-brand-primary rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                                <div className="relative z-10 space-y-8">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Interested in Adopting?</p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-4xl font-logo font-black uppercase">Start Process</h2>
                                            <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/10 border border-white/10">
                                            <ShieldCheck size={20} className="shrink-0 text-brand-secondary" />
                                            <p className="text-sm font-jakarta font-medium leading-relaxed">Verified Rehoming: Peer-to-peer transfer with full background support.</p>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/10 border border-white/10">
                                            <MessageCircle size={20} className="shrink-0 text-brand-secondary" />
                                            <p className="text-sm font-jakarta font-medium leading-relaxed">Direct Communication: Message the owner to learn more about {pet_name}.</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full py-6 rounded-3xl bg-white text-brand-primary hover:bg-brand-secondary hover:text-white transition-all font-logo font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl"
                                        onClick={() => navigate(`/rehoming/listings/${id}/apply`)}
                                    >
                                        Adopt {pet_name}
                                    </Button>

                                    <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-60">
                                        Response time: Typically within 24 hours
                                    </p>
                                </div>
                            </div>

                            {/* OWNER CARD */}
                            <div className="mt-8 bg-bg-surface rounded-[40px] p-8 border border-border/20 shadow-sm group">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="relative">
                                        <img
                                            src={pet_owner_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80"}
                                            className="w-20 h-20 rounded-[24px] object-cover ring-4 ring-bg-secondary group-hover:ring-brand-primary/20 transition-all"
                                            alt={owner_name}
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-status-success rounded-full border-4 border-white flex items-center justify-center text-white">
                                            <CheckCircle size={14} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Listed By</p>
                                        <h4 className="text-xl font-logo font-black text-text-primary uppercase tracking-tight">{owner_name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary">Verified Owner</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-bg-secondary/40 p-4 rounded-2xl border border-border/10 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Listed</p>
                                        <p className="font-logo font-black text-text-primary text-xl">1 Pet</p>
                                    </div>
                                    <div className="bg-bg-secondary/40 p-4 rounded-2xl border border-border/10 text-center">
                                        <p className="font-logo font-black text-text-primary text-xl">2023</p>
                                    </div>
                                </div>
                                <button className="w-full py-4 rounded-2xl border-2 border-border/30 text-text-secondary hover:border-brand-primary hover:text-brand-primary transition-all font-logo font-black uppercase tracking-widest text-[10px]">
                                    View Full Profile
                                </button>
                            </div>

                            {/* REPORT BUTTON */}
                            <button className="w-full mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-status-error transition-colors">
                                <Flag size={14} /> Report this Listing
                            </button>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PetDetailPage;
