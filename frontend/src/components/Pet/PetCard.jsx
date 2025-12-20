import React from 'react';
import {
    Heart, MapPin, Clock, Sparkles, ShieldCheck,
    Home, Share2, LayoutGrid, List as ListIcon,
    Calendar, CheckCircle2, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PetCard = ({ pet, viewMode = 'grid' }) => {
    // Basic data extraction with fallbacks
    const {
        id,
        pet_name = 'Unnamed Pet',
        species = 'Pet',
        breed = 'Mixed Breed',
        main_photo,
        age_display = 'Young',
        location_city = 'Nearby',
        location_state = '',
        urgency_level = 'flexible',
        adoption_fee = '0',
        is_vet_verified = false,
        owner_verified_identity = false,
        behavioral_profile = {},
        rehoming_story = ''
    } = pet;

    const isUrgent = urgency_level === 'immediate';
    const photoUrl = main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80';

    // Personality tags from behavioral profile
    const personalityTags = Object.entries(behavioral_profile || {})
        .filter(([key, value]) => (key === 'energy_level' || value === 'yes') && key !== 'house_trained')
        .map(([key, value]) => {
            if (key === 'energy_level') return value >= 4 ? 'High Energy' : value <= 2 ? 'Calm' : 'Moderate Energy';
            return key.replace(/_/g, ' ').replace('good with ', '');
        })
        .slice(0, 3);

    const GridView = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col"
        >
            {/* Image Container with Overlay */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={photoUrl}
                    alt={pet_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3">
                    {isUrgent && (
                        <div className="px-3 py-1 bg-[#EF4444] text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                            <Clock size={12} strokeWidth={3} /> Urgent
                        </div>
                    )}
                </div>

                {/* Heart Button */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#EF4444] transition-all group/heart shadow-sm">
                    <Heart size={18} className="transition-all" />
                </button>

                {/* Name & Location Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-0.5">{pet_name}</h3>
                    <div className="flex items-center gap-1.5 text-white/90 text-[13px] font-medium">
                        <MapPin size={14} className="text-white/70" /> {location_city}, {location_state || 'USA'}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                            {breed || species}
                        </p>
                        <p className="text-[13px] text-[#9CA3AF] font-medium">
                            {age_display} • {pet.gender || 'Unknown'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[14px] font-bold text-[#2D5A41]">
                            ${parseFloat(adoption_fee || 0).toFixed(0)} Fee
                        </p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {personalityTags.length > 0 ? personalityTags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563] rounded-md">
                            {tag}
                        </span>
                    )) : (
                        <span className="px-3 py-1 bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563] rounded-md">
                            Loving Companion
                        </span>
                    )}
                </div>

                {/* Story Snippet */}
                <p className="text-[13px] text-[#9CA3AF] font-medium line-clamp-2 leading-relaxed">
                    {rehoming_story || `${pet_name} is a wonderful companion looking for a forever home. Extremely friendly and ready to join your family.`}
                </p>

                {/* Verification & Button */}
                <div className="mt-auto pt-2 space-y-4">
                    <div className="flex gap-4">
                        {is_vet_verified && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2D5A41]">
                                <ShieldCheck size={14} /> Vet Verified
                            </div>
                        )}
                        {owner_verified_identity && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2D5A41]">
                                <ShieldCheck size={14} /> ID Verified
                            </div>
                        )}
                    </div>

                    <Link
                        to={`/pets/${id}`}
                        className="flex items-center justify-center w-full py-3 bg-[#2D5A41] text-white rounded-lg font-bold text-[14px] hover:bg-[#234532] transition-colors shadow-sm"
                    >
                        View {pet_name}'s Story
                    </Link>
                </div>
            </div>
        </motion.div>
    );

    const ListView = () => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group flex flex-col lg:flex-row bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full lg:h-64"
        >
            <div className="relative w-full lg:w-64 h-64 lg:h-full overflow-hidden shrink-0">
                <img
                    src={photoUrl}
                    alt={pet_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4">
                    {isUrgent && (
                        <div className="px-3 py-1 bg-[#EF4444] text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                            <Clock size={12} strokeWidth={3} /> Urgent
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-3xl font-bold text-[#1F2937] leading-none">{pet_name}</h3>
                                {owner_verified_identity && (
                                    <ShieldCheck size={20} className="text-[#2D5A41]" />
                                )}
                            </div>
                            <p className="text-[13px] font-bold text-[#4B5563] uppercase tracking-wider">
                                {breed} • {age_display}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#2D5A41]">${parseFloat(adoption_fee || 0).toFixed(0)}</p>
                            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Adoption Fee</p>
                        </div>
                    </div>

                    <p className="text-[14px] text-[#4B5563] font-medium line-clamp-2 leading-relaxed mb-4">
                        {rehoming_story || `A wonderful companion searching for a forever family who will cherish them. Health checked and ready for their next adventure.`}
                    </p>

                    <div className="flex flex-wrap gap-4 items-center text-[12px] font-medium text-[#9CA3AF]">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-[#9CA3AF]" /> {location_city}, {location_state || 'USA'}
                        </div>
                        {behavioral_profile?.house_trained === 'yes' && (
                            <div className="flex items-center gap-1.5">
                                <Home size={16} className="text-[#9CA3AF]" /> House-trained
                            </div>
                        )}
                        {personalityTags.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={16} className="text-[#9CA3AF]" /> {personalityTags[0]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-50">
                    <Link
                        to={`/pets/${id}`}
                        className="px-8 py-3 bg-[#2D5A41] text-white rounded-lg font-bold text-[13px] hover:bg-[#234532] transition-colors"
                    >
                        View Details
                    </Link>
                    <div className="flex gap-2 ml-auto">
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-lg hover:text-[#EF4444] hover:bg-gray-100 transition-all border border-transparent">
                            <Heart size={20} />
                        </button>
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-lg hover:text-[#2D5A41] hover:bg-gray-100 transition-all border border-transparent text-[#4B5563]">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return viewMode === 'grid' ? <GridView /> : <ListView />;
};

export default PetCard;
