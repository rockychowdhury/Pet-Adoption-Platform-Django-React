import React, { useState } from 'react';
import {
    MapPin,
    Check,
    ChevronDown,
    Search,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Shared Helper Components (Same as ServiceFilterSidebar) ---

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

const CheckboxItem = ({ label, checked, onChange, subLabel }) => (
    <label className="flex items-start gap-3 cursor-pointer group py-1.5">
        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all mt-0.5 ${checked ? 'bg-brand-primary border-brand-primary' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
            {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        <div className="flex flex-col">
            <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
            {subLabel && <span className="text-[10px] text-gray-400">{subLabel}</span>}
        </div>
    </label>
);

const RadioItem = ({ label, checked, onChange, name }) => (
    <label className="flex items-center gap-3 cursor-pointer group py-1.5">
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${checked ? 'border-brand-primary' : 'border-gray-300 group-hover:border-gray-400'}`}>
            {checked && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
        </div>
        <input type="radio" name={name} className="hidden" checked={checked} onChange={onChange} />
        <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
    </label>
);


const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {

    // Config Options
    const speciesOptions = [
        { id: 'dog', label: 'Dog' },
        { id: 'cat', label: 'Cat' },
        { id: 'rabbit', label: 'Rabbit' },
        { id: 'bird', label: 'Bird' },
    ];

    const ageOptions = [
        { id: 'under_6_months', label: 'Baby', sub: 'Under 6 months' },
        { id: '6_12_months', label: 'Young', sub: '6 - 12 months' },
        { id: '1_3_years', label: 'Adult', sub: '1 - 3 years' },
        { id: '3_10_years', label: 'Senior', sub: '3 - 10 years' },
        { id: '10_plus_years', label: 'Geriatric', sub: '10+ years' },
    ];

    const sizeOptions = [
        { id: 'small', label: 'Small', sub: 'Under 25 lbs' },
        { id: 'medium', label: 'Medium', sub: '26 - 60 lbs' },
        { id: 'large', label: 'Large', sub: '61 - 100 lbs' },
        { id: 'extra_large', label: 'Extra Large', sub: '101 lbs+' },
    ];

    const genderOptions = [
        { id: 'male', label: 'Male' },
        { id: 'female', label: 'Female' },
    ];

    const compatibilityOptions = [
        { id: 'good_with_children', label: 'Good with Children' },
        { id: 'good_with_dogs', label: 'Good with Dogs' },
        { id: 'good_with_cats', label: 'Good with Cats' },
        { id: 'house_trained', label: 'House Trained' },
    ];

    return (
        <div className="w-full flex flex-col gap-1">

            {/* 1. Location Section */}
            <div className="border-b border-gray-100 py-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Location</h3>
                <div className="relative mb-4">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary" />
                    <input
                        type="text"
                        placeholder="Enter City or Zip"
                        value={filters.location || ''}
                        onChange={(e) => onFilterChange({ target: { name: 'location', value: e.target.value } })}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                    />
                </div>

                {/* Radius Slider */}
                <div className="px-1">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">Radius</span>
                        <span className="text-xs font-bold text-gray-900">{filters.radius || 50} km</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="500"
                        step="5"
                        value={filters.radius || 50}
                        onChange={(e) => onFilterChange({ target: { name: 'radius', value: e.target.value } })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                        <span>5km</span>
                        <span>500km</span>
                    </div>
                </div>
            </div>

            {/* 2. Species */}
            <FilterSection title="Species">
                <div className="space-y-1">
                    <RadioItem
                        label="Any Species"
                        name="species"
                        checked={!filters.species}
                        onChange={() => onFilterChange({ target: { name: 'species', value: '' } })}
                    />
                    {speciesOptions.map(option => (
                        <RadioItem
                            key={option.id}
                            label={option.label}
                            name="species"
                            checked={filters.species === option.id}
                            onChange={() => onFilterChange({ target: { name: 'species', value: option.id } })}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* 3. Age */}
            <FilterSection title="Life Stage">
                <div className="space-y-1">
                    {ageOptions.map(option => (
                        <CheckboxItem
                            key={option.id}
                            label={option.label}
                            subLabel={option.sub}
                            checked={filters.age_range === option.id}
                            onChange={() => onFilterChange({ target: { name: 'age_range', value: filters.age_range === option.id ? '' : option.id } })}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* 4. Gender */}
            <FilterSection title="Gender">
                <div className="space-y-1">
                    {genderOptions.map(option => (
                        <CheckboxItem
                            key={option.id}
                            label={option.label}
                            checked={filters.gender === option.id}
                            onChange={() => onFilterChange({ target: { name: 'gender', value: filters.gender === option.id ? '' : option.id } })}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* 5. Size */}
            <FilterSection title="Size" isOpen={false}>
                <div className="space-y-1">
                    {sizeOptions.map(option => (
                        <CheckboxItem
                            key={option.id}
                            label={option.label}
                            subLabel={option.sub}
                            checked={filters.size === option.id}
                            onChange={() => onFilterChange({ target: { name: 'size', value: filters.size === option.id ? '' : option.id } })}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* 6. Good With... */}
            <FilterSection title="Compatibility" isOpen={false}>
                <div className="space-y-1">
                    {compatibilityOptions.map(option => (
                        <CheckboxItem
                            key={option.id}
                            label={option.label}
                            checked={filters[option.id] === 'true'}
                            onChange={() => onFilterChange({ target: { name: option.id, checked: filters[option.id] !== 'true', type: 'checkbox' } })}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* 7. Verification */}
            <FilterSection title="Trust & Safety">
                <CheckboxItem
                    label="Verified Owners Only"
                    subLabel="ID or Phone verified"
                    checked={filters.verified_owner === 'true'}
                    onChange={() => onFilterChange({ target: { name: 'verified_owner', checked: filters.verified_owner !== 'true', type: 'checkbox' } })}
                />
            </FilterSection>

            {/* Reset Button (Bottom) */}
            <button
                onClick={onClearFilters}
                className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
                Reset Filters
            </button>

        </div>
    );
};

export default FilterSidebar;
