import React, { useState, useEffect } from 'react';
import {
    ChevronDown, Star, Check, Circle, MapPin, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSection = ({ title, children, isOpen: defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 last:border-0 py-5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full group mb-2"
            >
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors">{title}</h3>
                <div className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}>
                    <ChevronDown size={16} className="text-gray-400" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CheckboxItem = ({ label, checked, onChange, icon: Icon }) => (
    <label className="flex items-center gap-3 cursor-pointer group py-1.5">
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-brand-primary border-brand-primary' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
            {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
        {Icon && <Icon size={14} className="ml-auto text-gray-400" />}
    </label>
);

const RadioItem = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group py-1.5">
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${checked ? 'border-brand-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
            {checked && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
        </div>
        <input type="radio" className="hidden" checked={checked} onChange={onChange} />
        <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
    </label>
);

const ServiceFilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {

    // --- Options ---
    const categoryOptions = [
        { id: '', label: 'All Services' },
        { id: 'foster', label: 'Foster Homes' },
        { id: 'vet', label: 'Veterinary Clinics' },
        { id: 'trainer', label: 'Pet Trainers' },
        { id: 'groomer', label: 'Groomers' },
        { id: 'sitter', label: 'Pet Sitters' },
    ];

    const speciesOptions = [
        { id: 'dog', label: 'Dogs' },
        { id: 'cat', label: 'Cats' },
        { id: 'small_animal', label: 'Small Animals' },
        { id: 'bird', label: 'Birds' },
    ];

    const ratingOptions = [
        { value: '5', label: '5.0 only' },
        { value: '4', label: '4 Stars & Up' },
        { value: '3', label: '3 Stars & Up' },
    ];

    // --- Local State for Inputs ---
    const [locationInput, setLocationInput] = useState(filters.location || '');
    const [radiusInput, setRadiusInput] = useState(filters.radius || 25);
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');

    // Sync from props
    useEffect(() => {
        setLocationInput(filters.location || '');
        setRadiusInput(filters.radius || 25);
    }, [filters.location, filters.radius]);

    // Handlers
    const handleLocationBlur = () => {
        if (locationInput !== filters.location) {
            onFilterChange('location', locationInput);
        }
    };

    const handleRadiusChange = (e) => {
        const val = e.target.value;
        setRadiusInput(val);
        // Debounce could be better, but simple onMouseUp or direct is okay for now
        onFilterChange('radius', val);
    };

    const handlePriceCommit = () => {
        onFilterChange('min_price', minPrice);
        onFilterChange('max_price', maxPrice);
    };

    return (
        <div className="w-full flex flex-col gap-2">

            {/* Location Section */}
            <div className="border-b border-gray-100 py-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Location</h3>
                <div className="relative mb-4">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary" />
                    <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onBlur={handleLocationBlur}
                        onKeyDown={(e) => e.key === 'Enter' && handleLocationBlur()}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                        placeholder="Enter City or Zip"
                    />
                </div>

                <div className="px-1">
                    <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
                        <span>Radius</span>
                        <span>{radiusInput} km</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        value={radiusInput}
                        onChange={handleRadiusChange}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>5km</span>
                        <span>100km</span>
                    </div>
                </div>
            </div>

            {/* Service Category */}
            <FilterSection title="Service Category">
                <div className="flex flex-col gap-1">
                    {categoryOptions.map(option => (
                        <RadioItem
                            key={option.id}
                            label={option.label}
                            checked={filters.providerType === option.id || (!filters.providerType && option.id === '')}
                            onChange={() => onFilterChange('providerType', option.id)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Species Accepted */}
            <FilterSection title="Species Accepted">
                <div className="flex flex-col gap-1">
                    {speciesOptions.map(option => (
                        <CheckboxItem
                            key={option.id}
                            label={option.label}
                            checked={filters.species === option.id} // TODO: Make multi-select compatible if backend supports
                            onChange={() => onFilterChange('species', filters.species === option.id ? '' : option.id)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range">
                {/* Stylized Range Slider Placeholder - using inputs for functionality matching image style somewhat */}
                <div className="px-1 py-2">
                    <div className="relative h-1 bg-gray-200 rounded-full mb-6 mx-2">
                        <div className="absolute left-0 right-1/2 h-full bg-brand-primary rounded-full opacity-50"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-primary rounded-full shadow-sm cursor-pointer"></div>
                        <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-primary rounded-full shadow-sm cursor-pointer"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={handlePriceCommit}
                                className="w-full pl-6 py-2 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-lg text-sm text-center font-medium transition-all outline-none focus:ring-2 focus:ring-brand-primary/10"
                                placeholder="Min"
                            />
                        </div>
                        <span className="text-gray-300">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                onBlur={handlePriceCommit}
                                className="w-full pl-6 py-2 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 rounded-lg text-sm text-center font-medium transition-all outline-none focus:ring-2 focus:ring-brand-primary/10"
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Rating">
                <div className="flex flex-col gap-1">
                    {ratingOptions.map(option => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group py-1.5">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.min_rating === option.value ? 'bg-brand-primary border-brand-primary' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
                                {filters.min_rating === option.value && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.min_rating === option.value}
                                onChange={() => onFilterChange('min_rating', filters.min_rating === option.value ? '' : option.value)}
                            />
                            <div className="flex items-center gap-1.5">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < parseInt(option.value) ? "currentColor" : "none"} strokeWidth={i < parseInt(option.value) ? 0 : 2} className={i >= parseInt(option.value) ? "text-gray-300" : ""} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">{option.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Availability */}
            <FilterSection title="Availability">
                <div className="flex flex-col gap-1">
                    <RadioItem
                        label="Available Now"
                        checked={filters.availability === 'available'}
                        onChange={() => onFilterChange('availability', filters.availability === 'available' ? '' : 'available')}
                    />
                    <RadioItem
                        label="Accepting New Clients"
                        checked={filters.accepting_new_clients === 'true'}
                        onChange={() => onFilterChange('accepting_new_clients', filters.accepting_new_clients === 'true' ? '' : 'true')}
                    />
                </div>
            </FilterSection>

            {/* Reset Button */}
            <button
                onClick={onClearFilters}
                className="w-full py-3 mt-4 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
                Reset Filters
            </button>

        </div>
    );
};

export default ServiceFilterSidebar;
