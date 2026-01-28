import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Star,
    ShieldCheck,
    Heart,
    Share2,
    Stethoscope,
    Home,
    GraduationCap,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCard = ({ provider, viewMode = 'grid' }) => {
    // -------------------------------------------------------------------------
    // 1. Data Normalization
    // -------------------------------------------------------------------------

    // Determine Type
    const isVet = !!provider.vet_details || provider.category?.slug === 'veterinary' || provider.category?.name?.toLowerCase().includes('vet');
    const isFoster = !!provider.foster_details || provider.category?.slug === 'foster' || provider.category?.name?.toLowerCase().includes('foster');
    const isTrainer = !!provider.trainer_details || provider.category?.slug === 'training' || provider.category?.name?.toLowerCase().includes('train');

    // Visual Helpers
    const heroImage = provider.media?.find(m => m.is_primary)?.file_url || provider.media?.[0]?.file_url || 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80';

    // Basic Info
    const name = provider.business_name;
    const rating = provider.avg_rating || 0;
    const reviewCount = provider.reviews_count || 0;
    const city = provider.city || 'Nearby';
    const state = provider.state || '';
    const locationLabel = state ? `${city}, ${state}` : city;
    const isVerified = provider.verification_status === 'verified' || provider.is_verified;

    // Service Type Label & Color
    let typeLabel = provider.category?.name || 'Service';
    let typeIcon = null;
    let typeColor = 'text-gray-600 bg-gray-50 border-gray-200';

    if (isVet) {
        typeLabel = provider.vet_details?.clinic_type ? `${provider.vet_details.clinic_type} Clinic` : 'Veterinary';
        typeIcon = Stethoscope;
        typeColor = 'text-blue-600 bg-blue-50 border-blue-100';
    } else if (isFoster) {
        typeLabel = 'Foster Home';
        typeIcon = Home;
        typeColor = 'text-pink-600 bg-pink-50 border-pink-100'; // Matching PetCard "Girl" color vibe roughly or distinct
    } else if (isTrainer) {
        typeLabel = 'Professional Trainer';
        typeIcon = GraduationCap;
        typeColor = 'text-amber-600 bg-amber-50 border-amber-100';
    }

    // Dynamic Stats / Badges
    const stats = [];

    // Pricing / Rate
    let priceDisplay = '';
    if (isFoster && provider.foster_details?.daily_rate) {
        priceDisplay = `$${provider.foster_details.daily_rate}/day`;
    } else if (isVet && provider.vet_details?.base_price) {
        priceDisplay = `from $${provider.vet_details.base_price}`;
    } else if (isTrainer && provider.trainer_details?.private_session_rate) {
        priceDisplay = `$${provider.trainer_details.private_session_rate}/hr`;
    }

    if (priceDisplay) {
        stats.push({ icon: null, label: 'Rate', value: priceDisplay, isPrimary: true });
    }

    // Availability / Emergency
    if (isVet && provider.vet_details?.is_emergency) {
        stats.push({ icon: Clock, label: 'Emergency', value: '24/7', color: 'text-red-500' });
    } else if (isFoster) {
        const spots = provider.foster_details?.current_availability || 0;
        stats.push({
            icon: CheckCircle2,
            label: 'Capacity',
            value: spots > 0 ? `${spots} Spots` : 'Full',
            color: spots > 0 ? 'text-green-600' : 'text-gray-400'
        });
    } else if (isTrainer) {
        const accepting = provider.trainer_details?.accepting_new_clients;
        stats.push({
            icon: CheckCircle2,
            label: 'Status',
            value: accepting ? 'Open' : 'Full',
            color: accepting ? 'text-green-600' : 'text-gray-400'
        });
    }

    // -------------------------------------------------------------------------
    // 2. Render Component (Matches PetCard "Compact Listing")
    // -------------------------------------------------------------------------
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col  relative h-full ${viewMode === 'list' ? 'md:flex-row md:h-48' : ''}`}
        >
            {/* Hero Zone */}
            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-72 h-48' : 'aspect-[3/2]'}`}>
                <Link to={`/services/${provider.id}`} className="block h-full">
                    <img
                        src={heroImage}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {/* Service Type Badge */}
                    <div className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm nav-blur border ${typeColor}`}>
                        {typeIcon && (
                            (() => {
                                const Icon = typeIcon;
                                return <Icon size={10} strokeWidth={3} />;
                            })()
                        )}
                        {typeLabel}
                    </div>

                    {/* Verified Badge */}
                    {isVerified && (
                        <div className="px-2 py-1 bg-bg-surface/90 backdrop-blur-md text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-sm">
                            <ShieldCheck size={10} strokeWidth={3} /> Verified
                        </div>
                    )}
                </div>

                {/* Bookmark Interaction */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all shadow-lg hover:scale-110">
                    <Heart size={14} />
                </button>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Header Info */}
                <div className="flex justify-between items-start">
                    <Link to={`/services/${provider.id}`}>
                        <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-brand-primary transition-colors line-clamp-1">
                            {name}
                        </h3>
                    </Link>
                    {/* Rating */}
                    {rating > 0 && (
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                            <Star size={10} fill="currentColor" strokeWidth={0} />
                            <span className="text-[11px] font-black">{rating}</span>
                        </div>
                    )}
                </div>

                {/* Location Line */}
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5 mt-[-4px]">
                    <MapPin size={10} className="text-brand-primary" /> {locationLabel}
                </p>

                {/* Key Stats Grid - Matches PetCard Layout */}
                <div className="grid grid-cols-2 gap-2 py-2 border-t border-gray-100/60 mt-auto md:mt-0">
                    {/* Dynamic Stat 1 (Rate) */}
                    {stats[0] && (
                        <div className="flex items-center gap-2 text-text-secondary">
                            {stats[0].label === 'Rate' ? (
                                <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md w-full text-center truncate">
                                    {stats[0].value}
                                </span>
                            ) : (
                                <>
                                    {stats[0].icon && (
                                        (() => {
                                            const Icon = stats[0].icon;
                                            return <Icon size={14} className={stats[0].color} />;
                                        })()
                                    )}
                                    <span className="text-xs font-bold">{stats[0].value}</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Dynamic Stat 2 (Capacity/Status) */}
                    {stats[1] ? (
                        <div className="flex items-center gap-2 text-text-secondary">
                            {stats[1].icon && (
                                (() => {
                                    const Icon = stats[1].icon;
                                    return <Icon size={14} className={stats[1].color} />;
                                })()
                            )}
                            <span className="text-xs font-bold">{stats[1].value}</span>
                        </div>
                    ) : (
                        // Fallback: Review Count if no 2nd stat
                        <div className="flex items-center gap-2 text-text-muted">
                            <span className="text-[10px] font-bold">{reviewCount} reviews</span>
                        </div>
                    )}
                </div>


                {/* Footer Actions */}
                <div className="mt-auto pt-2 flex gap-2">
                    <Link
                        to={`/services/${provider.id}`}
                        className="flex-1 bg-text-primary text-text-inverted h-9 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-wider hover:bg-brand-primary hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        View Profile
                    </Link>
                    <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all">
                        <Share2 size={16} />
                    </button>
                </div>

            </div>
        </motion.div>
    );
};

export default React.memo(ServiceCard);
