import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, CheckCircle2, AlertCircle, ChevronRight, Edit2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import usePets from '../../hooks/usePets';
import PetCard from '../../components/Pet/PetCard';

const RehomingPetSelectionPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { useGetUserPets } = usePets();
    const { data: pets, isLoading } = useGetUserPets();

    const [selectedPetId, setSelectedPetId] = useState(null);

    const petsList = Array.isArray(pets) ? pets : (pets?.results || []);

    const handlePetClick = (pet) => {
        if (!pet.profile_is_complete) {
            // Navigate to Completion Gate if incomplete
            navigate('/rehoming/pet-incomplete', { state: { pet } });
            return;
        }

        // Toggle selection for complete pets
        if (selectedPetId === pet.id) {
            setSelectedPetId(null);
        } else {
            setSelectedPetId(pet.id);
        }
    };

    const handleContinue = () => {
        if (selectedPetId) {
            navigate('/rehoming/check-in', { state: { petId: selectedPetId } });
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-display font-bold text-foreground mb-3">
                    Which pet do you need to rehome?
                </h1>
                <p className="text-muted-foreground text-lg">
                    Select the pet you're looking to find a new home for.
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-20">Loading pets...</div>
            ) : (
                <>
                    {/* Empty State */}
                    {petsList.length === 0 && (
                        <div className="text-center py-10 bg-secondary/20 rounded-2xl border border-dashed border-border mb-8">
                            <p className="text-lg font-medium mb-4">You don't have any pets available for rehoming.</p>
                            <button
                                onClick={() => navigate('/dashboard/pets/add')}
                                className="btn btn-primary"
                            >
                                <PlusCircle className="mr-2" size={20} /> Add a Pet
                            </button>
                        </div>
                    )}

                    {/* Pet Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {petsList.map(pet => {
                            const isSelected = selectedPetId === pet.id;
                            const isComplete = pet.profile_is_complete;

                            return (
                                <div
                                    key={pet.id}
                                    onClick={() => handlePetClick(pet)}
                                    className={`
                                        relative rounded-2xl border-2 transition-all duration-200 overflow-hidden bg-card cursor-pointer group
                                        ${isSelected ? 'border-primary ring-4 ring-primary/10 scale-[1.02] shadow-xl' : 'border-border hover:border-border/80 hover:shadow-md'}
                                    `}
                                >
                                    {/* Selection Overlay for Complete Pets */}
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 z-10 bg-primary text-white rounded-full p-1 shadow-lg">
                                            <CheckCircle2 size={24} />
                                        </div>
                                    )}

                                    {/* Incomplete Badge */}
                                    {!isComplete && (
                                        <div className="absolute top-3 right-3 z-10 bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                                            <AlertCircle size={14} /> Profile Needs Completion
                                        </div>
                                    )}

                                    {/* Pet Visual */}
                                    <div className="aspect-[4/3] bg-secondary relative">
                                        {pet.media && pet.media.length > 0 ? (
                                            <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100">
                                                No Photo
                                            </div>
                                        )}

                                        {/* Hover Overlay for Incomplete */}
                                        {!isComplete && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <div className="bg-white text-black text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                                                    <Edit2 size={16} /> Complete Profile
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-foreground mb-1">{pet.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{pet.species || 'Unknown Species'}</span>
                                            {pet.breed && <span>• {pet.breed}</span>}
                                            {pet.age && <span>• {pet.age} yrs</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer / Continue Action */}
                    <div className="flex justify-end pt-6 border-t border-border">
                        <button
                            onClick={handleContinue}
                            disabled={!selectedPetId}
                            className={`
                                btn btn-lg flex items-center gap-2 px-10
                                ${selectedPetId ? 'btn-primary shadow-xl hover:-translate-y-1' : 'bg-secondary text-muted-foreground cursor-not-allowed'}
                            `}
                        >
                            Continue <ChevronRight size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RehomingPetSelectionPage;
