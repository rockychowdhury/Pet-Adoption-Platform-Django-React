import React from 'react';
import {
    Heart, MapPin, Clock, Sparkles, ShieldCheck,
    Home, Share2, LayoutGrid, List as ListIcon,
    Calendar, CheckCircle2, Info, Trash2, Archive, RotateCcw, Pencil, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PetCard = ({ pet, viewMode = 'grid', variant = 'listing', onDelete, onToggleActive }) => {
    const isProfile = variant === 'profile';

    // -------------------------------------------------------------------------
    // 1. Data Normalization
    // -------------------------------------------------------------------------
    let data = {};

    if (!isProfile && pet.pet) {
        // --- CASE A: Rehoming Listing (Public) ---
        // Structure: { id, pet: {...}, owner: {...}, status, urgency, location_city, ... }
        const p = pet.pet;
        const o = pet.owner || {};

        data = {
            id: pet.id, // Listing ID used for navigation
            name: p.name || 'Unnamed Pet',
            species: p.species || 'Pet',
            breed: p.breed || 'Mixed Breed',
            age: p.age_display || 'Age Unknown',
            gender: p.gender || 'Unknown',

            // Image
            photo: p.main_photo || (p.photos && p.photos[0]?.url) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80',

            // Location
            city: pet.location_city || 'Nearby',
            state: pet.location_state || '',

            // Badges & Status
            status: pet.status,
            urgency: pet.urgency, // 'immediate', 'soon', 'flexible'
            isUrgent: pet.urgency === 'immediate',

            // Engagement
            views: pet.view_count || 0,
            applications: pet.application_count || 0,

            // Trust
            isVerified: o.verified_identity || o.pet_owner_verified,

            // Traits (Placeholder or from pet data if available)
            traits: [] // We can add extraction if API provides it in future
        };

        // Construct formatting
        data.locationLabel = data.state ? `${data.city}, ${data.state}` : data.city;
        data.metaLine = `${data.species} • ${data.breed} • ${data.age} • ${data.gender === 'male' ? 'Male ♂️' : data.gender === 'female' ? 'Female ♀️' : data.gender}`;

    } else {
        // --- CASE B: User Profile (Dashboard) ---
        // Structure: { id, name, species, ... } direct flat object
        data = {
            id: pet.id,
            name: pet.name || pet.pet_name || 'Unnamed',
            species: pet.species || 'Pet',
            breed: pet.breed || 'Mixed',
            age: pet.age_display || (pet.birth_date ? `${new Date().getFullYear() - new Date(pet.birth_date).getFullYear()} years` : 'Age Unknown'),
            gender: pet.gender || 'Unknown',

            photo: (pet.media && pet.media[0]?.url) || pet.photoURL || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80',

            city: pet.location_city || 'Nearby',
            state: pet.location_state || '',

            status: pet.status,
            urgency: 'flexible',
            isUrgent: false,

            views: 0,
            applications: 0,
            isVerified: false,
            traits: pet.personality_traits || []
        };
        data.locationLabel = data.state ? `${data.city}, ${data.state}` : data.city;
    }

    // -------------------------------------------------------------------------
    // 2. Render Components
    // -------------------------------------------------------------------------

    // --- User Dashboard Card (Profile) used in "My Pets" ---
    if (isProfile) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-bg-surface rounded-3xl shadow-sm border border-border/50 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col font-jakarta"
            >
                {/* Hero Zone - Compact 3:2 */}
                <div className="relative aspect-[3/2] overflow-hidden bg-bg-secondary/20">
                    <img
                        src={data.photo}
                        alt={data.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Status (Top Left) */}
                    <div className="absolute top-3 left-3">
                        <div className={`px-2.5 py-1 text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md ${data.status === 'active' ? 'bg-brand-primary/90' : 'bg-gray-500/90'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'active' ? 'bg-white' : 'bg-gray-300'}`} />
                            {data.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    {/* Edit Icon (Top Right) */}
                    <Link
                        to={`/dashboard/pets/${data.id}/edit`}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-text-primary transition-all shadow-sm group/edit"
                    >
                        <Pencil size={14} className="group-hover/edit:scale-90 transition-transform" />
                    </Link>
                </div>

                {/* Content Body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Identity */}
                    <div>
                        <h3 className="font-logo text-xl text-text-primary leading-tight mb-0.5">{data.name}</h3>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-jakarta">
                            {data.species} • <span className="text-text-tertiary">{data.breed}</span>
                        </p>
                    </div>

                    {/* Dashboard Actions */}
                    <div className="mt-auto pt-3 border-t border-border/30 flex gap-2">
                        <Link
                            to={`/pets/${data.id}`} // Assuming simple ID link works or needs fixing if listing ID differs
                            className="flex-1 bg-brand-primary/10 text-brand-primary h-9 rounded-lg flex items-center justify-center text-[10px] font-black uppercase hover:bg-brand-primary hover:text-white transition-all"
                        >
                            <Eye size={14} className="mr-1.5" /> View Public
                        </Link>
                        {onToggleActive && (
                            <button
                                onClick={() => onToggleActive(pet)}
                                className="w-9 h-9 flex items-center justify-center border border-border rounded-lg text-text-tertiary hover:text-brand-primary hover:border-brand-primary transition-colors"
                            >
                                <RotateCcw size={14} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(pet.id)}
                                className="w-9 h-9 flex items-center justify-center border border-status-error/20 rounded-lg text-status-error hover:bg-status-error/10 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- Public Rehoming Listing Card (The New Design) ---
    // Matches docs/listcard.txt

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] border border-border/40 overflow-hidden transition-all duration-300 h-full flex flex-col ${viewMode === 'list' ? 'lg:flex-row' : ''}`}
        >
            {/* 1. Media Section */}
            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'lg:w-72 h-64 lg:h-auto' : 'aspect-[4/3] w-full'}`}>
                <img
                    src={data.photo}
                    alt={data.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-start">
                    {/* Urgency Badge (Left) */}
                    <div className="flex flex-col gap-1.5">
                        {data.isUrgent ? (
                            <div className="px-2.5 py-1 bg-status-error text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-sm animate-pulse-slow">
                                <Clock size={10} strokeWidth={3} /> Immediate
                            </div>
                        ) : data.urgency === 'soon' ? (
                            <div className="px-2.5 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                Due Soon
                            </div>
                        ) : null}

                        {/* Available Badge */}
                        <div className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5">
                            Availability
                        </div>
                    </div>

                    {/* Bookmark Interaction (Right) */}
                    <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-status-error transition-all hover:scale-110 shadow-sm">
                        <Heart size={16} />
                    </button>
                </div>
            </div>

            {/* 2. Content Body */}
            <div className="p-5 flex flex-col flex-1 gap-4 relative">

                {/* Identity Block */}
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-text-primary leading-none mb-1.5 group-hover:text-brand-primary transition-colors">
                            {data.name}
                        </h3>
                        {/* Gender Icon Visual */}
                        {data.gender && (
                            <span className={`text-[12px] px-2 py-0.5 rounded-full font-bold uppercase ${data.gender.toLowerCase() === 'male' ? 'bg-blue-50 text-blue-600' : data.gender.toLowerCase() === 'female' ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-500'}`}>
                                {data.gender.toLowerCase() === 'male' ? 'Boy' : data.gender.toLowerCase() === 'female' ? 'Girl' : '?'}
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                        {data.species} • {data.breed} • {data.age}
                    </p>
                </div>

                {/* Emotional Compatibility (Traits) - Placeholder for now if empty */}
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-bg-secondary/50 text-text-secondary text-[10px] font-bold rounded-full">
                        Friendly
                    </span>
                    <span className="px-3 py-1 bg-bg-secondary/50 text-text-secondary text-[10px] font-bold rounded-full">
                        Home-raised
                    </span>
                </div>

                {/* Location & Trust */}
                <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-text-secondary">
                            <MapPin size={12} className="text-brand-primary" />
                            <span className="text-[11px] font-bold">{data.locationLabel}</span>
                        </div>
                        {data.isVerified ? (
                            <div className="flex items-center gap-1 text-[#2D5A41] text-[10px] font-bold pl-0.5">
                                <ShieldCheck size={10} /> Verified Owner
                            </div>
                        ) : (
                            <div className="text-text-tertiary text-[10px] font-semibold pl-4">
                                Profile Available
                            </div>
                        )}
                    </div>
                </div>

                {/* Engagement Signals */}
                {data.applications > 0 && (
                    <div className="flex items-center gap-3 text-[10px] font-bold text-text-tertiary">
                        <span className="flex items-center gap-1"><Eye size={12} /> {data.views} views</span>
                        <span className="flex items-center gap-1 text-brand-primary"><Heart size={12} /> {data.applications} interested</span>
                    </div>
                )}

                {/* Primary CTA */}
                <div className="grid grid-cols-[1fr,auto] gap-2 pt-2">
                    <Link
                        to={`/pets/${data.id}`}
                        className="h-10 bg-brand-primary text-white rounded-full flex items-center justify-center text-[11px] font-black uppercase tracking-widest hover:bg-brand-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        View Details
                    </Link>
                    <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-text-primary hover:bg-bg-secondary transition-all">
                        <Share2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(PetCard);
