import React, { useState, useEffect } from 'react';
import { Filter, Search, Plus } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import CreatePetModal from '../../components/Pet/CreatePetModal';
import { Link } from 'react-router';

const PetListingPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        species: '',
        breed: '',
        gender: '',
        age_min: '',
        age_max: ''
    });

    const fetchPets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });
            const response = await api.get(`/pets/?${params.toString()}`);
            setPets(response.data);
        } catch (error) {
            console.error("Failed to fetch pets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-natural/20 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 font-logo">Find Your Companion</h1>
                        <p className="text-gray-600 mt-2">Browse our available pets and find your perfect match.</p>
                    </div>
                    {(user?.role === 'shelter' || user?.role === 'admin') && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-action text-white rounded-full font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl"
                        >
                            <Plus size={20} />
                            List a Pet
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                    <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                        <Filter size={20} />
                        <span>Filters</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        <select
                            name="species"
                            value={filters.species}
                            onChange={handleFilterChange}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-action outline-none"
                        >
                            <option value="">All Species</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                        </select>
                        <input
                            type="text"
                            name="breed"
                            placeholder="Breed"
                            value={filters.breed}
                            onChange={handleFilterChange}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-action outline-none"
                        />
                        <select
                            name="gender"
                            value={filters.gender}
                            onChange={handleFilterChange}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-action outline-none"
                        >
                            <option value="">Any Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <input
                            type="number"
                            name="age_min"
                            placeholder="Min Age (Months)"
                            value={filters.age_min}
                            onChange={handleFilterChange}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-action outline-none"
                        />
                        <input
                            type="number"
                            name="age_max"
                            placeholder="Max Age (Months)"
                            value={filters.age_max}
                            onChange={handleFilterChange}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-action outline-none"
                        />
                    </div>
                </div>

                {/* Pet Grid */}
                {loading ? (
                    <div className="text-center py-12">Loading pets...</div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No pets found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pets.map((pet) => (
                            <Link to={`/pets/${pet.id}`} key={pet.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={pet.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"}
                                        alt={pet.name}
                                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 uppercase tracking-wider shadow-sm">
                                        {pet.status}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-action transition">{pet.name}</h3>
                                            <p className="text-gray-500 text-sm">{pet.breed} • {pet.age} months</p>
                                        </div>
                                        {pet.gender === 'male' ? (
                                            <span className="bg-blue-100 text-blue-600 p-2 rounded-full"><Search size={16} className="rotate-90" /></span> // Using Search as a placeholder icon if needed, or just text
                                        ) : (
                                            <span className="bg-pink-100 text-pink-600 p-2 rounded-full"><Search size={16} /></span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <span className="px-3 py-1 bg-natural/30 text-gray-700 rounded-full text-xs font-medium">{pet.species}</span>
                                        <span className="px-3 py-1 bg-natural/30 text-gray-700 rounded-full text-xs font-medium">{pet.gender}</span>
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
                onSuccess={fetchPets}
            />
        </div>
    );
};

export default PetListingPage;
