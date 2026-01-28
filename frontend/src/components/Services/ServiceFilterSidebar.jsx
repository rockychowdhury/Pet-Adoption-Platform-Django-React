import React, { useState } from 'react';
import {
    ChevronDown,
    Stethoscope,
    Home,
    GraduationCap,
    Star,
    X,
    Check,
    ShieldCheck,
    Dog,
    Cat,
    Rabbit,
    DollarSign,
    Search
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
                <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-text-tertiary group-hover:text-text-secondary transition-colors">{title}</h3>
                <div className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}>
                    <ChevronDown size={14} className="text-text-tertiary" />
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

    // Service Category Map
    const categoryOptions = [
        { id: 'vet', label: 'Veterinary', Icon: Stethoscope },
        { id: 'foster', label: 'Foster Care', Icon: Home },
        { id: 'trainer', label: 'Training', Icon: GraduationCap },
    ];

    // Backend 'filter_species' uses exact slug match, so single select is safer unless we implement multi-value support in backend.
    const speciesOptions = [
        { id: 'dog', label: 'Dog', Icon: Dog },
        { id: 'cat', label: 'Cat', Icon: Cat },
        { id: 'rabbit', label: 'Rabbit', Icon: Rabbit },
    ];

    const availabilityOptions = [
        { id: 'available', label: 'Available Now' },
    ];

    const verificationOptions = [
        { id: 'verified', label: 'Verified Provider' },
    ];

    // State for local price inputs to avoid excessive re-renders/fetches on every keystroke
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [serviceKeyword, setServiceKeyword] = useState(filters.services || '');

    const handlePriceCommit = () => {
        onFilterChange('min_price', minPrice);
        onFilterChange('max_price', maxPrice);
    };

    const handleKeywordCommit = () => {
        onFilterChange('services', serviceKeyword);
    }

    return (
        <div className="w-full bg-white/50 backdrop-blur-sm p-4 flex flex-col gap-2 ">
            {/* Header - Compact */}
            <div className="flex items-center justify-between mb-2 px-1 pb-4 border-b border-gray-100/50">
                <h2 className="text-[18px] font-black text-text-primary tracking-tight">Refine Results</h2>
                <button
                    onClick={onClearFilters}
                    className="text-[10px] font-black uppercase tracking-widest text-status-error hover:opacity-70 transition-opacity"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-1">
                {/* Category - Icon Grid */}
                <FilterSection title="Service Category">
                    <div className="grid grid-cols-1 gap-2 pb-2">
                        {categoryOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange('providerType', filters.providerType === option.id ? '' : option.id)}
                                className={`flex items-center p-3 rounded-2xl border transition-all gap-3 ${filters.providerType === option.id ? 'bg-brand-primary text-text-inverted border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]' : 'bg-bg-surface border-border text-text-secondary hover:border-border-focus'}`}
                            >
                                <option.Icon size={18} />
                                <span className="text-[13px] font-bold">{option.label}</span>
                                {filters.providerType === option.id && <Check size={16} className="ml-auto" />}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Keyword Search (Backend: 'services' filter) */}
                <FilterSection title="Specific Service">
                    <div className="relative mb-2">
                        <input
                            type="text"
                            placeholder="e.g. Surgery, Training..."
                            value={serviceKeyword}
                            onChange={(e) => setServiceKeyword(e.target.value)}
                            onBlur={handleKeywordCommit}
                            onKeyDown={(e) => e.key === 'Enter' && handleKeywordCommit()}
                            className="w-full pl-9 pr-4 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={handlePriceCommit}
                                className="w-full pl-6 pr-2 py-2 bg-bg-secondary border border-border rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                            />
                        </div>
                        <span className="text-gray-300">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                onBlur={handlePriceCommit}
                                className="w-full pl-6 pr-2 py-2 bg-bg-secondary border border-border rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                            />
                        </div>
                    </div>
                </FilterSection>

                {/* Species - Compact Icon Grid (Single Select for now to match backend) */}
                <FilterSection title="Species Accepted">
                    <div className="grid grid-cols-3 gap-2 pb-2">
                        {speciesOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange('species', filters.species === option.id ? '' : option.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1.5 ${filters.species === option.id ? 'bg-brand-primary text-text-inverted border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]' : 'bg-bg-surface border-border text-text-secondary hover:border-gray-300'}`}
                            >
                                <option.Icon size={18} />
                                <span className="text-[10px] font-bold">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Availability */}
                <FilterSection title="Availability">
                    <div className="space-y-2 pb-2">
                        {availabilityOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onFilterChange('availability', filters.availability === option.id ? '' : option.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${filters.availability === option.id ? 'bg-brand-primary/5 border-brand-primary/20 text-brand-primary' : 'bg-white border-border text-text-secondary'}`}
                            >
                                <span className="text-[11px] font-bold">{option.label}</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${filters.availability === option.id ? 'bg-brand-primary text-text-inverted' : 'bg-bg-secondary text-transparent'}`}>
                                    <Check size={12} strokeWidth={4} />
                                </div>
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
                                onClick={() => onFilterChange('verification_status', filters.verification_status === 'verified' ? '' : 'verified')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${filters.verification_status === 'verified' ? 'bg-brand-primary/5 border-brand-primary/20 text-brand-primary' : 'bg-white border-border text-text-secondary'}`}
                            >
                                <span className="text-[11px] font-bold">{option.label}</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${filters.verification_status === 'verified' ? 'bg-brand-primary text-text-inverted' : 'bg-bg-secondary text-transparent'}`}>
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
                            Always verify credentials and read reviews before booking services.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceFilterSidebar;
