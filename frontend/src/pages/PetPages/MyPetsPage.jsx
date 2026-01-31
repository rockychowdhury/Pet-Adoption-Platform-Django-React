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
            // Tab Filter based on status
            if (activeTab === 'Active' && pet.status !== 'active') return false;
            if (activeTab === 'Inactive' && pet.status === 'active') return false;

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
            const newStatus = pet.status === 'active' ? 'rehomed' : 'active'; // or 'archived' depending on backend enum. Let's use rehomed as inactive for now or check model.
            // Backend choices: active, rehomed, deceased. 
            // If currently active -> rehomed. If not active -> active.
            await updatePetMutation.mutateAsync({
                id: pet.id,
                data: { status: newStatus }
            });
            toast.success(`${pet.name} is now ${newStatus === 'active' ? 'Active' : 'Archived'}`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight font-logo">
                        My Pets
                    </h1>
                    <p className="text-text-secondary font-medium mt-1">
                        Manage profiles and medical records
                    </p>
                </div>
                <Link to="/dashboard/pets/create">
                    <button className="bg-brand-primary text-text-inverted px-6 py-2.5 rounded-full font-bold text-sm tracking-wide hover:opacity-90 hover:shadow-md transition-all active:scale-95 flex items-center gap-2">
                        <Plus size={16} strokeWidth={3} />
                        Add New Pet
                    </button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-bg-surface rounded-2xl p-4 border border-border shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-text-primary text-text-inverted shadow-md'
                                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80 hover:text-text-primary'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Species Filter */}
                    <div className="h-6 w-px bg-border hidden md:block"></div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
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
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedSpecies.includes(species)
                                    ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary'
                                    : 'bg-transparent text-text-tertiary border-border hover:border-text-tertiary'
                                    }`}
                            >
                                {species}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & View */}
                <div className="flex w-full xl:w-auto gap-3">
                    <div className="relative flex-1 xl:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search pets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-secondary border-none rounded-xl py-2 pl-9 pr-4 outline-none text-sm font-medium focus:ring-2 focus:ring-brand-primary/50 transition-all"
                        />
                    </div>

                    <div className="bg-bg-secondary p-1 rounded-xl flex shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {isLoading && !pets ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-primary border-t-transparent" />
                </div>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {/* Add New Card (OnlyGrid) */}
                    {viewMode === 'grid' && activeTab === 'All' && !searchQuery && (
                        <Link
                            to="/dashboard/pets/create"
                            className="group bg-bg-surface rounded-3xl p-4 border border-dashed border-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[380px] cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-bg-secondary rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-text-tertiary group-hover:text-brand-primary group-hover:bg-white">
                                <Plus size={28} />
                            </div>
                            <span className="text-sm font-bold text-text-secondary group-hover:text-brand-primary transition-colors">Create Profile</span>
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
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4 text-text-tertiary">
                                <PackageOpen size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-1">No pets found</h3>
                            <p className="text-text-tertiary text-sm">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            )}

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
    );
};

export default MyPetsPage;
