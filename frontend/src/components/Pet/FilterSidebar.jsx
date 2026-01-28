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
        <div className="border-b border-gray-100 last:border-0 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full group mb-3"
            >
                <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#9CA3AF] group-hover:text-[#4B5563] transition-colors">{title}</h3>
                <div className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}>
                    <ChevronDown size={14} className="text-[#9CA3AF]" />
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
        { id: 'dog', label: 'Dog', Icon: Dog },
        { id: 'cat', label: 'Cat', Icon: Cat },
        { id: 'rabbit', label: 'Rabbit', Icon: Rabbit },
    ];

    const ageOptions = [
        { id: 'under_6_months', label: 'Baby' },
        { id: '6_12_months', label: 'Young' },
        { id: '1_3_years', label: 'Adult' },
        { id: '3_10_years', label: 'Senior' },
        { id: '10_plus_years', label: 'Old' },
    ];

    const sizeOptions = [
        { id: 'small', label: 'Small' },
        { id: 'medium', label: 'Medium' },
        { id: 'large', label: 'Large' },
    ];

    const compatibilityOptions = [
        { id: 'good_with_children', label: 'Kids' },
        { id: 'good_with_dogs', label: 'Dogs' },
        { id: 'good_with_cats', label: 'Cats' },
        { id: 'house_trained', label: 'Trained' },
    ];

    const verificationOptions = [
        { id: 'verified_identity', label: 'ID Verified' },
        { id: 'verified_owner', label: 'Owner Verified' },
    ];

    return (
        <div className="w-full bg-white/50 backdrop-blur-sm p-4 flex flex-col gap-2 font-jakarta">
            {/* Header - Compact */}
            <div className="flex items-center justify-between mb-2 px-1 pb-4 border-b border-gray-100/50">
                <h2 className="text-[18px] font-black text-[#111827] tracking-tight">Refine Results</h2>
                <button
                    onClick={onClearFilters}
                    className="text-[10px] font-black uppercase tracking-widest text-status-error hover:opacity-70 transition-opacity"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-1">
                {/* Species - Compact Icon Grid */}
                <FilterSection title="Species">
                    <div className="grid grid-cols-3 gap-2 pb-2">
                        {speciesOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange({ target: { name: 'species', value: filters.species === option.id ? '' : option.id } })}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1.5 ${filters.species === option.id ? 'bg-[#2D5A41] text-white border-[#2D5A41] shadow-lg shadow-[#2D5A41]/20 scale-[1.02]' : 'bg-white border-gray-100 text-[#4B5563] hover:border-gray-300'}`}
                            >
                                <option.Icon size={18} />
                                <span className="text-[10px] font-bold">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Age Range - Pill Group */}
                <FilterSection title="Life Stage">
                    <div className="flex flex-wrap gap-2 pb-2">
                        {ageOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange({ target: { name: 'age_range', value: filters.age_range === option.id ? '' : option.id } })}
                                className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all ${filters.age_range === option.id ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white border-gray-100 text-[#6B7280] hover:border-gray-200'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Gender - Segmented Controls */}
                <FilterSection title="Gender">
                    <div className="flex gap-2 pb-2">
                        {[{ id: 'male', label: 'Male' }, { id: 'female', label: 'Female' }].map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange({ target: { name: 'gender', value: filters.gender === option.id ? '' : option.id } })}
                                className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border transition-all ${filters.gender === option.id ? 'bg-[#2D5A41] text-white border-[#2D5A41] shadow-md' : 'bg-white border-gray-100 text-[#4B5563] hover:bg-gray-50'}`}
                            >
                                {option.label}
                            </button>
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
                                className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border transition-all ${filters.size === option.id ? 'bg-[#2D5A41] text-white border-[#2D5A41]' : 'bg-white border-gray-100 text-[#4B5563] hover:bg-gray-50'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Compatibility - Toggle Chips */}
                <FilterSection title="Friendly With">
                    <div className="flex flex-wrap gap-2 pb-2">
                        {compatibilityOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange({ target: { name: option.id, checked: filters[option.id] !== 'true', type: 'checkbox' } })}
                                className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${filters[option.id] === 'true' ? 'bg-[#2D5A41]/10 text-[#2D5A41] border-[#2D5A41]/20' : 'bg-white border-gray-100 text-[#6B7280] hover:bg-gray-50'}`}
                            >
                                {filters[option.id] === 'true' && <Check size={12} strokeWidth={4} />}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Verification */}
                <FilterSection title="Trust & Safety">
                    <div className="space-y-2 pb-2">
                        {verificationOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange({ target: { name: option.id, checked: filters[option.id] !== 'true', type: 'checkbox' } })}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${filters[option.id] === 'true' ? 'bg-[#2D5A41]/5 border-[#2D5A41]/20 text-[#2D5A41]' : 'bg-white border-gray-100 text-[#6B7280]'}`}
                            >
                                <span className="text-[11px] font-bold">{option.label}</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${filters[option.id] === 'true' ? 'bg-[#2D5A41] text-white' : 'bg-gray-100 text-transparent'}`}>
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Safety Tip */}
                <div className="mt-4 pb-6">
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-amber-800">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Safety First</span>
                        </div>
                        <p className="text-[10px] font-bold text-amber-800/60 leading-tight">
                            Meet pets in public and never pay before handover.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
