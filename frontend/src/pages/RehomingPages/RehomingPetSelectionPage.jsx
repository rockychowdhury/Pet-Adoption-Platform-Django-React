import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle2, AlertCircle, Edit2, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import usePets from '../../hooks/usePets';

const RehomingPetSelectionPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { useGetUserPets } = usePets();
    const { data: pets, isLoading } = useGetUserPets();

    const [selectedPetId, setSelectedPetId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const petsList = Array.isArray(pets) ? pets : (pets?.results || []);

    // Filter pets based on search
    const filteredPets = petsList.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pet.species && pet.species.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const selectedPet = petsList.find(p => p.id === selectedPetId);

    const handlePetClick = (pet) => {
        if (!pet.profile_is_complete) {
            // Navigate to Completion Gate if incomplete
            navigate('/rehoming/pet-incomplete', { state: { pet } });
            return;
        }

        // Toggle selection
        if (selectedPetId === pet.id) {
            setSelectedPetId(null);
        } else {
            setSelectedPetId(pet.id);
        }
    };

    const handleContinue = () => {
        if (selectedPetId) {
            // Full Flow: Check-in first
            navigate('/rehoming/check-in', { state: { petId: selectedPetId } });
        }
    };

    if (isLoading) return <div className="text-center py-20 font-jakarta">Loading pets...</div>;

    return (
        <div className="w-full pb-32">
            {/* Header */}
            <div className="text-center mb-16 pt-4">
                <h1 className="text-4xl md:text-5xl font-logo font-black text-text-primary mb-4 tracking-tight">
                    Which pet do you need to rehome?
                </h1>
                <p className="font-jakarta text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    Select the pet you're looking to find a new home for. We'll help you build a
                    profile that attracts the right adopters.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand-primary transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or breed..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 rounded-full border border-border bg-white shadow-sm focus:shadow-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none text-lg font-jakarta transition-all duration-300 placeholder:text-text-tertiary"
                    />
                </div>
            </div>

            {/* Empty State */}
            {petsList.length === 0 && (
                <div className="text-center py-20 bg-bg-secondary/40 rounded-[48px] border border-dashed border-border mb-8 max-w-3xl mx-auto">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                        <PlusCircle className="text-brand-primary" size={32} />
                    </div>
                    <p className="text-xl font-jakarta font-medium text-text-primary mb-8">You don't have any pets available for rehoming.</p>
                    <button
                        onClick={() => navigate('/dashboard/pets/add')}
                        className="btn-primary rounded-full px-8 py-3 h-auto text-lg"
                    >
                        Add a Pet
                    </button>
                </div>
            )}

            {/* Pet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto px-4">
                {filteredPets.map(pet => {
                    const isSelected = selectedPetId === pet.id;
                    const isComplete = pet.profile_is_complete;

                    return (
                        <div
                            key={pet.id}
                            onClick={() => handlePetClick(pet)}
                            className={`
                                relative rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 group bg-white
                                ${isSelected
                                    ? 'ring-2 ring-brand-primary shadow-xl scale-[1.02]'
                                    : 'border border-border hover:shadow-lg hover:-translate-y-1'
                                }
                            `}
                        >
                            {/* Selection Checkmark */}
                            {isSelected && (
                                <div className="absolute top-4 right-4 z-20 bg-brand-primary text-white rounded-full p-1.5 shadow-lg animate-in zoom-in duration-200">
                                    <CheckCircle2 size={20} className="text-white" />
                                </div>
                            )}

                            {/* Incomplete Badge */}
                            {!isComplete && (
                                <div className="absolute top-4 right-4 z-20 bg-yellow-100/90 backdrop-blur text-yellow-800 border border-yellow-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 font-jakarta uppercase tracking-wide">
                                    <AlertCircle size={12} /> Incomplete
                                </div>
                            )}

                            {/* Pet Image */}
                            <div className="aspect-[1.1] bg-bg-secondary relative overflow-hidden">
                                {pet.media && pet.media.length > 0 ? (
                                    <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary bg-bg-secondary">
                                        <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-2">
                                            <Search size={24} className="opacity-50" />
                                        </div>
                                        <span className="text-sm font-medium font-jakarta">No Photo</span>
                                    </div>
                                )}

                                {/* Hover Overlay for Incomplete */}
                                {!isComplete && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-white text-text-primary text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg">
                                            <Edit2 size={14} /> Complete Profile
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Content */}
                            <div className={`p-6 text-center transition-colors duration-300 ${isSelected ? 'bg-brand-primary/5' : 'bg-white'}`}>
                                <h3 className={`text-xl font-bold font-logo mb-1 tracking-tight ${isSelected ? 'text-brand-primary' : 'text-text-primary'}`}>
                                    {pet.name}
                                </h3>
                                <div className="text-sm text-text-secondary font-medium font-jakarta">
                                    {pet.species || 'Unknown'}
                                    {pet.breed && <span className="opacity-60"> • {pet.breed}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer / Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border p-6 z-40 transform translate-y-0 transition-transform duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-bold font-jakarta transition-colors px-6 py-3 rounded-xl hover:bg-bg-secondary"
                    >
                        <ArrowLeft size={20} /> <span className="uppercase tracking-wider text-sm">Back</span>
                    </button>

                    <div className="hidden md:block">
                        {selectedPet && (
                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
                                <span className="text-xs text-text-tertiary uppercase tracking-widest font-bold">Selected Pet</span>
                                <span className="text-lg font-logo text-brand-primary">{selectedPet.name}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={!selectedPetId}
                        className={`
                            h-14 px-8 rounded-full font-bold text-white transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                            ${selectedPetId
                                ? 'bg-brand-secondary hover:opacity-90 cursor-pointer'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:translate-y-0'}
                        `}
                    >
                        <span className="uppercase tracking-widest text-sm">Continue</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RehomingPetSelectionPage;
