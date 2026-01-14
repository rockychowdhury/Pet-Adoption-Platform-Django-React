import React, { useState, useEffect, useRef } from 'react';
import {
    Search, LayoutGrid, List as ListIcon, Loader2, X, SlidersHorizontal, Sparkles, MapPin, Calendar, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
// import usePets from '../../hooks/usePets';
import useRehoming from '../../hooks/useRehoming';
import NoResults from '../../components/common/Feedback/NoResults';
import CreatePetModal from '../../components/Pet/CreatePetModal';
import FilterSidebar from '../../components/Pet/FilterSidebar';
import PetCard from '../../components/Pet/PetCard';
import Button from '../../components/common/Buttons/Button';
import LocationPickerModal from '../../components/Pet/LocationPickerModal';
import SortDropdown from '../../components/Pet/SortDropdown';

const PetListingPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const { useGetListings } = useRehoming();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
    const [page, setPage] = useState(1);

    // View State
    const [viewMode, setViewMode] = useState('grid');

    const [searchParams, setSearchParams] = useSearchParams();

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
        ordering: '-published_at'
    });

    const [allPets, setAllPets] = useState([]);

    // Filter out radius if no location is provided to avoid empty results
    const fetchFilters = { ...filters };
    if (!fetchFilters.location) {
        delete fetchFilters.radius;
    }

    const { data, isLoading: loading, refetch } = useGetListings({ ...fetchFilters, page });

    const totalCount = data?.count || 0;
    const hasNextPage = !!data?.next;

    // IP-Based Location Detection on Mount
    useEffect(() => {
        const detectLocation = async () => {
            // Only detect if no location is currently set in filters
            if (!filters.location && !searchParams.get('location')) {
                try {
                    // Using ipwho.is as a fallback since ipapi.co blocked the request (403)
                    const response = await fetch('https://ipwho.is/');
                    if (!response.ok) throw new Error('Location detection failed');
                    const data = await response.json();

                    if (data.success && data.city && data.region_code) {
                        const locationString = `${data.city}, ${data.region_code} `;
                        setSuggestedLocation(locationString);
                    }
                } catch (error) {
                    console.error("Auto-location detection error:", error);
                }
            }
        };

        detectLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    const handleLocationSelect = (locationData) => {
        const { name, radius } = locationData;

        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        newParams.set('location', name);
        newParams.set('radius', radius);
        setSearchParams(newParams);

        // Modal will close via prop
        setIsLocationModalOpen(false);
    };

    // Synchronize API data with local state
    useEffect(() => {
        if (data?.results) {
            setAllPets(data.results);
        } else if (!loading && page === 1 && data && !data.results?.length) {
            // Explicitly clear if API returns empty for page 1
            setAllPets([]);
        }
    }, [data, page, loading]);

    // Synchronize filters with URL changes (for navbar search)
    useEffect(() => {
        const search = searchParams.get('search') || '';
        const location = searchParams.get('location') || '';
        const radius = parseInt(searchParams.get('radius')) || 50;

        if (search !== filters.search || location !== filters.location || radius !== filters.radius) {
            setFilters(prev => ({
                ...prev,
                search,
                location,
                radius
            }));
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
        let val;

        if (type === 'checkbox') {
            val = checked ? 'true' : '';
        } else if (type === 'radio') {
            // Toggle behavior: if already selected, clear it
            val = filters[name] === value ? '' : value;
        } else {
            val = value;
        }

        setFilters(prev => ({
            ...prev,
            [name]: val
        }));

        // Synchronously reset results when filters change
        setAllPets([]);
        setPage(1);

        // Sync important filters to URL for SEO/Sharing
        if (['search', 'location', 'radius'].includes(name)) {
            const newParams = new URLSearchParams(searchParams);
            if (val) newParams.set(name, val);
            else newParams.delete(name);
            setSearchParams(newParams);
        }
    };

    const clearFilters = () => {
        // Check if any filter is actually active
        const hasActiveFilters = Object.keys(filters).some(key => {
            if (key === 'max_fee') return filters[key] !== '';
            if (key === 'radius') return filters[key] !== 50;
            if (key === 'ordering') return filters[key] !== '-published_at';
            return filters[key] !== '';
        });

        if (!hasActiveFilters) {
            setSearchParams({});
            return;
        }

        setFilters({
            search: '',
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
            location: '',
            radius: 50,
            ordering: '-published_at'
        });
        setAllPets([]);
        setPage(1);
        setSearchParams({}); // CRITICAL: Clear URL as well
    };


    const removeFilter = (key) => {
        // Update URL if key is synced
        if (['search', 'location', 'radius'].includes(key)) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete(key);
            setSearchParams(newParams);
        }

        // Synchronously reset results
        setAllPets([]);
        setPage(1);

        // Special handling for max_fee to reset to default, not empty
        if (key === 'max_fee') {
            setFilters(prev => ({ ...prev, [key]: '' }));
        } else {
            setFilters(prev => ({ ...prev, [key]: '' }));
        }
    };

    const getActiveFilters = () => {
        const active = [];
        if (filters.species) active.push({ key: 'species', label: `Species: ${filters.species} ` });
        if (filters.gender) active.push({ key: 'gender', label: `Gender: ${filters.gender} ` });
        if (filters.size) active.push({ key: 'size', label: `Size: ${filters.size.toUpperCase()} ` });
        if (filters.urgency_level) active.push({ key: 'urgency_level', label: `Urgency: ${filters.urgency_level} ` });
        if (filters.search) active.push({ key: 'search', label: `Search: "${filters.search}"` });
        if (filters.location) active.push({ key: 'location', label: `Near: ${filters.location} ` });
        if (filters.age_range) active.push({ key: 'age_range', label: `Age: ${filters.age_range.replace(/_/g, ' ')} ` });
        if (filters.max_fee) active.push({ key: 'max_fee', label: `Max Fee: $${filters.max_fee} ` });
        if (filters.house_trained === 'true') active.push({ key: 'house_trained', label: 'House-trained' });
        if (filters.special_needs === 'true') active.push({ key: 'special_needs', label: 'Special Needs' });
        if (filters.verified_owner === 'true') active.push({ key: 'verified_owner', label: 'Verified Owner' });
        if (filters.verified_identity === 'true') active.push({ key: 'verified_identity', label: 'Verified Identity' });
        if (filters.verified_vet === 'true') active.push({ key: 'verified_vet', label: 'Verified Vet' });
        return active;
    };

    const activeFilters = getActiveFilters();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-bg-primary font-jakarta">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-40 pt-12">
                <div className="flex flex-col xl:flex-row gap-16 py-12">

                    {/* Filter Sidebar */}
                    <aside className="hidden xl:block w-80 shrink-0">
                        <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </aside>

                    {/* Main Results Area */}
                    <div className="flex-1">

                        {/* Results Header Bar */}
                        <div className="flex flex-col gap-6 mb-8">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-[#1F2937] mb-1">
                                        All Pets
                                    </h1>
                                    <h3 className="text-[13px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                                        Showing {allPets.length} of {totalCount} results
                                    </h3>
                                </div>

                                {/* Center Location Display */}
                                {filters.location ? (
                                    <button
                                        onClick={() => setIsLocationModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-full border border-brand-primary/10 hover:bg-brand-primary/10 transition-colors group"
                                    >
                                        <MapPin size={16} className="text-brand-primary" />
                                        <span className="text-sm font-bold text-[#1F2937]">{filters.location}</span>
                                        <span className="text-[10px] text-text-tertiary ml-1 group-hover:text-text-secondary">({filters.radius} mi)</span>
                                    </button>
                                ) : suggestedLocation ? (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-center gap-1.5 text-amber-700">
                                            <MapPin size={14} />
                                            <span className="text-xs font-bold">Near {suggestedLocation}?</span>
                                        </div>
                                        <div className="w-px h-4 bg-amber-200 mx-1"></div>
                                        <button
                                            onClick={() => handleLocationSelect({ name: suggestedLocation, radius: 50 })}
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

                                <div className="flex items-center gap-3">
                                    {/* Sorting Dropdown */}
                                    <SortDropdown
                                        currentSort={filters.ordering}
                                        onSortChange={handleSortChange}
                                    />


                                    {/* View Mode Switcher */}
                                    <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p - 2 rounded - md transition - all ${viewMode === 'grid' ? 'bg-white text-[#1F2937] shadow-sm' : 'text-[#9CA3AF] hover:text-[#4B5563]'} `}
                                        >
                                            <LayoutGrid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p - 2 rounded - md transition - all ${viewMode === 'list' ? 'bg-white text-[#1F2937] shadow-sm' : 'text-[#9CA3AF] hover:text-[#4B5563]'} `}
                                        >
                                            <ListIcon size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filter Badges */}
                            <AnimatePresence>
                                {activeFilters.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {activeFilters.map(filter => (
                                            <button
                                                key={filter.key}
                                                onClick={() => removeFilter(filter.key)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-gray-100 text-[12px] font-medium text-[#4B5563] hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm group"
                                            >
                                                {filter.label}
                                                <X size={14} className="text-gray-400 group-hover:text-gray-600" />
                                            </button>
                                        ))}
                                        {activeFilters.length > 1 && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-[12px] font-bold text-[#EF4444] hover:text-[#DC2626] transition-colors px-2 self-center uppercase tracking-wider"
                                            >
                                                Reset All
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Results States */}
                        {loading && allPets.length === 0 ? (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-bg-secondary/40 h-[500px] rounded-[48px] animate-pulse border border-border/10"></div>
                                ))}
                            </div>
                        ) : allPets.length > 0 ? (
                            <>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'} `}
                                >
                                    {allPets.map(pet => (
                                        <motion.div key={pet.id} variants={itemVariants}>
                                            <PetCard pet={pet} viewMode={viewMode} />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Pagination Components */}
                                {totalCount > 24 && (
                                    <div className="mt-16 flex items-center justify-center gap-3">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => {
                                                setPage(p => Math.max(1, p - 1));
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={page === 1 || loading}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm mx-2">
                                            {[...Array(Math.ceil(totalCount / 24))].map((_, idx) => {
                                                const pageNum = idx + 1;
                                                // Simple logic to show limited pages if too many (basic implementation for now)
                                                // Showing all if < 7, else complex logic needed.
                                                // For now, let's just show current, first, last context or simple scrollable list if huge.
                                                // Assuming reasonable count for MVP.
                                                if (Math.ceil(totalCount / 24) > 7) {
                                                    // Show 1, ..., current-1, current, current+1, ..., last
                                                    if (
                                                        pageNum === 1 ||
                                                        pageNum === Math.ceil(totalCount / 24) ||
                                                        (pageNum >= page - 1 && pageNum <= page + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => {
                                                                    setPage(pageNum);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${page === pageNum
                                                                    ? 'bg-[#2D5A41] text-white shadow-md scale-110'
                                                                    : 'text-gray-500 hover:bg-gray-50'
                                                                    } `}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    } else if (
                                                        (pageNum === 2 && page > 3) ||
                                                        (pageNum === Math.ceil(totalCount / 24) - 1 && page < Math.ceil(totalCount / 24) - 2)
                                                    ) {
                                                        return <span key={pageNum} className="text-gray-300 text-[10px]">...</span>;
                                                    }
                                                    return null;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => {
                                                            setPage(pageNum);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${page === pageNum
                                                            ? 'bg-[#2D5A41] text-white shadow-md scale-110'
                                                            : 'text-gray-500 hover:bg-gray-50'
                                                            } `}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => {
                                                setPage(p => p + 1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            disabled={!hasNextPage || loading}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <NoResults
                                title="No companions found"
                                description="Try adjusting your filters or searching in a different area to find more friends."
                                onReset={clearFilters}
                                backgroundText="EMPTY"
                                icon={Search}
                            />
                        )}
                    </div>
                </div>
            </div >

            {/* Mobile Filter Overlay - Upgraded */}
            < AnimatePresence >
                {isFilterMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setIsFilterMobileOpen(false)}></div>
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-bg-primary shadow-2xl overflow-y-auto"
                        >
                            <div className="p-8 border-b border-border/10 flex items-center justify-between sticky top-0 bg-bg-primary/80 backdrop-blur-xl z-20">
                                <div>
                                    <h2 className="text-3xl font-logo font-black tracking-tighter uppercase leading-none">Filters</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mt-1">Refine Listings</p>
                                </div>
                                <button onClick={() => setIsFilterMobileOpen(false)} className="w-12 h-12 flex items-center justify-center bg-bg-secondary rounded-2xl hover:bg-status-error hover:text-white transition-all">
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </div>
                            <div className="p-8">
                                <FilterSidebar
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={() => { clearFilters(); setIsFilterMobileOpen(false); }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Admin Floating Action - Premium Stylized */}
            {
                (user?.role === 'shelter' || user?.role === 'admin') && (
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="fixed bottom-12 right-12 z-50"
                    >
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-20 h-20 bg-brand-primary text-text-inverted rounded-[28px] flex items-center justify-center shadow-[0_20px_50px_rgba(91,138,114,0.4)] hover:shadow-brand-primary/60 transition-all border-8 border-bg-surface overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                            <span className="text-4xl font-black relative z-10 group-hover:scale-125 transition-transform">+</span>
                        </button>
                    </motion.div>
                )
            }


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
        </div >
    );
};

export default PetListingPage;
