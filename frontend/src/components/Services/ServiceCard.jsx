import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Star,
    ShieldCheck,
    Heart,
    Share2,
    Clock,
    Stethoscope,
    Home,
    Dog,
    Cat,
    Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCard = ({ provider, viewMode = 'grid' }) => {
    // Logic to determine type based on content or category
    const isVet = !!provider.vet_details || provider.category?.slug === 'veterinary' || provider.category?.name?.toLowerCase().includes('vet');
    const isFoster = !!provider.foster_details || provider.category?.slug === 'foster' || provider.category?.name?.toLowerCase().includes('foster');

    // Visual Helpers
    const heroImage = provider.media?.find(m => m.is_primary)?.file_url || provider.media?.[0]?.file_url || 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80';

    // Mock Data / Fallbacks
    const rating = provider.avg_rating || 'New';
    const reviewCount = provider.reviews_count || 0;
    const distance = provider.distance ? `${provider.distance} miles away` : ''; // API might need to return distance annotation

    // Formatting Price/Details
    let priceDisplay = 'Contact for details';
    if (isFoster && provider.foster_details?.daily_rate) {
        priceDisplay = `$${provider.foster_details.daily_rate}/day`;
    } else if (isVet && provider.vet_details?.base_price) {
        priceDisplay = `Exam from $${provider.vet_details.base_price}`;
    }

    // Foster Specifics
    const capacityStatus = provider.foster_details?.current_availability > 0 ? 'Available' : 'Full';
    const capacityColor = capacityStatus === 'Available' ? 'bg-green-500' : 'bg-red-500';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${viewMode === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col'}`}
        >
            {/* Visual Header */}
            <div className={`relative shrink-0 overflow-hidden ${viewMode === 'list' ? 'w-full md:w-72 h-48 md:h-auto' : 'w-full h-48'}`}>
                <img
                    src={heroImage}
                    alt={provider.business_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {provider.is_verified && (
                        <div className="bg-white/90 backdrop-blur-sm text-[#2D5A41] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <ShieldCheck size={12} fill="currentColor" /> Verified
                        </div>
                    )}
                    {isVet && provider.vet_details?.is_emergency && (
                        <div className="bg-red-500 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            24/7 Emergency
                        </div>
                    )}
                </div>

                <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm hover:bg-white text-white hover:text-red-500 rounded-full transition-all duration-300">
                    <Heart size={18} />
                </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {isFoster ? (
                                <span className={`w-2 h-2 rounded-full ${capacityColor}`}></span>
                            ) : null}
                            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                                {isVet ? (provider.clinic_type || 'Veterinary Clinic') : (isFoster ? 'Foster Care' : provider.category?.name)}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#2D5A41] transition-colors leading-tight">
                            {provider.business_name}
                        </h3>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm justify-end">
                            <Star size={14} fill="currentColor" />
                            {rating}
                        </div>
                        <span className="text-[10px] text-[#9CA3AF] font-medium block">
                            {typeof reviewCount === 'number' ? `(${reviewCount} reviews)` : ''}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-[#4B5563] mb-4">
                    <MapPin size={14} className="text-[#9CA3AF]" />
                    {provider.city}, {provider.state}
                    {distance && (
                        <>
                            <span className="text-[#9CA3AF]">•</span>
                            <span className="text-[#6B7280]">{distance}</span>
                        </>
                    )}
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 pt-4 border-t border-gray-50">
                    {isFoster ? (
                        <>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Availability</p>
                                <p className="text-[13px] font-medium text-[#374151] truncate">
                                    {provider.foster_details?.current_availability || 0} spots
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Rate</p>
                                <p className="text-[13px] font-bold text-[#2D5A41] truncate">{priceDisplay}</p>
                            </div>
                            {provider.foster_details?.environment_details?.has_fenced_yard && (
                                <div className="col-span-2 mt-1 flex items-center gap-1 text-xs text-green-700">
                                    <ShieldCheck size={12} /> Fenced Yard Verified
                                </div>
                            )}
                        </>
                    ) : (
                        // Vet Details
                        <>
                            <div className="col-span-2 mb-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Known For</p>
                                <p className="text-[13px] font-medium text-[#374151] truncate">
                                    {provider.vet_details?.services_offered?.slice(0, 3).map(s => s.name).join(', ') || 'General Care'}
                                </p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Hours</p>
                                <p className="text-[13px] font-medium text-[#374151]">See Profile</p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Rate</p>
                                <p className="text-[13px] font-medium text-[#2D5A41]">{priceDisplay}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-3 pt-2">
                    <Link
                        to={`/services/${provider.id}`}
                        className="flex-1 bg-[#2D5A41] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-[#234532] transition-colors shadow-sm"
                    >
                        View Profile
                    </Link>
                    <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-[#4B5563] hover:bg-gray-50 hover:text-[#1F2937] transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
