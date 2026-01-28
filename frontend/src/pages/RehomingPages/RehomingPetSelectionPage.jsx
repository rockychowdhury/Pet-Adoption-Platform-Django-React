import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PlusCircle, CheckCircle2, AlertCircle, Edit2, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import usePets from '../../hooks/usePets';

const RehomingPetSelectionPage = () => {
    const { setPetId, markStepComplete } = useOutletContext();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { useGetUserPets } = usePets();
    const { data: pets, isLoading } = useGetUserPets({ exclude_active_listings: true });

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
            // Direct redirect to Edit Page with returnTo context
            navigate(`/dashboard/pets/${pet.id}/edit`, {
                state: { returnTo: '/rehoming/select-pet' } // Context for return
            });
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
            setPetId(selectedPetId);
            markStepComplete('selection');
            navigate('/rehoming/situation');
        }
    };

    if (isLoading) return <div className="text-center py-20 ">Loading pets...</div>;

    return (
        <div className="w-full pb-24">
            {/* Header */}
            <div className="text-center mb-8 pt-0">
                <h1 className="text-2xl md:text-3xl font-black text-text-primary mb-3 tracking-tight">
                    Which pet do you need to rehome?
                </h1>
                <p className=" text-text-secondary text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                    Select the pet you're looking to find a new home for. We'll help you build a
                    profile that attracts the right adopters.
                </p>

                {/* Search Bar */}
                <div className="max-w-lg mx-auto relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand-primary transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or breed..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-5 py-3 rounded-full border border-border bg-bg-surface shadow-sm focus:shadow-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none text-sm text-text-primary transition-all duration-300 placeholder:text-text-tertiary"
                    />
                </div>
            </div>

            {/* Empty State */}
            {petsList.length === 0 && (
                <div className="text-center py-16 bg-bg-secondary/40 rounded-[32px] border border-dashed border-border mb-8 max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-bg-surface rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                        <PlusCircle className="text-brand-primary" size={24} />
                    </div>
                    <p className="text-lg  font-medium text-text-primary mb-6">You don't have any pets available for rehoming.</p>
                    <button
                        onClick={() => navigate('/dashboard/pets/add')}
                        className="bg-brand-primary text-text-inverted rounded-full px-6 py-2.5 h-auto text-base font-bold shadow-md hover:opacity-90 transition-all"
                    >
                        Add a Pet
                    </button>
                </div>
            )}

            {/* Pet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4">
                {filteredPets.map(pet => {
                    const isSelected = selectedPetId === pet.id;
                    const isComplete = pet.profile_is_complete;

                    return (
                        <div
                            key={pet.id}
                            onClick={() => handlePetClick(pet)}
                            className={`
                                relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group bg-bg-surface
                                ${isSelected
                                    ? 'ring-2 ring-brand-primary shadow-xl scale-[1.02]'
                                    : 'border border-border hover:shadow-lg hover:-translate-y-1'
                                }
                            `}
                        >
                            {/* Selection Checkmark */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 z-20 bg-brand-primary text-text-inverted rounded-full p-1 shadow-lg animate-in zoom-in duration-200">
                                    <CheckCircle2 size={14} className="text-current" />
                                </div>
                            )}

                            {/* Incomplete Badge */}
                            {!isComplete && (
                                <div className="absolute top-2 right-2 z-20 bg-status-warning/90 backdrop-blur text-yellow-900 border border-yellow-200/50 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1  uppercase tracking-wide">
                                    <AlertCircle size={10} /> Incomplete
                                </div>
                            )}

                            {/* Pet Image - More Landscape now */}
                            <div className="aspect-[4/3] bg-bg-secondary relative overflow-hidden">
                                {pet.media && pet.media.length > 0 ? (
                                    <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary bg-bg-secondary">
                                        <div className="w-10 h-10 rounded-full bg-bg-surface/50 flex items-center justify-center mb-2">
                                            <Search size={16} className="opacity-50" />
                                        </div>
                                        <span className="text-[10px] font-medium ">No Photo</span>
                                    </div>
                                )}

                                {/* Hover Overlay for Incomplete */}
                                {!isComplete && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-bg-surface text-text-primary text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg">
                                            <Edit2 size={10} /> Complete Profile
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Content */}
                            <div className={`p-3 text-center transition-colors duration-300 ${isSelected ? 'bg-brand-primary/5' : 'bg-bg-surface'}`}>
                                <h3 className={`text-base font-bold mb-0.5 tracking-tight ${isSelected ? 'text-brand-primary' : 'text-text-primary'}`}>
                                    {pet.name}
                                </h3>
                                <div className="text-[10px] text-text-secondary font-medium ">
                                    {pet.species || 'Unknown'}
                                    {pet.breed && <span className="opacity-60"> • {pet.breed}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer / Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-bg-surface/80 backdrop-blur-xl border-t border-border p-4 z-40 transform translate-y-0 transition-transform duration-300">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-bold  transition-colors px-4 py-2 rounded-lg hover:bg-bg-secondary"
                    >
                        <ArrowLeft size={18} /> <span className="uppercase tracking-wider text-xs">Back</span>
                    </button>

                    <div className="hidden md:block">
                        {selectedPet && (
                            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
                                <span className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">Selected Pet</span>
                                <span className="text-sm font-bold text-brand-primary">{selectedPet.name}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={!selectedPetId}
                        className={`
                            h-12 px-6 rounded-full font-bold text-text-inverted transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                            ${selectedPetId
                                ? 'bg-brand-secondary hover:opacity-90 cursor-pointer'
                                : 'bg-text-tertiary cursor-not-allowed shadow-none hover:translate-y-0'}
                        `}
                    >
                        <span className="uppercase tracking-widest text-xs">Continue</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RehomingPetSelectionPage;
