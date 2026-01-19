import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Heart, Map as MapIcon, List as ListIcon, LayoutGrid, ChevronRight, Info, ArrowUpDown } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Buttons/Button';
import Card from '../../components/common/Layout/Card';
import Badge from '../../components/common/Feedback/Badge';
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

    // Determine context based on URL or filters
    const isVetPath = location.pathname.includes('/vet');
    const initialType = isVetPath ? 'vet' : 'foster';
    const providerType = searchParams.get('providerType') || initialType;

    // Map internal type to API Category Slug
    // Assumption: Backend slugs are 'veterinary' and 'foster' (or similar)
    const categorySlug = providerType === 'vet' ? 'veterinary' : 'foster';

    // State from URL
    const search = searchParams.get('search') || '';
    const city = searchParams.get('location') || '';
    const radius = searchParams.get('radius') || '25';
    const sortBy = searchParams.get('sort') || 'recommended';

    const [viewMode, setViewMode] = useState('grid');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

    // Filter out radius if no location is provided
    const queryParams = {
        category: categorySlug,
        search,
        location: city,
        radius,
        sort: sortBy,
        ...Object.fromEntries(searchParams.entries())
    };

    if (!city) {
        delete queryParams.radius;
    }

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
        setSearchParams({ providerType }); // Keep the current type context
    };

    const providersList = Array.isArray(providers) ? providers : (providers?.results || []);

    // Sort Options
    const sortOptions = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'nearest', label: 'Nearest to Me' },
        { value: 'rating_desc', label: 'Highest Rated' },
        { value: 'reviews_desc', label: 'Most Reviewed' },
        { value: 'price_asc', label: 'Lowest Price' }
    ];

    return (
        <div className="min-h-screen bg-bg-primary font-jakarta">
            <Navbar />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-40 pt-12">

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-lg font-bold text-[#1F2937]"
                    >
                        <Filter size={18} /> {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 py-12">

                    {/* Sidebar */}
                    <div className={`w-full lg:w-80 shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24">
                            <ServiceFilterSidebar
                                filters={Object.fromEntries(searchParams.entries())}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1F2937] mb-1">
                                    {providerType === 'vet' ? 'Veterinary Clinics' : 'Foster Care Providers'}
                                </h1>
                                <p className="text-sm text-[#6B7280]">
                                    Showing {providersList.length} results {city && `near ${city}`}
                                </p>
                            </div>

                            {/* Center Location Display (Copied logic from PetListingPage) */}
                            {city ? (
                                <button
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-full border border-brand-primary/10 hover:bg-brand-primary/10 transition-colors group"
                                >
                                    <MapPin size={16} className="text-brand-primary" />
                                    <span className="text-sm font-bold text-[#1F2937]">{city}</span>
                                    <span className="text-[10px] text-text-tertiary ml-1 group-hover:text-text-secondary">({radius} mi)</span>
                                </button>
                            ) : suggestedLocation ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 animate-in fade-in zoom-in duration-300">
                                    <div className="flex items-center gap-1.5 text-amber-700">
                                        <MapPin size={14} />
                                        <span className="text-xs font-bold">Near {suggestedLocation}?</span>
                                    </div>
                                    <div className="w-px h-4 bg-amber-200 mx-1"></div>
                                    <button
                                        onClick={() => handleLocationSelect({ name: suggestedLocation, radius: 25 })}
                                        className="text-[10px] font-black uppercase text-amber-700 hover:text-amber-900 transition-colors"
                                    >
                                        Use
                                    </button>
                                    <button
                                        onClick={() => setIsLocationModalOpen(true)}
                                        className="text-[10px] font-black uppercase text-amber-700/60 hover:text-amber-900 transition-colors"
                                    >
                                        Change
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors text-gray-500"
                                >
                                    <MapPin size={16} />
                                    <span className="text-sm font-medium">Set Location</span>
                                </button>
                            )}

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <SortDropdown
                                    currentSort={sortBy}
                                    onSortChange={(val) => handleFilterChange('sort', val)}
                                    options={sortOptions}
                                />

                                <div className="hidden sm:flex bg-white border border-gray-200 p-1 rounded-lg shrink-0">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-[#1F2937]' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}
                                        title="List View"
                                    >
                                        <ListIcon size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-[#1F2937]' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}
                                        title="Grid View"
                                    >
                                        <LayoutGrid size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters / Chips could go here */}

                        {isLoading ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white h-[380px] rounded-2xl animate-pulse shadow-sm border border-gray-100" />
                                ))}
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
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
                </div>
            </div>

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

