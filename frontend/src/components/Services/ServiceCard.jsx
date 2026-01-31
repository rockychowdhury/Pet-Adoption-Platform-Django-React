import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Star,
    ShieldCheck,
    Heart,
    Stethoscope,
    Home,
    GraduationCap,
    Scissors,
    Armchair
} from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCard = ({ provider, viewMode = 'grid' }) => {
    // -------------------------------------------------------------------------
    // 1. Data Parsing
    // -------------------------------------------------------------------------
    const {
        business_name,
        avg_rating,
        reviews_count,
        city,
        state,
        media,
        category,
        vet_details,
        trainer_details,
        foster_details,
        groomer_details,
        sitter_details
    } = provider;

    const heroImage = media?.find(m => m.is_primary)?.file_url || media?.[0]?.file_url || 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80';
    const rating = parseFloat(avg_rating || 0).toFixed(1);
    const reviewCount = reviews_count || 0;
    const locationLabel = state ? `${city}, ${state}` : city;

    // Service Type Config
    let TypeIcon = Stethoscope;
    let typeLabel = category?.name || 'Service';

    // Tags aggregation
    const tags = [];
    let priceDisplay = '';
    let pricingUnit = '';

    if (category?.slug === 'veterinary' || vet_details) {
        TypeIcon = Stethoscope;
        typeLabel = 'Veterinary';
        if (vet_details?.clinic_type) tags.push(vet_details.clinic_type.replace('_', ' '));
        if (vet_details?.emergency_services) tags.push('Emergency');
        if (vet_details?.base_price) {
            priceDisplay = `$${Math.round(vet_details.base_price)}`;
            pricingUnit = 'visit'; // or 'starts at'
        }
    } else if (category?.slug === 'training' || trainer_details) {
        TypeIcon = GraduationCap;
        typeLabel = 'Pet Trainer';
        if (trainer_details?.primary_method) tags.push(trainer_details.primary_method.replace('_', ' '));
        if (trainer_details?.offers_group_classes) tags.push('Group Classes');
        if (trainer_details?.offers_board_and_train) tags.push('Board & Train');
        if (trainer_details?.private_session_rate) {
            priceDisplay = `$${Math.round(trainer_details.private_session_rate)}`;
            pricingUnit = '/ hour';
        }
    } else if (category?.slug === 'foster' || foster_details) {
        TypeIcon = Home;
        typeLabel = 'Foster Home';
        if (foster_details?.current_availability === 'available') tags.push('Available Now');
        tags.push(`${foster_details?.capacity || 0} Capacity`);
        if (foster_details?.daily_rate) {
            priceDisplay = `$${Math.round(foster_details.daily_rate)}`;
            pricingUnit = '/ day';
        }
    } else if (category?.slug === 'grooming' || groomer_details) {
        TypeIcon = Scissors;
        typeLabel = 'Grooming';
        if (groomer_details?.salon_type) tags.push(groomer_details.salon_type);
        if (groomer_details?.base_price) {
            priceDisplay = `$${Math.round(groomer_details.base_price)}`;
            pricingUnit = 'starts at';
        }
    } else if (category?.slug === 'pet_sitting' || sitter_details) {
        TypeIcon = Armchair;
        typeLabel = 'Pet Sitter';
        if (sitter_details?.offers_dog_walking) tags.push('Dog Walking');
        if (sitter_details?.offers_house_sitting) tags.push('House Sitting');
        if (sitter_details?.walking_rate) {
            priceDisplay = `$${Math.round(sitter_details.walking_rate)}`;
            pricingUnit = '/ walk';
        }
    }

    // Limit tags for display
    const visibleTags = tags.slice(0, 3);

    // -------------------------------------------------------------------------
    // 2. Render
    // -------------------------------------------------------------------------
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${viewMode === 'list' ? 'md:flex-row' : ''} h-full`}
        >
            {/* Image Section */}
            <div className={`relative overflow-hidden bg-gray-100 ${viewMode === 'list' ? 'w-full md:w-72 h-48 md:h-auto' : 'aspect-[4/3] w-full'}`}>
                <Link to={`/services/${provider.id}`} className="block w-full h-full">
                    <img
                        src={heroImage}
                        alt={business_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>
                {/* Heart Button */}
                {/* <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors">
                    <Heart size={18} />
                </button> */}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                {/* Category Label */}
                <div className="flex items-center gap-2 mb-2 text-text-tertiary">
                    <TypeIcon size={14} strokeWidth={2} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{typeLabel}</span>
                </div>

                {/* Title */}
                <Link to={`/services/${provider.id}`} className="block mb-2">
                    <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-brand-primary transition-colors line-clamp-1">
                        {business_name}
                    </h3>
                </Link>

                {/* Rating & Location Row */}
                <div className="flex flex-col gap-1 mb-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400 gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    fill={star <= Math.round(rating) ? "currentColor" : "none"}
                                    strokeWidth={2}
                                    className={star > Math.round(rating) ? "text-gray-300" : ""}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{rating}</span>
                        <span className="text-xs text-gray-500">({reviewCount})</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-text-secondary mt-1">
                        <MapPin size={14} />
                        <span className="text-xs font-medium">{locationLabel}</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {visibleTags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-text-secondary capitalize">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Footer / Price & Action */}
                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                        {priceDisplay ? (
                            <>
                                <span className="text-lg font-black text-text-primary">{priceDisplay}</span>
                                <span className="text-xs text-text-tertiary ml-1 font-medium">{pricingUnit}</span>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-text-tertiary">Contact for price</span>
                        )}
                    </div>

                    <Link
                        to={`/services/${provider.id}`}
                        className="px-6 py-2.5 bg-brand-primary/5 text-brand-primary rounded-full text-xs font-bold hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95 border border-transparent hover:border-brand-primary/20"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(ServiceCard);
