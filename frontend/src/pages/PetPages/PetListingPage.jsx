import React, { useState } from 'react';
import { Search, LayoutGrid, List as ListIcon, Loader2, X } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import usePets from '../../hooks/usePets';
import CreatePetModal from '../../components/Pet/CreatePetModal';
import FilterSidebar from '../../components/Pet/FilterSidebar';
import PetCard from '../../components/Pet/PetCard';
import Button from '../../components/common/Buttons/Button';
import { Link } from 'react-router-dom';

const PetListingPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const { useGetPets } = usePets();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // View State
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filter State
    const [filters, setFilters] = useState({
        search: '',
        species: '',
        breed: '',
        gender: '',
        age_min: '',
        age_max: '',
        ordering: '-created_at'
    });

    const { data: pets = [], isLoading: loading, refetch } = useGetPets(filters);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            species: '',
            breed: '',
            gender: '',
            age_min: '',
            age_max: '',
            ordering: '-created_at'
        });
    };

    const removeFilter = (key) => {
        setFilters({ ...filters, [key]: '' });
    };

    // Helper to get active filters for display
    const getActiveFilters = () => {
        const active = [];
        if (filters.species) active.push({ key: 'species', label: `Species: ${filters.species}` });
        if (filters.gender) active.push({ key: 'gender', label: `Gender: ${filters.gender === 'male' ? 'Male' : 'Female'}` });
        if (filters.search) active.push({ key: 'search', label: `Search: "${filters.search}"` });
        return active;
    };

    const activeFilters = getActiveFilters();

    return (
        <div className="min-h-screen bg-[#FFFBF0] font-inter">
            {/* Page Header */}
            <div className="bg-[#FFFBF0] pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center transition-all duration-300">
                {filters.search ? (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
                            Search results for: "{filters.search}"
                        </h1>
                        <p className="text-gray-500 text-lg mb-8">
                            Found {pets.length} results matching your search
                        </p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Find Your Perfect Companion</h1>
                        <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">Browse pets looking for loving homes across the country</p>
                    </>
                )}

                {/* Large Search Bar */}
                <div className="max-w-3xl mx-auto relative group">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by breed, name, or keyword..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full h-16 pl-8 pr-16 rounded-full border border-gray-200 focus:ring-4 focus:ring-brand-primary/10 outline-none shadow-sm text-lg placeholder:text-gray-400 group-hover:border-brand-primary/50 transition-colors"
                    />
                    <button className="absolute right-2 top-2 h-12 w-12 bg-[#9B8573] hover:bg-[#8A7565] text-white rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg transform active:scale-95">
                        <Search size={24} />
                    </button>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar */}
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />

                    {/* Main Content */}
                    <div className="flex-1">

                        {/* Results Header */}
                        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                            <span className="text-gray-500">Showing {pets.length} pets</span>

                            <div className="flex items-center gap-4">
                                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <LayoutGrid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ListIcon size={20} />
                                    </button>
                                </div>

                                <select
                                    name="ordering"
                                    value={filters.ordering}
                                    onChange={handleFilterChange}
                                    className="pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer"
                                    style={{ backgroundImage: 'none' }}
                                >
                                    <option value="-created_at">Newest First</option>
                                    <option value="created_at">Oldest First</option>
                                    <option value="age">Youngest First</option>
                                    <option value="-age">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {activeFilters.map(filter => (
                                    <span key={filter.key} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm">
                                        {filter.label}
                                        <button onClick={() => removeFilter(filter.key)} className="hover:text-red-500 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:underline px-2">
                                    Clear All
                                </button>
                            </div>
                        )}

                        {/* Pet Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-brand-primary" />
                            </div>
                        ) : pets.length > 0 ? (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {pets.map(pet => (
                                    <PetCard key={pet.id} pet={pet} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No pets found</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any pets matching your criteria. Try adjusting your filters or search terms.</p>
                                <Button variant="secondary" onClick={clearFilters}>
                                    Clear all filters
                                </Button>
                            </div>
                        )}

                        {/* Load More Button (Mock Implementation) */}
                        {pets.length > 0 && (
                            <div className="mt-12 text-center">
                                <button className="px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                                    Load More Pets
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Admin/Shelter Action - Floating Button or Header Action if needed */}
            {(user?.role === 'shelter' || user?.role === 'admin') && (
                <div className="fixed bottom-8 right-8 z-20">
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="shadow-xl rounded-full py-4 px-6 flex items-center gap-2"
                    >
                        + List Pet
                    </Button>
                </div>
            )}

            <CreatePetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />
        </div>
    );
};

export default PetListingPage;
