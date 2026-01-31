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
import SortDropdown from '../../components/Pet/SortDropdown';
import LocationPickerModal from '../../components/Pet/LocationPickerModal';

const ServiceSearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Unified Filter Drawer State
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // State from URL
    const providerType = searchParams.get('providerType') || '';
    const search = searchParams.get('search') || '';
    const city = searchParams.get('location') || '';
    const radius = searchParams.get('radius') || '25';
    const sortBy = searchParams.get('ordering') || '-created_at';
    const [page, setPage] = useState(1);
    const species = searchParams.get('species') || '';
    const availability = searchParams.get('availability') || '';
    const verificationStatus = searchParams.get('verification_status') || '';

    // Map internal type to API Category Slug
    const categorySlug = providerType === 'vet' ? 'veterinary' : providerType === 'trainer' ? 'training' : providerType === 'foster' ? 'foster' : undefined;

    // Location & IP Detection
    const [suggestedLocation, setSuggestedLocation] = useState(null);

    useEffect(() => {
        if (!city) {
            fetch('https://ipwho.is/')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setSuggestedLocation(`${data.city}, ${data.region_code}`);
                })
                .catch(err => console.error("Location detection failed", err));
        }
    }, [city]);

    const handleLocationSelect = ({ name, radius }) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('location', name);
        newParams.set('radius', radius);
        setSearchParams(newParams);
        setIsLocationModalOpen(false);
    };

    // Query Construction
    const queryParams = {
        category: categorySlug,
        search,
        location: city,
        radius: city ? radius : undefined,
        ordering: sortBy,
        species,
        availability,
        verification_status: verificationStatus,
        page,
        ...Object.fromEntries(searchParams.entries())
    };
    // Cleanup
    if (!queryParams.category) delete queryParams.category;
    if (!queryParams.radius) delete queryParams.radius;


    const { useGetProviders } = useServices();
    const { data: providersData, isLoading } = useGetProviders(queryParams);

    // Handle pagination vs list response
    const providersList = Array.isArray(providersData) ? providersData : (providersData?.results || []);
    const totalCount = providersData?.count || providersList.length;
    const hasNextPage = !!providersData?.next;

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === '' || value === null) newParams.delete(key);
        else newParams.set(key, value);
        newParams.delete('page');
        setSearchParams(newParams);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchParams({});
        setPage(1);
    };

    // Toggle logic helper
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

    const sortOptions = [
        { value: '-created_at', label: 'Newest' },
        { value: 'recommended', label: 'Recommended' },
        { value: '-avg_rating', label: 'Highest Rated' },
        { value: '-reviews_count', label: 'Most Reviewed' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search & Toolbar Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Input - Left Aligned & Wide */}
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, service, or keyword..."
                            value={search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                        />
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-xs font-bold text-gray-500 hidden xl:block">
                            Showing {totalCount} providers
                        </span>

                        <SortDropdown
                            currentSort={sortBy}
                            onSortChange={(val) => handleFilterChange('ordering', val)}
                            options={sortOptions}
                        />

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex gap-8 items-start">

                    {/* Left Sidebar - Persistent */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-28">
                        <ServiceFilterSidebar
                            filters={Object.fromEntries(searchParams.entries())}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />
                    </div>

                    {/* Right Content - Grid */}
                    <div className="flex-1 min-w-0">

                        {/* Mobile Filter Trigger (Visible only on small screens) */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm"
                            >
                                <Filter size={18} />
                                <span>Filters & Location</span>
                                {activeFilters.length > 0 && (
                                    <span className="ml-1 bg-brand-primary text-white px-2 py-0.5 rounded-full text-xs">{activeFilters.length}</span>
                                )}
                            </button>
                        </div>

                        {/* Active Filters List (Optional to keep, helpful for UX) */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {activeFilters.map(filter => (
                                    <span key={filter.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm">
                                        {filter.label}
                                        <button onClick={() => {
                                            const newParams = new URLSearchParams(searchParams);
                                            newParams.delete(filter.key);
                                            if (filter.key === 'location') newParams.delete('radius');
                                            setSearchParams(newParams);
                                        }} className="hover:text-red-500 ml-1"><X size={14} /></button>
                                    </span>
                                ))}
                                <button onClick={handleClearFilters} className="text-xs text-status-error font-bold hover:underline px-2">Clear All</button>
                            </div>
                        )}

                        {isLoading ? (
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="bg-white rounded-2xl h-[300px] animate-pulse border border-gray-100 shadow-sm" />
                                ))}
                            </div>
                        ) : (
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
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
                                    <div className="col-span-full py-20">
                                        <NoResults
                                            title="No providers found"
                                            description="Try adjusting your filters or search area."
                                            onReset={handleClearFilters}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {!isLoading && totalCount > 0 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={page === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold bg-white"
                                >
                                    <ChevronRight className="rotate-180" size={18} />
                                </button>

                                {Array.from({ length: Math.min(5, Math.ceil(totalCount / 12)) }, (_, i) => { // Assuming default page size around 12-20
                                    const p = i + 1;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${page === p
                                                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={!hasNextPage}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold bg-white"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer (Only for < lg screens) */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex justify-end lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterDrawerOpen(false)} />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="relative w-full max-w-xs bg-white h-full shadow-xl flex flex-col"
                        >
                            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                                <h2 className="font-bold text-lg">Filters</h2>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5">
                                <ServiceFilterSidebar
                                    filters={Object.fromEntries(searchParams.entries())}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={handleClearFilters}
                                />
                            </div>
                            <div className="p-5 border-t bg-gray-50">
                                <Button width="full" onClick={() => setIsFilterDrawerOpen(false)}>Show {totalCount} Results</Button>
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
        </div >
    );
};

export default ServiceSearchPage;
