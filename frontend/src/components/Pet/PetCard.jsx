import React from 'react';
import {
    Heart, MapPin, Clock, Sparkles, ShieldCheck,
    Home, Share2, LayoutGrid, List as ListIcon,
    Calendar, CheckCircle2, Info, Trash2, Archive, RotateCcw, Pencil
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PetCard = ({ pet, viewMode = 'grid', variant = 'listing', onDelete, onToggleActive }) => {
    // Determine if this is a User Profile view or a Public Listing view
    const isProfile = variant === 'profile';

    // Flexible Data Extraction to support both schemas (Rehoming Listing vs User Pet)
    const id = pet.id;
    const petName = pet.pet_name || pet.name || 'Unnamed Pet';
    const species = pet.species || 'Pet';
    const breed = pet.breed || 'Mixed Breed';

    // Photo Logic: 'main_photo' (Listing) vs 'media' array (User Pet)
    let photoUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80';
    if (pet.main_photo) {
        photoUrl = pet.main_photo;
    } else if (pet.media && pet.media.length > 0) {
        photoUrl = pet.media[0].url; // Take first photo from media array
    } else if (pet.photos && pet.photos.length > 0) {
        // Fallback for older structure if needed, or if photos is used in listing
        photoUrl = typeof pet.photos[0] === 'string' ? pet.photos[0] : pet.photos[0].url;
    } else if (pet.photoURL) {
        photoUrl = pet.photoURL;
    }

    const ageDisplay = pet.age_display || (pet.birth_date ? `${new Date().getFullYear() - new Date(pet.birth_date).getFullYear()} years` : 'Age Unknown');

    // Location Logic
    const city = pet.location_city || pet.owner?.location_city || 'Nearby';
    const state = pet.location_state || pet.owner?.location_state || '';
    const locationString = state ? `${city}, ${state}` : city;

    // Badges & Status
    const urgencyLevel = pet.urgency_level || 'flexible';
    const isUrgent = !isProfile && urgencyLevel === 'immediate';
    const adoptionFee = pet.adoption_fee || '0';

    // Status Logic: Backend sends 'status' ('active', 'rehomed', 'deceased')
    // For listings, we might still check is_active or status.
    const isActive = pet.status === 'active' || pet.is_active === true;

    // Verification
    const isVetVerified = !isProfile && (pet.is_vet_verified || false);
    const isIdentityVerified = !isProfile && (pet.owner_verified_identity || pet.owner?.verified_identity || false);

    // Description
    const description = pet.rehoming_story || pet.description || `A wonderful ${species} looking for a great home.`;

    // Personality Tags
    // API sends 'traits' as array of {id, name} objects
    const behavioralProfile = pet.behavioral_profile || {};
    const traitsList = pet.traits || pet.personality_traits || [];

    let displayTags = [];
    if (traitsList.length > 0) {
        // Handle both string arrays and object arrays
        displayTags = traitsList.slice(0, 3).map(t => typeof t === 'string' ? t : t.name);
    } else {
        const profileTraits = Object.entries(behavioralProfile)
            .filter(([key, value]) => (key === 'energy_level' || value === 'yes') && key !== 'house_trained')
            .map(([key, value]) => {
                if (key === 'energy_level') return value >= 4 ? 'High Energy' : value <= 2 ? 'Calm' : 'Moderate Energy';
                return key.replace(/_/g, ' ').replace('good with ', '');
            });
        displayTags = profileTraits.slice(0, 3);
    }

    const GridView = () => {
        if (isProfile) {
            // Dashboard "My Pet" Card Design (Compact & Branded)
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-bg-surface rounded-3xl shadow-sm border border-border/50 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col font-jakarta"
                >
                    {/* Hero Zone - Compact 3:2 */}
                    <div className="relative aspect-[3/2] overflow-hidden bg-bg-secondary/20">
                        <img
                            src={photoUrl}
                            alt={petName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Status (Top Left) */}
                        <div className="absolute top-3 left-3">
                            <div className={`px-2.5 py-1 text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md ${isActive ? 'bg-brand-primary/90' : 'bg-gray-500/90'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-300'}`} />
                                {isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        {/* Edit Icon (Top Right) */}
                        <Link
                            to={`/dashboard/pets/${id}/edit`}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-text-primary transition-all shadow-sm group/edit"
                            title="Edit Profile"
                        >
                            <Pencil size={14} className="group-hover/edit:scale-90 transition-transform" />
                        </Link>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 flex flex-col gap-3 flex-1">
                        {/* Identity Block */}
                        <div>
                            <h3 className="font-logo text-xl text-text-primary leading-tight mb-0.5">{petName}</h3>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-jakarta">
                                {species} • <span className="text-text-tertiary">{breed}</span>
                            </p>
                        </div>

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span className="text-sm">🎂</span>
                                <span className="text-[11px] font-bold">{ageDisplay}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span className="text-sm">⚧</span>
                                <span className="text-[11px] font-bold capitalize">{pet.gender || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span className="text-sm">📏</span>
                                <span className="text-[11px] font-bold capitalize">{pet.size_category || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span className="text-sm">⚖️</span>
                                <span className="text-[11px] font-bold">{pet.weight_kg ? `${pet.weight_kg} kg` : '--'}</span>
                            </div>
                        </div>

                        {/* Health & Safety Signals */}
                        <div className="flex flex-wrap gap-1.5">
                            <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${pet.spayed_neutered ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-status-warning/10 text-status-warning border border-status-warning/20'}`}>
                                {pet.spayed_neutered ? <CheckCircle2 size={10} /> : <Info size={10} />}
                                {pet.spayed_neutered ? 'Neutered' : 'Not Neutered'}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${pet.microchipped ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-status-warning/10 text-status-warning border border-status-warning/20'}`}>
                                {pet.microchipped ? <CheckCircle2 size={10} /> : <Info size={10} />}
                                {pet.microchipped ? 'Chipped' : 'Not Chipped'}
                            </div>
                        </div>

                        {/* Personality Snapshot */}
                        <div className="flex flex-wrap gap-1">
                            {(displayTags || []).map((trait, i) => (
                                <span key={i} className="px-2 py-0.5 bg-bg-secondary text-text-secondary text-[9px] font-bold uppercase tracking-wider rounded-md border border-border/50">
                                    {trait}
                                </span>
                            ))}
                            {(pet.personality_traits || []).length > 3 && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-text-tertiary">
                                    +{pet.personality_traits.length - 3} more
                                </span>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="mt-auto pt-3 border-t border-border/30 text-[9px] font-medium text-text-tertiary flex flex-col gap-0.5">
                            <span>Added {new Date(pet.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Primary Actions */}
                        <div className="flex items-center gap-2 pt-1">
                            {/* View Details -> Public Page */}
                            <Link
                                to={`/pets/${id}`}
                                className="flex-1 bg-brand-primary text-text-inverted h-10 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                View Details
                            </Link>

                            {/* Secondary Actions */}
                            {onToggleActive && (
                                <button
                                    onClick={(e) => { e.preventDefault(); onToggleActive(pet); }}
                                    className={`w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-300 ${isActive ? 'border-border text-text-tertiary hover:text-text-primary hover:bg-bg-secondary' : 'border-brand-primary/30 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10'}`}
                                    title={isActive ? "Mark as Inactive" : "Mark as Active"}
                                >
                                    {isActive ? <Archive size={16} /> : <RotateCcw size={16} />}
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => { e.preventDefault(); onDelete(id); }}
                                    className="w-10 h-10 flex items-center justify-center border border-status-error/20 text-status-error bg-status-error/5 rounded-full hover:bg-status-error/10 hover:shadow-sm transition-all duration-300"
                                    title="Delete Pet"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            );
        }

        // Default Listing Card Design
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col"
            >
                {/* Image Container with Overlay */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={photoUrl}
                        alt={petName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
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
                        <h3 className="text-2xl font-bold text-white mb-0.5">{petName}</h3>
                        <div className="flex items-center gap-1.5 text-white/90 text-[13px] font-medium">
                            <MapPin size={14} className="text-white/70" /> {locationString}
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
                                {ageDisplay} • {pet.gender || 'Unknown'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[14px] font-bold text-[#2D5A41]">
                                ${parseFloat(adoptionFee).toFixed(0)} Fee
                            </p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {displayTags.length > 0 ? displayTags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563] rounded-md capitalize">
                                {tag}
                            </span>
                        )) : (
                            <span className="px-3 py-1 bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563] rounded-md">
                                Lovely Pet
                            </span>
                        )}
                    </div>

                    {/* Story Snippet */}
                    <p className="text-[13px] text-[#9CA3AF] font-medium line-clamp-2 leading-relaxed">
                        {description}
                    </p>

                    {/* Action Area */}
                    <div className="mt-auto pt-2 space-y-4">
                        {(isVetVerified || isIdentityVerified) && (
                            <div className="flex gap-4">
                                {isVetVerified && (
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2D5A41]">
                                        <ShieldCheck size={14} /> Vet Verified
                                    </div>
                                )}
                                {isIdentityVerified && (
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2D5A41]">
                                        <ShieldCheck size={14} /> ID Verified
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Link
                                to={`/pets/${id}`}
                                className="flex-1 flex items-center justify-center h-12 rounded-lg font-bold text-[14px] transition-colors shadow-sm bg-[#2D5A41] text-white hover:bg-[#234532]"
                            >
                                View {petName}'s Story
                            </Link>

                            <div className="flex gap-2 ml-auto">
                                <button className="h-12 w-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg hover:text-[#EF4444] hover:bg-gray-100 transition-all border border-transparent">
                                    <Heart size={20} />
                                </button>
                                <button className="h-12 w-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg hover:text-[#2D5A41] hover:bg-gray-100 transition-all border border-transparent text-[#4B5563]">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const ListView = () => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group flex flex-col lg:flex-row bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full lg:h-64"
        >
            <div className="relative w-full lg:w-64 h-64 lg:h-full overflow-hidden shrink-0">
                <img
                    src={photoUrl}
                    alt={petName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isUrgent && (
                        <div className="px-3 py-1 bg-[#EF4444] text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                            <Clock size={12} strokeWidth={3} /> Urgent
                        </div>
                    )}
                    {isProfile && (
                        <div className={`px-3 py-1 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm ${isActive ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                            {isActive ? 'Active' : 'Archived'}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-3xl font-bold text-[#1F2937] leading-none">{petName}</h3>
                                {isIdentityVerified && (
                                    <ShieldCheck size={20} className="text-[#2D5A41]" />
                                )}
                            </div>
                            <p className="text-[13px] font-bold text-[#4B5563] uppercase tracking-wider">
                                {breed} • {ageDisplay}
                            </p>
                        </div>

                        {!isProfile && (
                            <div className="text-right">
                                <p className="text-2xl font-bold text-[#2D5A41]">${parseFloat(adoptionFee).toFixed(0)}</p>
                                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Adoption Fee</p>
                            </div>
                        )}
                    </div>

                    <p className="text-[14px] text-[#4B5563] font-medium line-clamp-2 leading-relaxed mb-4">
                        {description}
                    </p>

                    <div className="flex flex-wrap gap-4 items-center text-[12px] font-medium text-[#9CA3AF]">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-[#9CA3AF]" /> {locationString}
                        </div>
                        {pet.behavioral_profile?.house_trained === 'yes' && (
                            <div className="flex items-center gap-1.5">
                                <Home size={16} className="text-[#9CA3AF]" /> House-trained
                            </div>
                        )}
                        {displayTags.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={16} className="text-[#9CA3AF]" /> {displayTags[0]}
                            </div>
                        )}
                    </div>
                </div>

                <div className={`flex items-center ${isProfile ? 'gap-2 justify-start' : 'gap-4'} mt-6 pt-5 border-t border-gray-50`}>
                    <Link
                        to={isProfile ? `/dashboard/pets/${id}/edit` : `/pets/${id}`}
                        className={`items-center justify-center h-12 rounded-lg font-bold text-[13px] transition-colors shadow-sm inline-flex ${isProfile
                            ? 'w-12 bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'px-8 bg-[#2D5A41] text-white hover:bg-[#234532]'
                            }`}
                        title={isProfile ? "Edit Profile" : ""}
                    >
                        {isProfile ? (
                            <Pencil size={18} />
                        ) : 'View Details'}
                    </Link>

                    {/* Profile Actions - Grouped Together */}
                    {isProfile && (
                        <>
                            <Link
                                to={`/pets/${id}`}
                                className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:text-brand-primary hover:border-brand-primary transition-colors"
                                title="View Public Page"
                            >
                                <Share2 size={18} />
                            </Link>
                            {onToggleActive && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onToggleActive(pet);
                                    }}
                                    className={`w-12 h-12 flex items-center justify-center border rounded-lg transition-colors ${isActive
                                        ? 'bg-gray-50 border-gray-200 text-gray-500 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50'
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                        }`}
                                    title={isActive ? "Archive Pet" : "Unarchive Pet"}
                                >
                                    {isActive ? <Archive size={18} /> : <RotateCcw size={18} />}
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete(id);
                                    }}
                                    className="w-12 h-12 flex items-center justify-center bg-status-error/5 border border-status-error/20 text-status-error rounded-lg hover:bg-status-error/10 transition-colors"
                                    title="Delete Profile"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </>
                    )}

                    {/* Listing Actions - Split Layout */}
                    {!isProfile && (
                        <div className="flex gap-2 ml-auto">
                            <button className="h-12 w-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg hover:text-[#EF4444] hover:bg-gray-100 transition-all border border-transparent">
                                <Heart size={20} />
                            </button>
                            <button className="h-12 w-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg hover:text-[#2D5A41] hover:bg-gray-100 transition-all border border-transparent text-[#4B5563]">
                                <Share2 size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return viewMode === 'grid' ? <GridView /> : <ListView />;
};

export default React.memo(PetCard);
