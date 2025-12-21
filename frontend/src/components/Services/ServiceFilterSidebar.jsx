import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    Check,
    ShieldCheck,
    Stethoscope,
    Home,
    Dog,
    Cat,
    Rabbit,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSection = ({ title, children, isOpen: defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 last:border-0 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full group mb-4"
            >
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#4B5563] group-hover:text-[#1F2937] transition-colors">{title}</h3>
                <div className={`p-1 rounded-full transition-all ${isOpen ? 'bg-gray-100 text-[#1F2937]' : 'text-[#6B7280] group-hover:bg-gray-50'}`}>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ServiceFilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
    const serviceType = filters.providerType === 'vet' ? 'vet' : 'foster';

    const speciesOptions = [
        { id: 'Dogs', label: 'Dogs', Icon: Dog },
        { id: 'Cats', label: 'Cats', Icon: Cat },
        { id: 'Rabbits', label: 'Rabbits', Icon: Rabbit }, // Simplified for now
    ];


    // Vet Specific Options
    const clinicTypes = [
        'General Practice',
        'Emergency/24-hour',
        'Specialty Clinic',
        'Mobile Vet',
        'Holistic/Alternative'
    ];

    const vetServices = [
        'Wellness Exams',
        'Vaccinations',
        'Surgery',
        'Dental Care',
        'Emergency Care'
    ];

    // Foster Specific Options
    const fosterAvailability = [
        { id: 'available', label: 'Available Now', color: 'bg-green-500' },
        { id: 'limited', label: 'Limited Availability', color: 'bg-yellow-500' },
        { id: 'full', label: 'Currently Full', color: 'bg-red-500' }
    ];

    const verificationOptions = [
        { id: 'verified_identity', label: 'Identity Verified' },
        { id: 'verified_license', label: 'License Verified' }, // For vets mostly
        { id: 'background_checked', label: 'Background Checked' }
    ];


    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-[#1F2937]" />
                    <h2 className="text-xl font-bold text-[#1F2937]">Filters</h2>
                </div>
                <button
                    onClick={onClearFilters}
                    className="text-[11px] font-bold uppercase tracking-widest text-[#EF4444] hover:text-[#DC2626] transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Service Type Toggle (Quick Switch) */}
            <div className="mb-8">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#4B5563] mb-3">Service Type</h3>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => onFilterChange('providerType', 'foster')}
                        className={`py-2 px-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${serviceType === 'foster'
                            ? 'bg-white text-[#2D5A41] shadow-sm'
                            : 'text-[#6B7280] hover:text-[#374151]'
                            }`}
                    >
                        <Home size={16} />
                        Foster
                    </button>
                    <button
                        onClick={() => onFilterChange('providerType', 'vet')}
                        className={`py-2 px-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${serviceType === 'vet'
                            ? 'bg-white text-[#2D5A41] shadow-sm'
                            : 'text-[#6B7280] hover:text-[#374151]'
                            }`}
                    >
                        <Stethoscope size={16} />
                        Vet
                    </button>
                </div>
            </div>

            {/* Location Filter Removed - Handled at Page Level */}

            {/* Price Range (Foster Only for now - modeled as min-max) */}
            {serviceType === 'foster' && (
                <FilterSection title="Daily Rate">
                    <div className="px-2">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm font-bold text-[#1F2937]">${filters.minPrice || 15}</span>
                            <div className="h-1 bg-gray-100 flex-1 rounded-full"></div>
                            <span className="text-sm font-bold text-[#1F2937]">${filters.maxPrice || 100}+</span>
                        </div>
                        {/* Placeholder for a range slider - using inputs for MVP */}
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                value={filters.minPrice || ''}
                                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                            />
                            <span className="self-center text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                value={filters.maxPrice || ''}
                                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>
                </FilterSection>
            )}


            {/* Availability (Foster Only) */}
            {serviceType === 'foster' && (
                <FilterSection title="Availability">
                    <div className="space-y-3">
                        {fosterAvailability.map(status => (
                            <label key={status.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="availability"
                                        value={status.id}
                                        checked={filters.availability === status.id}
                                        onChange={(e) => onFilterChange('availability', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${filters.availability === status.id ? 'border-[#2D5A41]' : 'border-gray-200'}`}>
                                        {filters.availability === status.id && <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A41]" />}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                    <span className={`text-[14px] font-medium ${filters.availability === status.id ? 'text-[#1F2937]' : 'text-[#374151]'}`}>
                                        {status.label}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Species (Common) */}
            <FilterSection title="Species Accepted">
                <div className="space-y-3">
                    {speciesOptions.map(option => (
                        <label key={option.id} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <span className={`text-[14px] font-medium ${filters.species?.includes(option.id) ? 'text-[#1F2937] font-bold' : 'text-[#374151]'}`}>
                                    {option.label}
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={filters.species?.includes(option.id)}
                                    onChange={(e) => {
                                        const currentSpecies = filters.species ? filters.species.split(',') : [];
                                        let newSpecies;
                                        if (e.target.checked) {
                                            newSpecies = [...currentSpecies, option.id];
                                        } else {
                                            newSpecies = currentSpecies.filter(s => s !== option.id);
                                        }
                                        onFilterChange('species', newSpecies.join(','));
                                    }}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${filters.species?.includes(option.id) ? 'bg-[#2D5A41] border-[#2D5A41]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                                    {filters.species?.includes(option.id) && <Check size={12} className="text-white stroke-[4]" />}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Clinic Type (Vet Only) */}
            {serviceType === 'vet' && (
                <FilterSection title="Clinic Type">
                    <div className="space-y-3">
                        {clinicTypes.map(type => (
                            <label key={type} className="flex items-center justify-between cursor-pointer group">
                                <span className="text-[14px] font-medium text-[#374151] group-hover:text-[#1F2937] transition-colors">{type}</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={filters.clinicType?.includes(type)}
                                        onChange={(e) => {
                                            // Handle multi-select logic roughly similar to species or single select if preferred
                                            // For now assuming simplified handling or just visual placeholder
                                        }}
                                        className="sr-only"
                                    />
                                    <div className="w-5 h-5 rounded border-2 border-gray-200 bg-white"></div>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Verification */}
            <FilterSection title="Verification">
                <div className="space-y-3">
                    {verificationOptions.map(option => (
                        <label key={option.id} className="flex items-center gap-3 cursor-pointer group bg-gray-50/50 p-2.5 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name={option.id}
                                    checked={filters[option.id] === 'true'}
                                    onChange={(e) => onFilterChange(option.id, e.target.checked ? 'true' : 'false')}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${filters[option.id] === 'true' ? 'bg-[#2D5A41] border-[#2D5A41]' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}>
                                    {filters[option.id] === 'true' && <Check size={12} className="text-white stroke-[4]" />}
                                </div>
                            </div>
                            <span className={`text-[14px] font-medium ${filters[option.id] === 'true' ? 'text-[#1F2937]' : 'text-[#374151]'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

        </div>
    );
};

export default ServiceFilterSidebar;
