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
                <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-text-primary font-logo mb-2 leading-tight">Find Your Companion</h1>
                        <p className="text-text-secondary text-lg">Browse our available pets and find your perfect match.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-72">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search by name, breed..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="w-full pl-12 pr-4 h-12 rounded-full border-none bg-bg-surface/50 hover:bg-bg-surface focus:bg-bg-surface text-text-primary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all shadow-sm text-sm font-medium placeholder:text-text-secondary/50"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
                        </div>

                        {/* Toggle Filters */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-6 h-12 rounded-full font-bold transition-all shadow-sm text-sm ${showFilters ? 'bg-text-primary text-bg-primary' : 'bg-bg-surface text-text-primary hover:bg-white hover:shadow-md'}`}
                        >
                            <Filter size={18} />
                            Filters
                        </button>

                        {(user?.role === 'shelter' || user?.role === 'admin') && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-6 h-12 bg-brand-primary text-white rounded-full font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">List Pet</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Expanded Filters Panel */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}`}>
                    <div className="bg-bg-surface p-8 rounded-[32px] shadow-soft border border-white/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {/* Sort By */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Sort By</label>
                                <div className="relative">
                                    <select
                                        name="ordering"
                                        value={filters.ordering}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 h-12 rounded-2xl bg-bg-primary border-none text-text-primary focus:ring-2 focus:ring-brand-secondary/20 outline-none appearance-none cursor-pointer text-sm font-medium"
                                    >
                                        <option value="-created_at">Newest First</option>
                                        <option value="created_at">Oldest First</option>
                                        <option value="age">Age (Youngest)</option>
                                        <option value="-age">Age (Oldest)</option>
                                        <option value="name">Name (A-Z)</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Species */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Species</label>
                                <div className="relative">
                                    <select
                                        name="species"
                                        value={filters.species}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 h-12 rounded-2xl bg-bg-primary border-none text-text-primary focus:ring-2 focus:ring-brand-secondary/20 outline-none appearance-none cursor-pointer text-sm font-medium"
                                    >
                                        <option value="">Any</option>
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Gender</label>
                                <div className="relative">
                                    <select
                                        name="gender"
                                        value={filters.gender}
                                        onChange={handleFilterChange}
                                        className="w-full px-4 h-12 rounded-2xl bg-bg-primary border-none text-text-primary focus:ring-2 focus:ring-brand-secondary/20 outline-none appearance-none cursor-pointer text-sm font-medium"
                                    >
                                        <option value="">Any</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Age Range */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Min Age</label>
                                <input
                                    type="number"
                                    name="age_min"
                                    placeholder="0 months"
                                    value={filters.age_min}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 h-12 rounded-2xl bg-bg-primary border-none text-text-primary focus:ring-2 focus:ring-brand-secondary/20 outline-none text-sm font-medium placeholder:text-text-secondary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Max Age</label>
                                <input
                                    type="number"
                                    name="age_max"
                                    placeholder="Any"
                                    value={filters.age_max}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 h-12 rounded-2xl bg-bg-primary border-none text-text-primary focus:ring-2 focus:ring-brand-secondary/20 outline-none text-sm font-medium placeholder:text-text-secondary/50"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 transition uppercase tracking-wider">Clear All Filters</button>
                        </div>
                    </div>
                </div>

                {/* Results Count & Active Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
                    <span className="font-bold text-text-primary text-sm">Showing {pets.length} pets</span>
                    <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter) => (
                            <div key={filter.key} className="flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border/50 text-xs font-bold text-text-secondary shadow-sm">
                                <span>{filter.label}</span>
                                <button onClick={() => removeFilter(filter.key)} className="hover:text-red-500 transition">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pet Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-bg-surface rounded-[32px] h-[450px] shadow-soft"></div>
                        ))}
                    </div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-32 bg-bg-surface rounded-[32px] shadow-soft border border-white/20 max-w-2xl mx-auto">
                        <div className="bg-bg-primary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={40} className="text-text-secondary/50" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">No pets found</h3>
                        <p className="text-text-secondary mb-8">Try adjusting your filters or search terms.</p>
                        <button onClick={clearFilters} className="px-8 py-3 bg-text-primary text-bg-primary rounded-full font-bold hover:opacity-90 transition">Clear filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pets.map((pet) => (
                            <Link to={`/pets/${pet.id}`} key={pet.id} className="group bg-bg-surface rounded-[32px] p-3 shadow-soft hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white/20 flex flex-col h-full">
                                {/* Image Container */}
                                <div className="h-64 rounded-[24px] overflow-hidden relative bg-bg-primary">
                                    <img
                                        src={pet.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"}
                                        alt={pet.name}
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${pet.status === 'available' ? 'bg-green-500 text-white' :
                                                pet.status === 'pending' ? 'bg-orange-500 text-white' :
                                                    'bg-gray-500 text-white'
                                            }`}>
                                            {pet.status === 'available' ? '● Available' : pet.status === 'pending' ? '● Pending' : '● Adopted'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-4 pt-5 pb-2 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-2xl font-bold text-text-primary group-hover:text-brand-secondary transition-colors">{pet.name}</h3>
                                        <div className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center text-text-secondary group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                                            {/* Using a generic icon or specific gender icon */}
                                            {pet.gender === 'male' ? <BsGenderMale size={16} /> : <BsGenderFemale size={16} />}
                                        </div>
                                    </div>

                                    <p className="text-text-secondary text-sm font-medium mb-1">{pet.breed}</p>
                                    <p className="text-text-secondary/70 text-xs mb-6">{pet.age} months • {pet.species}</p>

                                    <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
                                            POSTED {new Date(pet.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}
                                        </span>
                                        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider group-hover:underline">
                                            View Details
                                        </span>
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
