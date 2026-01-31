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
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search & Toolbar Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Input - Left Aligned & Wide */}
                    {/* Search Input - Left Aligned & Compact */}
                    <div className="relative flex-1 w-full max-w-md"> {/* Reduced width from max-w-2xl */}
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by breed, name..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange({ target: { name: 'search', value: e.target.value } })}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                        />
                    </div>

                    {/* Right Side Stats & Toggles */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-xs font-bold text-gray-500 hidden xl:block">
                            Showing {totalCount} pets
                        </span>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={filters.ordering}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-bold px-4 py-2.5 pr-8 rounded-xl shadow-sm outline-none hover:border-gray-300 cursor-pointer focus:ring-2 focus:ring-brand-primary/10"
                            >
                                <option value="-published_at">Newest First</option>
                                <option value="created_at">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronRight size={14} className="rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex gap-8 items-start">

                    {/* Left Sidebar - Persistent (Desktop) */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-28">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                        />
                    </div>

                    {/* Right Content - Grid */}
                    <div className="flex-1 min-w-0">

                        {/* Mobile Filter Trigger */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm"
                            >
                                <ListIcon size={18} />
                                <span>Filters & Location</span>
                                {activeFilters.length > 0 && (
                                    <span className="ml-1 bg-brand-primary text-white px-2 py-0.5 rounded-full text-xs">{activeFilters.length}</span>
                                )}
                            </button>
                        </div>

                        {/* Active Filter Chips */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {activeFilters.map(filter => (
                                    <span key={filter.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm">
                                        {filter.label}
                                        <button onClick={() => removeFilter(filter.key)} className="hover:text-red-500 ml-1"><X size={14} /></button>
                                    </span>
                                ))}
                                <button onClick={clearFilters} className="text-xs text-status-error font-bold hover:underline px-2">Clear All</button>
                            </div>
                        )}


                        {/* Results Grid - Full Width 4 Columns */}
                        {loading && allPets.length === 0 ? (
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="bg-white h-[300px] rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>
                                ))}
                            </div>
                        ) : allPets.length > 0 ? (
                            <>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                >
                                    {allPets.map(pet => (
                                        <PetCard key={pet.id} pet={pet} viewMode="grid" variant="compact-listing" />
                                    ))}
                                </motion.div>

                                {/* Pagination */}
                                {/* Pagination */}
                                {totalCount > 0 && (
                                    <div className="mt-16 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={page === 1 || loading}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold bg-white"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {/* Simple Numbered Pagination Logic */}
                                        {Array.from({ length: Math.min(5, Math.ceil(totalCount / 24)) }, (_, i) => {
                                            const p = i + 1; // 1-based index
                                            // TODO: Make this smarter for large page counts (dots), simply showing first 5 for now as dummy or active window
                                            // Better logic: show active, neighbors, first, last.
                                            // For MVP/Demo: Just standard simple list if pages < 7, else complex. Assuming low data count for now.
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
                                            disabled={!hasNextPage || loading}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold bg-white"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-20">
                                <NoResults
                                    title="No matching companions found"
                                    description="Try adjusting your filters or expanding your search radius."
                                    onReset={clearFilters}
                                    icon={Search}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Drawer (Mobile) */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterDrawerOpen(false)} />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white shadow-2xl flex flex-col"
                        >
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-20">
                                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5">
                                <FilterSidebar
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={() => { clearFilters(); setIsFilterDrawerOpen(false); }}
                                />
                            </div>

                            <div className="p-5 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
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
