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
    const isVet = provider.provider_type === 'vet';
    const isFoster = provider.provider_type === 'foster';

    // Mock Data Fallbacks (ensure UI looks good even with partial data)
    const rating = provider.avg_rating || 4.8;
    const reviewCount = provider.reviews_count || 124;
    const distance = provider.distance || '2.5 miles away';
    const price = isFoster ? `$${provider.foster_details?.daily_rate || 35}/day` : 'Exam from $65';

    // Foster Specifics
    const capacityStatus = provider.foster_details?.capacity_status || 'Available'; // Available, Limited, Full
    const capacityColor = {
        'Available': 'bg-green-500',
        'Limited': 'bg-yellow-500',
        'Full': 'bg-red-500'
    }[capacityStatus] || 'bg-gray-400';

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
                    src={provider.photos?.[0] || 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80'}
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
                    {isVet && provider.is_emergency && (
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
                                {isVet ? (provider.clinic_type || 'General Practice') : (capacityStatus === 'Available' ? 'Spaces Available' : capacityStatus)}
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
                            ({reviewCount} reviews)
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-[#4B5563] mb-4">
                    <MapPin size={14} className="text-[#9CA3AF]" />
                    {provider.city}, {provider.state}
                    <span className="text-[#9CA3AF]">•</span>
                    <span className="text-[#6B7280]">{distance}</span>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 pt-4 border-t border-gray-50">
                    {isFoster ? (
                        <>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Species</p>
                                <div className="flex items-center gap-1 text-[13px] font-medium text-[#374151]">
                                    <Dog size={14} /> <Cat size={14} />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Environment</p>
                                <p className="text-[13px] font-medium text-[#374151] truncate">Home + Fenced Yard</p>
                            </div>
                            <div className="col-span-2 mt-2">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Starting Rate</p>
                                <p className="text-[16px] font-bold text-[#2D5A41]">{price}</p>
                            </div>
                        </>
                    ) : (
                        // Vet Details
                        <>
                            <div className="col-span-2 mb-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Services</p>
                                <p className="text-[13px] font-medium text-[#374151] truncate">Wellness, Surgery, Dental</p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Hours</p>
                                <p className="text-[13px] font-medium text-[#374151]">Mon-Sat 8am-7pm</p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase">Exam</p>
                                <p className="text-[13px] font-medium text-[#2D5A41]">{price}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-3 pt-2">
                    <Link
                        to={`/services/${provider.provider_type}/${provider.id}`}
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
