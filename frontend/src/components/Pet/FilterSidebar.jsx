import React, { useState } from 'react';
import { Filter, MapPin, X, Check } from 'lucide-react';
import Button from '../common/Buttons/Button';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
    // Mock counts for species
    const speciesOptions = [
        { id: 'dog', label: 'Dogs', count: 120 },
        { id: 'cat', label: 'Cats', count: 85 },
        { id: 'rabbit', label: 'Rabbits', count: 12 },
        { id: 'bird', label: 'Birds', count: 8 },
        { id: 'other', label: 'Other', count: 5 },
    ];

    const sizeOptions = [
        { id: 'small', label: 'Small', sub: '(0-25 lbs)' },
        { id: 'medium', label: 'Medium', sub: '(26-60 lbs)' },
        { id: 'large', label: 'Large', sub: '(61-100 lbs)' },
        { id: 'xlarge', label: 'Extra Large', sub: '(101 lbs+)' },
    ];

    const personalityOptions = [
        'Good with Kids', 'Good with Dogs', 'Good with Cats', 'House Trained', 'Hypoallergenic'
    ];

    return (
        <div className="w-full lg:w-80 shrink-0 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between lg:hidden mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
                    <Filter size={20} /> Filters
                </h2>
                <button onClick={onClearFilters} className="text-sm text-brand-primary font-medium">Reset</button>
            </div>

            {/* Location Filter */}
            <div className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-primary">Location</h3>
                </div>
                <div className="relative mb-4">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <input
                        type="text"
                        placeholder="Enter Zip Code"
                        className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-text-secondary">
                        <span>Distance</span>
                        <span>50 miles</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-brand-primary" />
                </div>
                <button className="w-full mt-4 text-sm font-bold text-brand-primary flex items-center justify-center gap-2 py-2 hover:bg-brand-primary/5 rounded-xl transition-colors">
                    <MapPin size={16} /> Use my location
                </button>
            </div>

            {/* Species Filter */}
            <div className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm">
                <h3 className="font-bold text-text-primary mb-4">Type of Pet</h3>
                <div className="space-y-3">
                    {speciesOptions.map(option => (
                        <label key={option.id} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filters.species === option.id ? 'bg-brand-primary border-brand-primary' : 'border-border group-hover:border-brand-primary'}`}>
                                    {filters.species === option.id && <Check size={14} className="text-text-inverted" />}
                                </div>
                                <input
                                    type="radio"
                                    name="species"
                                    value={option.id}
                                    checked={filters.species === option.id}
                                    onChange={onFilterChange}
                                    className="hidden"
                                />
                                <span className="text-text-secondary font-medium group-hover:text-text-primary">{option.label}</span>
                            </div>
                            <span className="text-xs font-bold text-text-tertiary bg-bg-secondary px-2 py-1 rounded-full">{option.count}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Age Filter */}
            <div className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm">
                <h3 className="font-bold text-text-primary mb-4">Age</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {['Puppy', 'Young', 'Adult', 'Senior'].map(age => (
                        <button key={age} className="py-2 px-3 border border-border rounded-xl text-sm font-medium hover:border-brand-primary hover:text-brand-primary transition-colors text-text-secondary">
                            {age}
                        </button>
                    ))}
                </div>
                <div className="space-y-4 pt-2 border-t border-border">
                    <div className="flex justify-between text-xs font-medium text-text-secondary">
                        <span>Min Age</span>
                        <span>Max Age</span>
                    </div>
                    <div className="flex gap-4">
                        <input type="number" placeholder="0" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-center text-text-primary placeholder:text-text-tertiary" />
                        <span className="text-text-tertiary self-center">-</span>
                        <input type="number" placeholder="20" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-center text-text-primary placeholder:text-text-tertiary" />
                    </div>
                </div>
            </div>

            {/* Size Filter */}
            <div className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm">
                <h3 className="font-bold text-text-primary mb-4">Size</h3>
                <div className="space-y-3">
                    {sizeOptions.map(size => (
                        <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border border-border group-hover:border-brand-primary flex items-center justify-center"></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-text-secondary">{size.label}</span>
                                <span className="text-xs text-text-tertiary">{size.sub}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Personality Filter */}
            <div className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm">
                <h3 className="font-bold text-text-primary mb-4">Personality</h3>
                <div className="space-y-3">
                    {personalityOptions.map((trait, i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border border-border group-hover:border-brand-primary flex items-center justify-center"></div>
                            <span className="text-sm font-medium text-text-secondary">{trait}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Adoption Fee Filter */}
            <div className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-primary">Adoption Fee</h3>
                    <span className="text-xs font-bold text-brand-primary">$0 - $500+</span>
                </div>
                <input type="range" className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-brand-primary" />
            </div>

            {/* More Filters (Collapsible) */}
            <div className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm">
                <h3 className="font-bold text-text-primary mb-4">More Options</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border border-border flex items-center justify-center"></div>
                        <span className="text-sm font-medium text-text-secondary">Special Needs</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border border-border flex items-center justify-center"></div>
                        <span className="text-sm font-medium text-text-secondary">Microchipped Only</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border border-border flex items-center justify-center"></div>
                        <span className="text-sm font-medium text-text-secondary">Fully Vaccinated</span>
                    </label>
                </div>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden grid grid-cols-2 gap-4 sticky bottom-0 bg-bg-surface p-4 border-t border-border -mx-4 -mb-4 shadow-lg z-10">
                <Button variant="outline" onClick={onClearFilters}>Clear All</Button>
                <Button variant="primary">Apply Filters</Button>
            </div>
        </div>
    );
};

export default FilterSidebar;
