import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Grid, List, Calendar, MoreHorizontal, Edit2 } from 'lucide-react';
import usePets from '../../hooks/usePets';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Buttons/Button';

const MyPetsPage = () => {
    const { useGetUserPets } = usePets();
    const { data: pets, isLoading } = useGetUserPets();

    // State for UI controls
    const [activeTab, setActiveTab] = useState('All Pets');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedSpecies, setSelectedSpecies] = useState([]);

    const tabs = ['All Pets', 'Active', 'Rehoming', 'Adopted', 'Inactive'];

    // Filtering Logic
    const filteredPets = useMemo(() => {
        if (!pets) return [];
        return pets.filter(pet => {
            // Tab Filter
            if (activeTab !== 'All Pets') {
                const status = pet.status?.toLowerCase();
                if (activeTab === 'Active' && status !== 'active') return false;
                if (activeTab === 'Rehoming' && status !== 'rehoming') return false;
                if (activeTab === 'Adopted' && status !== 'adopted') return false;
                if (activeTab === 'Inactive' && !['draft', 'archived', 'inactive'].includes(status)) return false;
            }

            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!pet.pet_name?.toLowerCase().includes(query) &&
                    !pet.breed?.toLowerCase().includes(query)) return false;
            }

            // Species Filter
            if (selectedSpecies.length > 0) {
                if (!selectedSpecies.includes(pet.species)) return false;
            }

            return true;
        });
    }, [pets, activeTab, searchQuery, selectedSpecies]);

    // Helpers
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-[#E8F5E9] text-[#2E7D32]'; // Green
            case 'rehoming': return 'bg-[#FFF8E1] text-[#F57F17]'; // Yellow/Gold
            case 'adopted': return 'bg-[#E3F2FD] text-[#1565C0]'; // Blue
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getPetImage = (pet) => {
        if (pet.photos && pet.photos.length > 0) return pet.photos[0];
        return "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80";
    };

    return (
        <div className="min-h-screen bg-[#FFF8E7] p-8 font-sans text-[#2D2D2D]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-serif mb-2 text-[#2D2D2D]">My Pets</h1>
                    <p className="text-[#57534E] text-lg">Manage your pet profiles and track their status</p>
                </div>
                <Link to="/dashboard/pets/create">
                    <button className="bg-[#A68A6D] hover:bg-[#927860] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors shadow-sm">
                        <Plus size={20} />
                        Add New Pet
                    </button>
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#E6D4B9] mb-8">
                <div className="flex gap-8 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 font-bold text-sm transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'text-[#2D2D2D] border-b-2 border-[#2D2D2D]'
                                : 'text-[#A68A6D] hover:text-[#2D2D2D]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68A6D]" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-none rounded-full py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#A68A6D]/20 outline-none text-[#2D2D2D] placeholder-[#A68A6D]/70"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
                    <button className="px-6 py-3 rounded-full bg-[#A68A6D] text-white text-sm font-bold whitespace-nowrap shadow-sm">
                        All Species
                    </button>
                    {['Dogs', 'Cats'].map(species => (
                        <button
                            key={species}
                            onClick={() => {
                                // Simple toggle logic for demo
                                setSelectedSpecies(prev => prev.includes(species) ? prev.filter(s => s !== species) : [...prev, species]);
                            }}
                            className={`px-6 py-3 rounded-full bg-white border border-transparent text-[#57534E] text-sm font-bold whitespace-nowrap hover:bg-[#FAF8F5] shadow-sm transition-colors ${selectedSpecies.includes(species) ? 'ring-2 ring-[#A68A6D]' : ''}`}
                        >
                            {species}
                        </button>
                    ))}
                    <button className="px-6 py-3 rounded-full bg-white text-[#2D2D2D] text-sm font-bold whitespace-nowrap shadow-sm flex items-center gap-2 hover:bg-[#FAF8F5] transition-colors">
                        <Plus size={16} /> More Filters
                    </button>
                </div>

                {/* View Toggle */}
                <div className="bg-white p-1 rounded-lg flex items-center shadow-sm h-fit self-center lg:self-auto ml-auto lg:ml-0">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#FAF8F5] text-[#2D2D2D]' : 'text-[#A68A6D]'}`}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#FAF8F5] text-[#2D2D2D]' : 'text-[#A68A6D]'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Grid Content */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A68A6D]"></div>
                </div>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {filteredPets?.length === 0 && (
                        <div className="col-span-full text-center py-20 text-[#A68A6D]">
                            No pets found matching your criteria.
                        </div>
                    )}

                    {filteredPets?.map(pet => (
                        <div key={pet.id} className="bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#A68A6D]/20 group flex flex-col h-full min-h-[460px]">
                            {/* Card Image */}
                            <div className="relative h-60 rounded-[1.5rem] overflow-hidden mb-4">
                                <img
                                    src={getPetImage(pet)}
                                    alt={pet.pet_name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <span className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(pet.status)}`}>
                                    {pet.status || 'Active'}
                                </span>
                            </div>

                            {/* Card Details */}
                            <div className="px-2 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-2xl font-bold text-[#2D2D2D] font-serif">{pet.pet_name}</h3>
                                    <button className="text-[#A68A6D]/60 hover:text-[#2D2D2D] transition-colors p-1">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                <p className="text-[#57534E] text-sm mb-5 font-medium">{pet.breed || 'Unknown Breed'}</p>

                                <div className="flex items-center gap-2 mb-8">
                                    <span className="px-3 py-1.5 bg-[#FAF8F5] rounded-xl text-[#57534E] text-xs font-bold flex items-center gap-2 border border-[#E6D4B9]/20">
                                        <Calendar size={14} className="text-[#A68A6D]" />
                                        {pet.age_display || (pet.age_months + ' yrs')}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${pet.gender === 'Female'
                                            ? 'bg-[#FFF0F0] text-[#E02424] border-[#FFD6D6]' // Pink for female
                                            : 'bg-[#F0F7FF] text-[#1565C0] border-[#D6E4FF]' // Blue for male
                                        }`}>
                                        {pet.gender === 'Female' ? '♀' : '♂'} {pet.gender}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-auto">
                                    <Link to={`/pets/${pet.id}`} className="flex-1">
                                        <button className="w-full bg-[#2D2D2D] text-white py-3 rounded-2xl font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-[#000000]/10">
                                            {pet.status === 'Rehoming' ? 'View Listing' : 'View Profile'}
                                        </button>
                                    </Link>
                                    <Link to={`/dashboard/pets/edit/${pet.id}`} className="flex-1">
                                        <button className="w-full bg-white border border-[#E5E7EB] text-[#2D2D2D] py-3 rounded-2xl font-bold text-sm hover:bg-[#FAF8F5] transition-colors flex items-center justify-center gap-2">
                                            <Edit2 size={14} /> Edit
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Pet Card (Always Visible) */}
                    <Link to="/dashboard/pets/create" className="bg-[#FFF8E7] rounded-[2rem] p-4 border-2 border-dashed border-[#E6D4B9] hover:border-[#A68A6D] hover:bg-[#FFF8E7]/80 transition-all duration-300 group flex flex-col items-center justify-center min-h-[460px] h-full">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-[#A68A6D]">
                            <Plus size={32} />
                        </div>
                        <span className="text-xl font-bold text-[#A68A6D]">Add New Pet</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyPetsPage;
