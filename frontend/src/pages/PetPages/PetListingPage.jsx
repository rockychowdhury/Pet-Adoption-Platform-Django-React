import React, { useState, useEffect } from 'react';
import {
    Search, LayoutGrid, List as ListIcon, Loader2, X, MapPin, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useRehoming from '../../hooks/useRehoming';
import NoResults from '../../components/common/Feedback/NoResults';
import CreatePetModal from '../../components/Pet/CreatePetModal';
import FilterSidebar from '../../components/Pet/FilterSidebar';
import PetCard from '../../components/Pet/PetCard';
import LocationPickerModal from '../../components/Pet/LocationPickerModal';
import SortDropdown from '../../components/Pet/SortDropdown';

const PetListingPage = () => {
    const { user } = useAuth();
    const { useGetListings } = useRehoming();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    const [searchParams, setSearchParams] = useSearchParams();

    // IP Location State
    const [suggestedLocation, setSuggestedLocation] = useState(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // Initial Filter State from URL
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        species: '',
        breed: '',
        gender: '',
        age_range: '',
        size: '',
        urgency_level: '',
        good_with_cats: '',
        good_with_dogs: '',
        good_with_children: '',
        house_trained: '',
        special_needs: '',
        verified_owner: '',
        verified_identity: '',
        verified_vet: '',
        max_fee: '',
        energy_level: '',
        location: searchParams.get('location') || '',
        radius: parseInt(searchParams.get('radius')) || 50,
        // Backend expects 'lat'/'lng' if radius is used, 
        // effectively we need to decode them from URL if we were storing them,
        // OR the user re-selects via LocationPickerModal effectively.
        // For simple text location, we treat it as search in backend if lat/lng missing.
        ordering: '-published_at'
    });

    const [allPets, setAllPets] = useState([]);

    // Filter out radius if no location is provided to avoid empty results
    const fetchFilters = { ...filters };
    if (!fetchFilters.location) {
        delete fetchFilters.radius;
    }
    // Note: To make radius search work authentically, we'd need lat/long in state.
    // Assuming LocationPickerModal returns lat/long and we store it or pass it.
    // For now we rely on the implementation where we might pass lat/long if available.

    const { data, isLoading: loading, refetch } = useGetListings({ ...fetchFilters, page });
    const totalCount = data?.count || 0;
    const hasNextPage = !!data?.next;

    // IP-Based Location Detection
    useEffect(() => {
        const detectLocation = async () => {
            if (!filters.location && !searchParams.get('location')) {
                try {
                    const response = await fetch('https://ipwho.is/');
                    if (!response.ok) throw new Error('Location detection failed');
                    const data = await response.json();
                    if (data.success && data.city && data.region_code) {
                        setSuggestedLocation(`${data.city}, ${data.region_code}`);
                    }
                } catch (error) {
                    // Silent fail
                }
            }
        };
        detectLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLocationSelect = (locationData) => {
        const { name, radius, lat, lng } = locationData;

        // Update URL
        const newParams = new URLSearchParams(searchParams);
        newParams.set('location', name);
        newParams.set('radius', radius);
        // Ideally we'd store lat/lng in URL too if we want persistence, 
        // or just rely on text search for city name if lat/lng missing.
        if (lat) newParams.set('lat', lat);
        if (lng) newParams.set('lng', lng);

        setSearchParams(newParams);
        setIsLocationModalOpen(false);

        setFilters(prev => ({
            ...prev,
            location: name,
            radius: radius,
            lat: lat,
            lng: lng
        }));
    };

    // Data Sync
    useEffect(() => {
        if (data?.results) {
            setAllPets(data.results);
        } else if (!loading && page === 1) {
            setAllPets([]);
        }
    }, [data, page, loading]);

    // URL Sync
    useEffect(() => {
        const search = searchParams.get('search') || '';
        const location = searchParams.get('location') || '';
        const radius = parseInt(searchParams.get('radius')) || 50;
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (search !== filters.search || location !== filters.location || radius !== filters.radius) {
            setFilters(prev => ({ ...prev, search, location, radius, lat, lng }));
            setAllPets([]);
            setPage(1);
        }
    }, [searchParams]);

    const handleSortChange = (value) => {
        setFilters(prev => ({ ...prev, ordering: value }));
        setAllPets([]);
        setPage(1);
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? (checked ? 'true' : '') : (filters[name] === value && type === 'radio' ? '' : value);

        setFilters(prev => ({ ...prev, [name]: val }));
        setAllPets([]);
        setPage(1);

        if (['search'].includes(name)) {
            const newParams = new URLSearchParams(searchParams);
            if (val) newParams.set(name, val); else newParams.delete(name);
            setSearchParams(newParams);
        }
    };

    const clearFilters = () => {
        setSearchParams({});
        // Local state update via useEffect on URL change
    };

    const removeFilter = (key) => {
        if (['search', 'location', 'radius'].includes(key)) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete(key);
            if (key === 'location') {
                newParams.delete('lat');
                newParams.delete('lng');
                newParams.delete('radius');
            }
            setSearchParams(newParams);
        } else {
            setFilters(prev => ({ ...prev, [key]: '' }));
            setAllPets([]);
            setPage(1);
        }
    };

    // Derived Active Filters
    const getActiveFilters = () => {
        const active = [];
        if (filters.species) active.push({ key: 'species', label: `Species: ${filters.species} ` });
        if (filters.gender) active.push({ key: 'gender', label: `Gender: ${filters.gender} ` });
        if (filters.urgency_level) active.push({ key: 'urgency_level', label: `Urgency: ${filters.urgency_level} ` });
        if (filters.search) active.push({ key: 'search', label: `Search: "${filters.search}"` });
        if (filters.location) active.push({ key: 'location', label: `Near: ${filters.location} (${filters.radius}mi)` });
        if (filters.verified_owner === 'true') active.push({ key: 'verified_owner', label: 'Verified Owner' });
        return active;
    };
    const activeFilters = getActiveFilters();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-bg-primary font-jakarta"> {/* Using lighter background */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-40 pt-8">
                <div className="flex flex-col xl:flex-row gap-12 py-8">

                    {/* Filter Sidebar - Sticky */}
                    <aside className="hidden xl:block w-72 shrink-0">
                        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-none">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">

                        {/* Header & Controls */}
                        <div className="flex flex-col gap-6 mb-10">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-text-primary mb-2 tracking-tight">
                                        Find a Companion
                                    </h1>
                                    <p className="text-text-secondary text-sm font-medium">
                                        {totalCount} pets waiting for a new home
                                    </p>
                                </div>

                                {/* Location & Controls */}
                                <div className="flex items-center gap-3 ml-auto">
                                    {/* Location Button */}
                                    <button
                                        onClick={() => setIsLocationModalOpen(true)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-bold ${filters.location
                                                ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                                                : suggestedLocation
                                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                                    : 'bg-white border-gray-200 text-text-secondary hover:border-gray-300'
                                            }`}
                                    >
                                        <MapPin size={16} />
                                        <span>
                                            {filters.location || suggestedLocation || "Set Location"}
                                        </span>
                                        {filters.location && <span className="text-xs opacity-70">({filters.radius}mi)</span>}
                                    </button>

                                    <SortDropdown currentSort={filters.ordering} onSortChange={handleSortChange} />

                                    {/* View Toggle */}
                                    <div className="flex bg-white border border-gray-200 p-1 rounded-lg">
                                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}>
                                            <LayoutGrid size={18} />
                                        </button>
                                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}>
                                            <ListIcon size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filter Chips */}
                            <AnimatePresence>
                                {activeFilters.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {activeFilters.map(filter => (
                                            <button
                                                key={filter.key}
                                                onClick={() => removeFilter(filter.key)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-text-secondary hover:border-status-error hover:text-status-error transition-all shadow-sm group"
                                            >
                                                {filter.label}
                                                <X size={14} className="group-hover:scale-110" />
                                            </button>
                                        ))}
                                        <button onClick={clearFilters} className="text-xs font-bold text-status-error uppercase tracking-wider hover:underline px-2">
                                            Clear All
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Results Grid */}
                        {loading && allPets.length === 0 ? (
                            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white h-[400px] rounded-[24px] animate-pulse border border-gray-100"></div>
                                ))}
                            </div>
                        ) : allPets.length > 0 ? (
                            <>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'} `}
                                >
                                    {allPets.map(pet => (
                                        <PetCard key={pet.id} pet={pet} viewMode={viewMode} variant="listing" />
                                    ))}
                                </motion.div>

                                {/* Pagination (Simple) */}
                                {totalCount > 24 && (
                                    <div className="mt-16 flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={page === 1 || loading}
                                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-text-secondary hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="text-sm font-bold text-text-secondary">Page {page}</span>
                                        <button
                                            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={!hasNextPage || loading}
                                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-text-secondary hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <NoResults
                                title="No matching companions found"
                                description="Try adjusting your filters or expanding your search radius."
                                onReset={clearFilters}
                                icon={Search}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            <AnimatePresence>
                {isFilterMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterMobileOpen(false)} />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-bg-primary shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-bg-primary z-20">
                                <h2 className="text-xl font-bold text-text-primary">Filters</h2>
                                <button onClick={() => setIsFilterMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6">
                                <FilterSidebar
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={() => { clearFilters(); setIsFilterMobileOpen(false); }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Filter FAB */}
            <div className="fixed bottom-6 right-6 lg:hidden z-50">
                <button
                    onClick={() => setIsFilterMobileOpen(true)}
                    className="h-14 px-6 bg-brand-primary text-white rounded-full font-bold shadow-lg flex items-center gap-2"
                >
                    Filters {activeFilters.length > 0 && <span className="bg-white text-brand-primary text-xs w-5 h-5 flex items-center justify-center rounded-full">{activeFilters.length}</span>}
                </button>
            </div>

            {/* Admin Create Action */}
            {(user?.role === 'shelter' || user?.role === 'admin') && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fixed bottom-8 left-8 z-40 hidden xl:block"
                >
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                    >
                        <span className="text-3xl">+</span>
                    </button>
                </motion.div>
            )}

            <CreatePetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />

            <LocationPickerModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSelect={handleLocationSelect}
                initialRadius={filters.radius}
            />
        </div>
    );
};

export default PetListingPage;
