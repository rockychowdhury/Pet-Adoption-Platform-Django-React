import React, { useState, useEffect } from 'react';
import {
    Search, List as ListIcon, Loader2, X, MapPin, ChevronLeft, ChevronRight, Plus
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

const PetListingPage = () => {
    const { user } = useAuth();
    const { useGetListings } = useRehoming();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Unified Filter Drawer State (Mobile & Desktop)
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const [page, setPage] = useState(1);
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
        verified_owner: '',
        verified_identity: '',
        location: searchParams.get('location') || '',
        radius: parseInt(searchParams.get('radius')) || 50,
        // Backend expects 'lat'/'lng'
        ordering: '-published_at'
    });

    const [allPets, setAllPets] = useState([]);

    // Filter out radius if no location is provided
    const fetchFilters = { ...filters };
    if (!fetchFilters.location) {
        delete fetchFilters.radius;
    }

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
        const newParams = new URLSearchParams(searchParams);
        newParams.set('location', name);
        newParams.set('radius', radius);
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

    // Derived Active Filters for Chips
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

    // Quick Species Select Helper
    const toggleSpecies = (speciesId) => {
        const newVal = filters.species === speciesId ? '' : speciesId;
        setFilters(prev => ({ ...prev, species: newVal }));
        setAllPets([]);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-bg-primary ">
            <div className="max-w-7xl mx-auto px-6 pb-40 pt-8">

                {/* 1. Header & Top Filters Container */}
                <div className="flex flex-col gap-6 mb-8">

                    {/* Top Row: Compact Title + Actions */}
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter leading-none">
                                Find a <span className="text-brand-primary">Companion</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="h-0.5 w-6 bg-brand-secondary rounded-full opacity-50"></div>
                                <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
                                    {totalCount} pets waiting
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Location Button */}
                            <button
                                onClick={() => setIsLocationModalOpen(true)}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all text-xs font-bold shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gray-200 active:scale-95 ${filters.location
                                    ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/20'
                                    : suggestedLocation
                                        ? 'bg-amber-50/50 text-amber-800 border-amber-100'
                                        : 'bg-white text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <MapPin size={16} className={filters.location ? "fill-brand-primary/20" : ""} />
                                <span className="max-w-[120px] truncate">
                                    {filters.location || suggestedLocation || "Set Location"}
                                </span>
                            </button>

                            {/* Filter Drawer Trigger */}
                            <button
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all text-xs font-bold shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gray-200 active:scale-95 ${activeFilters.length > 0 ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-text-secondary hover:text-text-primary'}`}
                            >
                                <ListIcon size={16} />
                                <span className="hidden sm:inline">Filters</span>
                                {activeFilters.length > 0 && (
                                    <span className="bg-white text-gray-900 w-4 h-4 flex items-center justify-center rounded-full text-[9px]">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Chips (Replacing Species Section) */}
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
                                        onClick={clearFilters}
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
                                    Browse all available companions or use filters to narrow down.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                {/* Results Grid - Full Width 4 Columns */}
                {loading && allPets.length === 0 ? (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white h-[320px] rounded-[24px] animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : allPets.length > 0 ? (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {allPets.map(pet => (
                                <PetCard key={pet.id} pet={pet} viewMode="grid" variant="compact-listing" />
                            ))}
                        </motion.div>

                        {/* Pagination */}
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
                                <FilterSidebar
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={() => { clearFilters(); setIsFilterDrawerOpen(false); }}
                                />
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Show {totalCount} Results
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin Create Action */}
            {(user?.role === 'shelter' || user?.role === 'admin') && (
                <div className="fixed bottom-8 left-8 z-40">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                    >
                        <Plus size={28} />
                    </button>
                </div>
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
