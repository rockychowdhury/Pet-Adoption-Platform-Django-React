import React, { useState, useEffect } from 'react';
import { Filter, Search, Plus, X, ChevronDown } from 'lucide-react';
import { BsGenderMale, BsGenderFemale } from 'react-icons/bs';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import usePets from '../../hooks/usePets';
import CreatePetModal from '../../components/Pet/CreatePetModal';
import { Link } from 'react-router';

const PetListingPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const { useGetPets } = usePets();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

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
        if (filters.age_min) active.push({ key: 'age_min', label: `Min Age: ${filters.age_min}m` });
        if (filters.age_max) active.push({ key: 'age_max', label: `Max Age: ${filters.age_max}m` });
        if (filters.search) active.push({ key: 'search', label: `Search: "${filters.search}"` });
        return active;
    };

    const activeFilters = getActiveFilters();

    return (
        <div className="min-h-screen bg-bg-primary pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-inter transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div>
                        <h1 className="text-[40px] font-bold text-text-primary font-logo mb-2 leading-tight">Find Your Companion</h1>
                        <p className="text-text-secondary text-lg">Browse our available pets and find your perfect match.</p>
                    </div>

                    <div className="flex gap-6 w-full md:w-auto items-center">
                        {/* Search Bar */}
                        <div className="relative flex-grow md:flex-grow-0 md:w-64">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search by name, breed..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-4 h-10 rounded-full border border-border bg-bg-surface text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
                        </div>

                        {/* Toggle Filters */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 h-10 rounded-full font-semibold transition border text-sm ${showFilters ? 'bg-action text-white border-action' : 'bg-bg-surface text-text-primary border-border hover:border-action'}`}
                        >
                            <Filter size={16} />
                            Filters
                        </button>

                        {(user?.role === 'shelter' || user?.role === 'admin') && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-5 h-10 bg-action text-white rounded-full font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl text-sm"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">List Pet</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Expanded Filters Panel */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                    <div className="bg-bg-surface p-6 rounded-3xl shadow-sm border border-border">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Sort By */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Sort By</label>
                                <div className="relative">
                                    <select
                                        name="ordering"
                                        value={filters.ordering}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 h-10 rounded-xl bg-bg-primary border border-border text-text-primary focus:border-action outline-none appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="-created_at">Newest First</option>
                                        <option value="created_at">Oldest First</option>
                                        <option value="age">Age (Youngest)</option>
                                        <option value="-age">Age (Oldest)</option>
                                        <option value="name">Name (A-Z)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Species */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Species</label>
                                <div className="relative">
                                    <select
                                        name="species"
                                        value={filters.species}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 h-10 rounded-xl bg-bg-primary border border-border text-text-primary focus:border-action outline-none appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="">All Species</option>
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Gender</label>
                                <div className="relative">
                                    <select
                                        name="gender"
                                        value={filters.gender}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 h-10 rounded-xl bg-bg-primary border border-border text-text-primary focus:border-action outline-none appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="">Any Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Age Range */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Min Age</label>
                                <input
                                    type="number"
                                    name="age_min"
                                    placeholder="0"
                                    value={filters.age_min}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 h-10 rounded-xl bg-bg-primary border border-border text-text-primary focus:border-action outline-none text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Max Age</label>
                                <input
                                    type="number"
                                    name="age_max"
                                    placeholder="Any"
                                    value={filters.age_max}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 h-10 rounded-xl bg-bg-primary border border-border text-text-primary focus:border-action outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={clearFilters} className="text-sm text-red-500 hover:underline font-medium">Clear All</button>
                        </div>
                    </div>
                </div>

                {/* Results Count & Active Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="font-bold text-text-primary">Showing {pets.length} pets</span>
                    {activeFilters.map((filter) => (
                        <div key={filter.key} className="flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border text-sm text-text-secondary shadow-sm">
                            <span>{filter.label}</span>
                            <button onClick={() => removeFilter(filter.key)} className="hover:text-red-500 transition">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pet Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-bg-surface rounded-3xl h-96 shadow-sm"></div>
                        ))}
                    </div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-20 bg-bg-surface rounded-3xl shadow-sm border border-border max-w-2xl mx-auto">
                        <div className="bg-bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">No pets found</h3>
                        <p className="text-text-secondary">Try adjusting your filters or search terms.</p>
                        <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-action text-white rounded-full font-semibold hover:bg-action_dark transition">Clear filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pets.map((pet) => (
                            <Link to={`/pets/${pet.id}`} key={pet.id} className="group bg-bg-surface rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-border flex flex-col">
                                <div className="h-72 overflow-hidden relative bg-bg-secondary">
                                    <img
                                        src={pet.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"}
                                        alt={pet.name}
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-bg-surface/95 backdrop-blur-sm px-3 py-1 rounded-md text-[10px] font-bold text-text-secondary uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${pet.status === 'available' ? 'bg-green-500' : pet.status === 'pending' ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                                        {pet.status}
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition duration-300">
                                        <p className="text-white text-sm font-medium line-clamp-2">{pet.description}</p>
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold text-text-primary group-hover:text-action transition">{pet.name}</h3>
                                            {pet.gender === 'male' ? (
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                                    <BsGenderMale size={18} />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                                                    <BsGenderFemale size={18} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-text-secondary text-sm font-medium mb-4">{pet.breed}</p>

                                        <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
                                            <span>{pet.age} months</span>
                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                            <span>{pet.species}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="w-full h-px bg-border mb-4"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">POSTED {new Date(pet.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            <span className="text-action font-bold text-xs tracking-wide group-hover:underline uppercase">View Details</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <CreatePetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />
        </div>
    );
};

export default PetListingPage;
