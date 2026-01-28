import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, Map as MapIcon, List as ListIcon, LayoutGrid, ChevronRight, Info, ArrowUpDown, X, List } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Buttons/Button';
import { motion, AnimatePresence } from 'framer-motion';

import useServices from '../../hooks/useServices';
import NoResults from '../../components/common/Feedback/NoResults';
import ServiceFilterSidebar from '../../components/Services/ServiceFilterSidebar';
import ServiceCard from '../../components/Services/ServiceCard';
import SortDropdown from '../../components/Pet/SortDropdown'; // Reusing generic sort
import LocationPickerModal from '../../components/Pet/LocationPickerModal';

const ServiceSearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // Unified Filter Drawer State (Mobile & Desktop)
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    // State from URL
    const providerType = searchParams.get('providerType') || '';
    const search = searchParams.get('search') || '';
    const city = searchParams.get('location') || '';
    const radius = searchParams.get('radius') || '25';
    const sortBy = searchParams.get('sort') || '-created_at';
    const species = searchParams.get('species') || '';
    const availability = searchParams.get('availability') || '';
    const verificationStatus = searchParams.get('verification_status') || '';


    // Map internal type to API Category Slug if present
    // If providerType is empty, categorySlug is undefined -> fetch ALL
    const categorySlug = providerType === 'vet' ? 'veterinary' : providerType === 'trainer' ? 'training' : providerType === 'foster' ? 'foster' : undefined;

    // Location State
    const [suggestedLocation, setSuggestedLocation] = useState(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // IP-Based Location Detection on Mount
    useEffect(() => {
        const detectLocation = async () => {
            if (!city) { // Only detect if no location is currently set
                try {
                    const response = await fetch('https://ipwho.is/');
                    if (!response.ok) throw new Error('Location detection failed');
                    const data = await response.json();

                    if (data.success && data.city && data.region_code) {
                        const locationString = `${data.city}, ${data.region_code}`;
                        setSuggestedLocation(locationString);
                    }
                } catch (error) {
                    console.error("Auto-location detection error:", error);
                }
            }
        };

        detectLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle Location Selection
    const handleLocationSelect = (locationData) => {
        const { name, radius } = locationData;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('location', name);
        newParams.set('radius', radius);
        setSearchParams(newParams);
        setIsLocationModalOpen(false);
    };

    // Construct Query Params
    const queryParams = {
        category: categorySlug,
        search,
        location: city,
        radius: city ? radius : undefined, // Only send radius if location exists
        ordering: sortBy, // Changed sort to ordering to match backend standard
        species,
        availability,
        verification_status: verificationStatus,
        ...Object.fromEntries(searchParams.entries())
    };

    // Cleanup undefined
    if (!queryParams.category) delete queryParams.category;
    if (!queryParams.radius) delete queryParams.radius;


    // Query Hook
    const { useGetProviders } = useServices();
    const { data: providers, isLoading } = useGetProviders(queryParams);

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        // Handle explicit removals
        if (value === '' || value === null) {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }

        // Reset page on filter change
        newParams.delete('page');

        setSearchParams(newParams);
    };

    const handleClearFilters = () => {
        setSearchParams({}); // Clear all
    };

    const providersList = Array.isArray(providers) ? providers : (providers?.results || []);

    // Sort Options
    const sortOptions = [
        { value: '-created_at', label: 'Newest' }, // Default
        { value: 'recommended', label: 'Recommended' },
        // { value: 'distance', label: 'Nearest to Me' }, // Needs backend support
        { value: '-avg_rating', label: 'Highest Rated' },
        { value: '-reviews_count', label: 'Most Reviewed' },
    ];

    // Derived Active Filters
    const getActiveFilters = () => {
        const active = [];
        if (providerType) active.push({ key: 'providerType', label: providerType === 'vet' ? 'Veterinary' : providerType === 'trainer' ? 'Training' : 'Foster' });
        if (species) active.push({ key: 'species', label: `Species: ${species}` });
        if (availability) active.push({ key: 'availability', label: 'Available Now' });
        if (verificationStatus) active.push({ key: 'verification_status', label: 'Verified' });
        if (city) active.push({ key: 'location', label: `Near: ${city}` });
        return active;
    }
    const activeFilters = getActiveFilters();

    const removeFilter = (key) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        if (key === 'location') newParams.delete('radius');
        setSearchParams(newParams);
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };


    return (
        <div className="min-h-screen bg-bg-primary ">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pb-40 pt-12">

                {/* 1. Header & Top Filters Container */}
                <div className="flex flex-col gap-6 mb-8">
                    {/* Top Row: Compact Title + Actions */}
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-3xl md:text-4xl font-logo font-black text-text-primary tracking-tighter leading-none">
                                Find <span className="text-brand-primary">Care</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="h-0.5 w-6 bg-brand-secondary rounded-full opacity-50"></div>
                                <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
                                    {providersList.length} providers
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Location Button */}
                            <button
                                onClick={() => setIsLocationModalOpen(true)}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all text-xs font-bold shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gray-200 active:scale-95 ${city
                                    ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/20'
                                    : suggestedLocation
                                        ? 'bg-amber-50/50 text-amber-800 border-amber-100'
                                        : 'bg-white text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <MapPin size={16} className={city ? "fill-brand-primary/20" : ""} />
                                <span className="max-w-[120px] truncate">
                                    {city || suggestedLocation || "Set Location"}
                                </span>
                            </button>

                            {/* Sort Dropdown */}
                            <SortDropdown
                                currentSort={sortBy}
                                onSortChange={(val) => handleFilterChange('sort', val)}
                                options={sortOptions}
                            />

                            {/* Filter Drawer Trigger */}
                            <button
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all text-xs font-bold shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gray-200 active:scale-95 ${activeFilters.length > 0 ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-text-secondary hover:text-text-primary'}`}
                            >
                                <List size={16} />
                                <span className="hidden sm:inline">Filters</span>
                                {activeFilters.length > 0 && (
                                    <span className="bg-white text-gray-900 w-4 h-4 flex items-center justify-center rounded-full text-[9px]">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    <div className="min-h-[44px] flex items-center">
                        <AnimatePresence mode="wait">
                            {activeFilters.length > 0 ? (
                                <motion.div
                                    key="active-filters"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="flex flex-wrap gap-2 items-center"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mr-2">Filtering by:</span>
                                    {activeFilters.map(filter => (
                                        <button
                                            key={filter.key}
                                            onClick={() => removeFilter(filter.key)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-[10px] font-bold text-text-secondary hover:border-status-error hover:text-status-error transition-all shadow-sm group"
                                        >
                                            {filter.label}
                                            <X size={12} className="group-hover:rotate-90 transition-transform" />
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-[10px] font-black text-status-error uppercase tracking-widest hover:bg-status-error/5 px-3 py-1.5 rounded-xl transition-colors"
                                    >
                                        Reset All
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="no-filters"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[11px] font-medium text-text-tertiary italic"
                                >
                                    Browse all available service providers.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Results Grid - Full Width 4 Columns Logic */}
                {isLoading ? (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white h-[380px] rounded-2xl animate-pulse shadow-sm border border-gray-100" />
                        ))}
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        <AnimatePresence mode="popLayout">
                            {providersList.map((provider) => (
                                <ServiceCard
                                    key={provider.id}
                                    provider={provider}
                                    viewMode={viewMode}
                                />
                            ))}
                        </AnimatePresence>

                        {providersList.length === 0 && (
                            <div className="col-span-full py-12">
                                <NoResults
                                    title="No service providers found"
                                    description="We couldn't find any providers matching your current filters. Try expanding your search area or removing filters."
                                    onReset={handleClearFilters}
                                    icon={Search}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Filter Drawer (Right Side) */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100]"
                    >
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterDrawerOpen(false)} />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-white shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-20">
                                <h2 className="text-xl font-bold text-text-primary">Filters</h2>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <ServiceFilterSidebar
                                    filters={Object.fromEntries(searchParams.entries())}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={() => { handleClearFilters(); setIsFilterDrawerOpen(false); }}
                                />
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Show Results
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LocationPickerModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSelect={handleLocationSelect}
                initialRadius={radius}
            />

        </div>
    );
};

export default ServiceSearchPage;
