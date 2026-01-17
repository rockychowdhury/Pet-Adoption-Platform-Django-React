import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Share2, Heart, MapPin,
    Clock, Sparkles, ShieldCheck, Scale, Activity,
    Users, Info, MessageCircle, AlertCircle, CheckCircle, CheckCircle2, Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useRehoming from '../../hooks/useRehoming';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Buttons/Button';
import { formatDistanceToNow } from 'date-fns';

const PetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { useGetListingDetail } = useRehoming();
    const { data: listing, isLoading, isError } = useGetListingDetail(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Sync image index if listing changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [listing]);

    if (isLoading) return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-sm font-logo font-black uppercase tracking-[0.3em] text-text-tertiary animate-pulse">Loading Profile</p>
        </div>
    );

    if (isError || !listing) return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-status-error/10 rounded-full flex items-center justify-center text-status-error mb-6">
                <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-logo font-black tracking-tight text-text-primary mb-2">Listing Not Found</h1>
            <p className="text-text-secondary font-jakarta mb-8 max-w-sm">The pet profile you are looking for might have been removed or the link is broken.</p>
            <Button variant="primary" onClick={() => navigate('/pets')}>Browse Other Pets</Button>
        </div>
    );

    // Destructure Listing Data
    const {
        pet,
        owner,
        reason,
        urgency,
        ideal_home_notes,
        location_city,
        location_state,
        published_at,
        created_at,
        view_count,
        application_count
    } = listing;

    // Destructure Pet Data from nested object
    const {
        name: pet_name,
        species,
        breed = 'Mixed Breed',
        age_display,
        gender,
        weight = 'N/A',
        photos = [],
        main_photo,
        behavioral_profile = {},
        medical_history = {}
    } = pet;

    const allPhotos = photos.length > 0 ? photos.map(p => p.url) : [main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80'];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);

    // Helpers for compatibility
    const compatibility = [
        { label: 'Kids', value: behavioral_profile.good_with_children || behavioral_profile.good_with_kids, icon: Users },
        { label: 'Dogs', value: behavioral_profile.good_with_dogs, icon: Sparkles },
        { label: 'Cats', value: behavioral_profile.good_with_cats, icon: Heart },
    ];

    const getUrgencyColor = (u) => {
        if (u === 'immediate') return 'text-status-error bg-status-error/10 border-status-error/20';
        if (u === 'soon') return 'text-status-warning bg-status-warning/10 border-status-warning/20';
        return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
    };

    return (
        <div className="min-h-screen bg-bg-secondary/30 pb-32 font-jakarta">
            {/* Top Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/10 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary hover:text-brand-primary transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full border border-border/40 group-hover:border-brand-primary flex items-center justify-center transition-all bg-white shadow-sm">
                            <ChevronLeft size={18} />
                        </div>
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-text-secondary hover:bg-brand-secondary/5 hover:text-brand-secondary hover:border-brand-secondary transition-all bg-white shadow-sm">
                            <Share2 size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-text-secondary hover:bg-status-error/5 hover:text-status-error hover:border-status-error transition-all bg-white shadow-sm">
                            <Heart size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN - GALLERY & STORY */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Hero Image Section */}
                        <section className="relative space-y-6">
                            <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl bg-bg-surface border border-border/20 group">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={allPhotos[currentImageIndex]}
                                        alt={pet_name}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none transition-opacity duration-500" />

                                <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                                    <div className="flex gap-3">
                                        {allPhotos.length > 1 && (
                                            <>
                                                <button onClick={prevImage} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-text-primary transition-all pointer-events-auto shadow-lg">
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button onClick={nextImage} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-text-primary transition-all pointer-events-auto shadow-lg">
                                                    <ChevronRight size={24} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest pointer-events-auto">
                                        {currentImageIndex + 1} / {allPhotos.length} Photos
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {allPhotos.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-none">
                                    {allPhotos.map((photo, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${currentImageIndex === i ? 'border-brand-primary scale-105 shadow-lg ring-2 ring-brand-primary/30' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={photo} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Pet Name & Badge Quick Row */}
                        <section className="bg-bg-surface p-8 sm:p-12 rounded-[48px] border border-border/20 shadow-sm relative overflow-hidden group">

                            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <div className="px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles size={12} /> {species}
                                        </div>
                                        {urgency && (
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${getUrgencyColor(urgency)}`}>
                                                <Clock size={12} /> {urgency === 'immediate' ? 'Immediate Need' : urgency.replace('_', ' ')}
                                            </div>
                                        )}
                                        <div className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-black uppercase tracking-widest">
                                            Listed {formatDistanceToNow(new Date(published_at || created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-logo font-black tracking-tighter text-text-primary leading-[0.9] mb-4">
                                        {pet_name}
                                    </h1>
                                    <p className="text-xl md:text-2xl font-jakarta font-medium text-text-secondary flex flex-wrap items-center gap-3">
                                        {breed} <span className="hidden md:inline w-1.5 h-1.5 rounded-full bg-gray-300" /> {age_display}
                                    </p>
                                </div>
                                <div className="p-5 bg-bg-secondary rounded-[24px] border border-border/20 flex items-center gap-4 min-w-[200px]">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary mb-1">Located In</p>
                                        <p className="font-bold text-text-primary">{location_city || 'Unknown'}, {location_state || ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Gender', value: gender, icon: Users, color: 'text-brand-primary' },
                                    { label: 'Weight', value: weight !== 'N/A' && weight ? `${weight} kg` : 'Unknown', icon: Scale, color: 'text-brand-secondary' },
                                    { label: 'Energy', value: behavioral_profile.energy_level || 'Medium', icon: Activity, color: 'text-status-warning' },
                                    { label: 'Vaccinated', value: medical_history.vaccinations_up_to_date ? 'Yes' : 'Unknown', icon: ShieldCheck, color: 'text-status-success' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-bg-secondary/40 p-5 rounded-3xl border border-border/10 flex flex-col gap-3 group/stat hover:bg-white hover:border-brand-primary/30 transition-all duration-300">
                                        <stat.icon className={`${stat.color} transition-transform group-hover/stat:scale-110`} size={22} />
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary mb-1">{stat.label}</p>
                                            <p className="font-jakarta font-bold text-text-primary capitalize text-sm">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Story Section */}
                        <section className="bg-bg-surface p-8 sm:p-12 rounded-[48px] border border-border/20 shadow-sm">
                            <h2 className="text-2xl font-logo font-black tracking-tight text-text-primary uppercase mb-8 flex items-center gap-4">
                                <span className="w-10 h-1 bg-brand-primary rounded-full" />
                                My Story & Reason
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-text-tertiary mb-3">Why needs a home</h3>
                                    <p className="text-lg font-jakarta font-medium text-text-secondary leading-relaxed">
                                        {reason || "No specific reason provided."}
                                    </p>
                                </div>
                                {ideal_home_notes && (
                                    <div className="pt-6 border-t border-border/10">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-text-tertiary mb-3">Ideal Home</h3>
                                        <p className="text-base text-text-secondary leading-relaxed">
                                            {ideal_home_notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Behavior & Compatibility */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-bg-surface p-8 rounded-[40px] border border-border/20 shadow-sm">
                                <h3 className="text-lg font-logo font-black text-text-primary uppercase tracking-wider mb-8 flex items-center gap-3">
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
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.value === true || item.value === 'yes' ? 'bg-status-success/10 text-status-success' : (item.value === false || item.value === 'no' ? 'bg-status-error/10 text-status-error' : 'bg-gray-100 text-gray-400')}`}>
                                                {item.value === true || item.value === 'yes' ? 'Good' : (item.value === false || item.value === 'no' ? 'Not Compatible' : 'Unknown')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-bg-surface p-8 rounded-[40px] border border-border/20 shadow-sm">
                                <h3 className="text-lg font-logo font-black text-text-primary uppercase tracking-wider mb-8 flex items-center gap-3">
                                    <Info size={20} className="text-brand-secondary" />
                                    About Me
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'House Trained', value: behavioral_profile.house_trained },
                                        { label: 'Crate Trained', value: behavioral_profile.crate_trained },
                                        { label: 'Spayed / Neutered', value: medical_history.spayed_neutered },
                                        { label: 'Special Needs', value: medical_history.special_needs },
                                    ].map((rule, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-bg-secondary/30">
                                            <span className="text-sm font-jakarta font-bold text-text-secondary">{rule.label}</span>
                                            {rule.value ? (
                                                <CheckCircle2 className="text-status-success" size={20} />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 uppercase">--</span>
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
                            <div className="bg-brand-primary rounded-[48px] p-8 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                                <div className="relative z-10 space-y-8">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Interested?</p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-3xl font-logo font-black uppercase">Adopt {pet_name}</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-jakarta font-medium leading-relaxed opacity-90">
                                            Start by submitting an inquiry. The owner will review your application and get in touch.
                                        </p>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full py-5 rounded-2xl bg-white text-brand-primary hover:bg-brand-secondary hover:text-white transition-all font-logo font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                        onClick={() => navigate(`/rehoming/listings/${id}/apply`)}
                                    >
                                        Start Application
                                    </Button>

                                    <div className="flex items-center justify-center gap-2 pt-2 opacity-60">
                                        <ShieldCheck size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">
                                            Secure Process
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* OWNER CARD */}
                            <div className="mt-8 bg-white rounded-[40px] p-8 border border-border/20 shadow-sm group hover:shadow-md transition-all">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="relative">
                                        <img
                                            src={owner.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80"}
                                            className="w-16 h-16 rounded-[20px] object-cover ring-4 ring-bg-secondary group-hover:ring-brand-primary/20 transition-all"
                                            alt={owner.first_name}
                                        />
                                        {owner.verified_identity && (
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-status-success rounded-full border-2 border-white flex items-center justify-center text-white">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Listed By</p>
                                        <h4 className="text-lg font-logo font-black text-text-primary uppercase tracking-tight">{owner.first_name} {owner.last_name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            {owner.verified_identity ?
                                                <span className="text-[9px] font-black uppercase tracking-widest text-status-success flex items-center gap-1"><ShieldCheck size={10} /> Verified ID</span>
                                                : <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Identity Unverified</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-bg-secondary/40 p-3 rounded-2xl border border-border/10 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary mb-1">City</p>
                                        <p className="font-bold text-text-primary text-sm truncate">{owner.location_city || 'N/A'}</p>
                                    </div>
                                    <div className="bg-bg-secondary/40 p-3 rounded-2xl border border-border/10 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary mb-1">State</p>
                                        <p className="font-bold text-text-primary text-sm truncate">{owner.location_state || 'N/A'}</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 rounded-xl border-2 border-border/30 text-text-secondary hover:border-brand-primary hover:text-brand-primary transition-all font-logo font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                                    <MessageCircle size={14} /> Message Owner
                                </button>
                            </div>

                            {/* REPORT BUTTON */}
                            <button className="w-full mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-status-error transition-colors opacity-70 hover:opacity-100">
                                <Flag size={14} /> Report Listing
                            </button>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PetDetailPage;
