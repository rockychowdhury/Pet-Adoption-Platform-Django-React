import React, { useState, useRef, useEffect } from 'react';
import {
    Heart, MapPin, Calendar, CircleDot, Scale,
    MoreVertical, Edit3, Trash2, Archive,
    CheckCircle, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import usePets from '../../hooks/usePets';

const PetCard = ({ pet, viewMode = 'grid', variant = 'listing' }) => {
    const {
        id,
        name,
        pet_name,
        breed = 'Unknown',
        age_display = 'Unknown',
        gender = 'Unknown',
        weight = 'N/A',
        location_city = 'No Location',
        location_state = '',
        distance = '',
        photos = [],
        profile_photo,
        description = "No description available.",
        personality_traits = [],
        is_active,
        isSaved = false
    } = pet;

    const displayName = name || pet_name || 'Unnamed Pet';
    const mainImage = profile_photo || (photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');

    // Menu State
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Hooks
    const { useUpdatePet, useDeletePet } = usePets();
    const updatePet = useUpdatePet();
    const deletePet = useDeletePet();

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Actions
    const handleToggleStatus = (e) => {
        e.preventDefault();
        updatePet.mutate({
            id,
            data: { is_active: !is_active }
        });
        setShowMenu(false);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this profile? This cannot be undone.')) {
            deletePet.mutate(id);
        }
    };

    // --- RENDERERS ---

    const renderGrid = () => (
        <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-gray-100 dark:bg-gray-900 mb-4">
                <img
                    src={mainImage}
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Status Badge (Profile Mode) */}
                {variant === 'profile' && (
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/10 ${is_active
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-gray-500/90 text-white'
                        }`}>
                        {is_active ? 'Active' : 'Archived'}
                    </div>
                )}

                {/* Listing: Heart Button */}
                {variant === 'listing' && (
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-orange-500 transition-all border border-white/20">
                        <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                )}

                {/* Profile: Actions Menu */}
                {variant === 'profile' && (
                    <div className="absolute top-3 right-3" ref={menuRef}>
                        <button
                            onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                            className="p-2 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white hover:text-gray-900 transition-all border border-white/20 shadow-sm"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <Link
                                    to={`/dashboard/pets/edit/${id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left"
                                >
                                    <Edit3 size={14} /> Edit Profile
                                </Link>
                                <button
                                    onClick={handleToggleStatus}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left"
                                >
                                    {is_active ? <Archive size={14} /> : <CheckCircle size={14} />}
                                    {is_active ? 'Archive' : 'Activate'}
                                </button>
                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left font-medium"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-1 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1">{displayName}</h3>
                        <p className="text-sm font-medium text-gray-400">{breed}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-3 mt-4 mb-4">
                    <div className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center gap-1.5 border border-gray-100 dark:border-gray-700">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{age_display}</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center gap-1.5 border border-gray-100 dark:border-gray-700">
                        <Scale size={12} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{weight} lb</span>
                    </div>
                    {gender && (
                        <div className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center gap-1.5 border border-gray-100 dark:border-gray-700">
                            <CircleDot size={12} className="text-gray-400" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{gender}</span>
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-4">
                    <MapPin size={12} />
                    {location_city}, {location_state} {distance && <span className="opacity-60">({distance})</span>}
                </div>

                {/* Traits (Bottom) */}
                <div className="mt-auto pt-4 border-t border-dashed border-gray-100 dark:border-gray-700 flex gap-2 overflow-hidden">
                    {personality_traits.slice(0, 3).map((trait, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wide text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                            {trait}
                        </span>
                    ))}
                    {personality_traits.length > 3 && (
                        <span className="text-[10px] font-bold text-gray-400 px-1 py-1">+{personality_traits.length - 3}</span>
                    )}
                </div>
            </div>
        </div>
    );

    const renderList = () => (
        <div className="group bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 flex gap-6 items-center">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 shrink-0">
                <img src={mainImage} alt={displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{displayName}</h3>
                        <p className="text-sm text-gray-400 font-medium">{breed} • {age_display}</p>
                    </div>
                    {/* Action Menu (Replicated for List View) */}
                    {variant === 'profile' && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                                className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>
                            {/* ... (Menu Dropdown - same as above, omitted for brevity but should be functional) ... */}
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
                                    <Link to={`/dashboard/pets/edit/${id}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"><Edit3 size={14} /> Edit</Link>
                                    <button onClick={handleToggleStatus} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 w-full text-left"><Archive size={14} /> {is_active ? 'Archive' : 'Activate'}</button>
                                    <button onClick={handleDelete} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left"><Trash2 size={14} /> Delete</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return viewMode === 'grid' ? renderGrid() : renderList();
};

export default PetCard;
