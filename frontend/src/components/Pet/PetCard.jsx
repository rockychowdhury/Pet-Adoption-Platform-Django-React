import React from 'react';
import { Heart, MapPin, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../common/Feedback/Badge';
import Button from '../common/Buttons/Button';

const PetCard = ({ pet, viewMode = 'grid' }) => {
    // Mock data handling if fields are missing
    const {
        id,
        name,
        breed = 'Unknown Breed',
        age = 'Unknown Age',
        gender = 'Unknown',
        weight = 'N/A',
        location_zip = 'Unknown',
        distance = '5 miles',
        adoption_fee = '0',
        image,
        isUrgent,
        isSaved
    } = pet;

    const renderGrid = () => (
        <div className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {isUrgent && (
                        <Badge variant="error" size="sm" icon={<Gauge size={12} />} className="shadow-lg animate-pulse">
                            URGENT
                        </Badge>
                    )}
                </div>

                {/* Save Button */}
                <button className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${isSaved ? 'bg-brand-secondary text-white shadow-lg scale-110' : 'bg-white/30 text-white hover:bg-white hover:text-brand-secondary'}`}>
                    <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>

                {/* Bottom Stats Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                    <div className="flex items-center justify-between text-xs font-medium opacity-90">
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                            {age}
                        </span>
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                            {gender}
                        </span>
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                            {weight}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">{name}</h3>
                        <p className="text-text-secondary text-sm font-medium">{breed}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-text-secondary text-xs font-medium mb-3">
                    <MapPin size={14} className="text-brand-primary" />
                    <span className="truncate">{location_zip} ({distance} away)</span>
                </div>

                <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                    {/* Mock Description */}
                    Friendly, energetic, and loves to play fetch. Great with kids and other dogs...
                </p>

                {/* Trait Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-md">Good with Kids</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-md">House Trained</span>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-primary">${adoption_fee}</span>
                    <Link to={`/pets/${id}`}>
                        <Button size="sm" variant="outline" className="rounded-xl px-4 hover:bg-brand-primary hover:text-white hover:border-brand-primary">
                            Meet {name}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    const renderList = () => (
        <div className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 flex flex-row h-48 transform hover:-translate-x-1">
            <div className="relative w-48 shrink-0 overflow-hidden bg-gray-100">
                <img
                    src={image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {isUrgent && (
                    <div className="absolute top-2 left-2">
                        <Badge variant="error" size="xs">URGENT</Badge>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow relative">
                <button className={`absolute top-5 right-5 p-2 rounded-full transition-all ${isSaved ? 'text-brand-secondary' : 'text-gray-300 hover:text-brand-secondary'}`}>
                    <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>

                <h3 className="text-xl font-bold text-text-primary mb-1">{name}</h3>
                <p className="text-sm text-text-secondary mb-3">{breed} • {age} • {gender}</p>

                <div className="flex items-center gap-1.5 text-text-secondary text-xs font-medium mb-auto">
                    <MapPin size={14} className="text-brand-primary" />
                    <span>{location_zip} ({distance} away)</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-brand-primary">${adoption_fee}</span>
                    <Link to={`/pets/${id}`}>
                        <Button size="sm" variant="outline" className="rounded-xl px-6">
                            Meet {name}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    return viewMode === 'grid' ? renderGrid() : renderList();
};

export default PetCard;
