import React, { useState } from 'react';
import {
    X,
    Check,
    ShieldCheck,
    Dog,
    Cat,
    Rabbit,
    ChevronDown,
    ChevronUp
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

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
    const speciesOptions = [
        { id: 'dog', label: 'Dogs', Icon: Dog },
        { id: 'cat', label: 'Cats', Icon: Cat },
        { id: 'rabbit', label: 'Rabbits', Icon: Rabbit },
    ];

    const ageOptions = [
        { id: 'under_6_months', label: 'Under 6 months' },
        { id: '6_12_months', label: '6 months - 1 year' },
        { id: '1_3_years', label: '1 - 2 years' },
        { id: '3_10_years', label: '2 - 5 years' },
        { id: '10_plus_years', label: '5+ years' },
    ];

    const sizeOptions = [
        { id: 'xs', label: 'XS' },
        { id: 's', label: 'S' },
        { id: 'm', label: 'M' },
        { id: 'l', label: 'L' },
        { id: 'xl', label: 'XL' },
    ];

    const compatibilityOptions = [
        { id: 'good_with_children', label: 'Good with children' },
        { id: 'good_with_dogs', label: 'Good with dogs' },
        { id: 'good_with_cats', label: 'Good with cats' },
        { id: 'house_trained', label: 'House-trained' },
    ];

    const verificationOptions = [
        { id: 'verified_vet', label: 'Vet verified' },
        { id: 'verified_identity', label: 'Identity verified' },
    ];

    return (
        <div className="w-full max-w-[320px] bg-bg-primary px-2 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-2 pt-1 pb-4 border-b border-gray-100">
                <h2 className="text-[20px] font-bold text-[#1F2937]">Filters</h2>
                <button
                    onClick={onClearFilters}
                    className="text-[11px] font-bold uppercase tracking-widest text-[#EF4444] hover:text-[#DC2626] transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="px-2">
                {/* Species */}
                <FilterSection title="Species">
                    <div className="space-y-3 pb-2 pt-1">
                        {speciesOptions.map(option => (
                            <label key={option.id} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${filters.species === option.id ? 'bg-[#2D5A41] text-white shadow-md' : 'bg-[#F3F4F6] text-[#374151] group-hover:bg-gray-200'}`}>
                                        <option.Icon size={20} />
                                    </div>
                                    <span className={`text-[14px] font-medium ${filters.species === option.id ? 'text-[#1F2937] font-bold' : 'text-[#374151]'}`}>
                                        {option.label}
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="species"
                                        value={option.id}
                                        checked={filters.species === option.id}
                                        onChange={onFilterChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${filters.species === option.id ? 'border-[#2D5A41]' : 'border-gray-200'}`}>
                                        {filters.species === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A41]" />}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Age Range */}
                <FilterSection title="Age Range">
                    <div className="space-y-3 pb-2">
                        {ageOptions.map(option => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name="age_range"
                                        value={option.id}
                                        checked={filters.age_range === option.id}
                                        onChange={onFilterChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${filters.age_range === option.id ? 'border-[#2D5A41]' : 'border-gray-200 group-hover:border-gray-300'}`}>
                                        {filters.age_range === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A41]" />}
                                    </div>
                                </div>
                                <span className={`text-[14px] font-medium ${filters.age_range === option.id ? 'text-[#1F2937]' : 'text-[#374151]'}`}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Size */}
                <FilterSection title="Size">
                    <div className="flex gap-2 pb-2">
                        {sizeOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange({ target: { name: 'size', value: filters.size === option.id ? '' : option.id } })}
                                className={`flex-1 py-2.5 rounded-lg text-[12px] font-bold border transition-all ${filters.size === option.id ? 'bg-[#2D5A41] text-white border-[#2D5A41] shadow-md transform scale-105' : 'bg-[#F9FAFB] text-[#374151] border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Compatibility */}
                <FilterSection title="Compatibility">
                    <div className="space-y-4 pb-2">
                        {compatibilityOptions.map(option => (
                            <label key={option.id} className="flex items-center justify-between cursor-pointer group">
                                <span className="text-[14px] font-medium text-[#374151] group-hover:text-[#1F2937] transition-colors">{option.label}</span>
                                <div className="relative cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={option.id}
                                        checked={filters[option.id] === 'true'}
                                        onChange={onFilterChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative ${filters[option.id] === 'true' ? 'bg-[#2D5A41]' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out transform ${filters[option.id] === 'true' ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Verification */}
                <FilterSection title="Verification">
                    <div className="space-y-3 pb-2">
                        {verificationOptions.map(option => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group bg-gray-50/50 p-2.5 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name={option.id}
                                        checked={filters[option.id] === 'true'}
                                        onChange={onFilterChange}
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

                <div className="pt-2 pb-8">
                    <div className="bg-amber-50/80 rounded-2xl p-5 flex gap-4 border border-amber-100/50">
                        <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
                            <ShieldCheck size={18} className="text-[#92400E]" />
                        </div>
                        <div>
                            <h4 className="text-[12px] font-bold text-[#92400E] uppercase mb-1">Adopt Safely</h4>
                            <p className="text-[10px] font-medium text-[#92400E]/80 leading-snug">
                                Never send money before meeting a pet in person.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
