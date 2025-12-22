import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Grid, List, PackageOpen } from 'lucide-react';
import usePets from '../../hooks/usePets';
import PetCard from '../../components/Pet/PetCard';
import ConfirmationModal from '../../components/common/Modal/ConfirmationModal';
import { toast } from 'react-toastify';

const MyPetsPage = () => {
    const { useGetUserPets, useDeletePet, useUpdatePet } = usePets();
    const { data: pets, isLoading } = useGetUserPets();
    const deletePetMutation = useDeletePet();
    const updatePetMutation = useUpdatePet();

    // State for UI controls
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedSpecies, setSelectedSpecies] = useState([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);

    const tabs = [
        { id: 'All', label: 'All Profiles' },
        { id: 'Active', label: 'Active' },
        { id: 'Inactive', label: 'Archived' }
    ];

    // Filtering Logic
    const filteredPets = useMemo(() => {
        const petsList = Array.isArray(pets) ? pets : (pets?.results || []);
        return petsList.filter(pet => {
            // Tab Filter based on is_active boolean
            if (activeTab === 'Active' && !pet.is_active) return false;
            if (activeTab === 'Inactive' && pet.is_active) return false;

            // Search Filter - PetProfile uses 'name'
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const name = pet.name || '';
                const breed = pet.breed || '';

                if (!name.toLowerCase().includes(query) &&
                    !breed.toLowerCase().includes(query)) return false;
            }

            // Species Filter
            if (selectedSpecies.length > 0) {
                if (!selectedSpecies.includes(pet.species)) return false;
            }

            return true;
        });
    }, [pets, activeTab, searchQuery, selectedSpecies]);

    // Delete Handlers
    const handleDeleteRequest = (pet) => {
        setPetToDelete(pet);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!petToDelete) return;
        try {
            await deletePetMutation.mutateAsync(petToDelete.id);
            toast.success(`${petToDelete.name} has been removed.`);
            setDeleteModalOpen(false);
            setPetToDelete(null);
        } catch (error) {
            toast.error("Failed to delete pet. Please try again.");
            console.error(error);
        }
    };

    // Toggle Active Status
    const handleToggleActive = async (pet) => {
        try {
            await updatePetMutation.mutateAsync({
                id: pet.id,
                data: { is_active: !pet.is_active }
            });
            toast.success(`${pet.name} is now ${!pet.is_active ? 'Active' : 'Archived'}`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    return (
        <div className="min-h-screen font-sans text-text-primary pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Minimal Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-3">
                                My Pets
                            </h1>
                            <p className="text-text-secondary text-lg font-medium">
                                Manage profiles and medical records
                            </p>
                        </div>
                        <Link to="/dashboard/pets/create">
                            <button className="bg-brand-primary text-text-inverted px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:opacity-90 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                                <Plus size={18} strokeWidth={3} />
                                Add New Pet
                            </button>
                        </Link>
                    </div>

                    {/* Tabs & Controls */}
                    <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between mb-10">
                        {/* Pill Tabs */}
                        <div className="bg-bg-secondary p-1.5 rounded-full flex gap-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-bg-surface text-text-primary shadow-sm'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search & View Toggle */}
                        <div className="flex w-full xl:w-auto gap-4">
                            <div className="relative flex-1 xl:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search pets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-full py-3.5 pl-12 pr-4 outline-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all font-medium"
                                />
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full flex shrink-0">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Species Filter (Minimal) */}
                    <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide mb-2">
                        {['dog', 'cat', 'rabbit', 'bird', 'other'].map(species => (
                            <button
                                key={species}
                                onClick={() => {
                                    setSelectedSpecies(prev =>
                                        prev.includes(species)
                                            ? prev.filter(s => s !== species)
                                            : [...prev, species]
                                    );
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${selectedSpecies.includes(species)
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                                    : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                {species}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-32">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-gray-900" />
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {/* Add New Card (OnlyGrid) */}
                            {viewMode === 'grid' && activeTab === 'All' && !searchQuery && (
                                <Link
                                    to="/dashboard/pets/create"
                                    className="group bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 flex flex-col items-center justify-center min-h-[420px] cursor-pointer"
                                >
                                    <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-gray-900">
                                        <Plus size={32} />
                                    </div>
                                    <span className="text-lg font-bold text-gray-500 group-hover:text-gray-900 dark:text-gray-300 transition-colors">Create Profile</span>
                                </Link>
                            )}

                            {/* Pet Cards */}
                            {filteredPets?.map(pet => (
                                <PetCard
                                    key={pet.id}
                                    pet={pet}
                                    viewMode={viewMode}
                                    variant="profile"
                                    onDelete={() => handleDeleteRequest(pet)}
                                    onToggleActive={() => handleToggleActive(pet)}
                                />
                            ))}

                            {/* Empty State */}
                            {filteredPets?.length === 0 && !(!searchQuery && activeTab === 'All' && viewMode === 'grid') && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                        <PackageOpen size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No pets found</h3>
                                    <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Pet Profile?"
                    message={`Are you sure you want to remove ${petToDelete?.name}? This action cannot be undone and all data will be lost.`}
                    confirmText="Yes, Delete"
                    cancelText="Keep"
                    isLoading={deletePetMutation.isPending}
                />
            </div>
        </div>
    );
};

export default MyPetsPage;
