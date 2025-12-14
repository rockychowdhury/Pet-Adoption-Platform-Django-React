import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Share2, ArrowLeft, User, Calendar, Award, Heart } from 'lucide-react';
import useAPI from '../../hooks/useAPI';

const PetProfilePage = () => {
    const { id } = useParams();
    const api = useAPI();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await api.get(`/user/pets/${id}/`);
                setPet(response.data);
            } catch (err) {
                console.error("Error fetching pet:", err);
                setError("Pet not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [id, api]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading pet profile...</div>;
    if (error || !pet) return <div className="min-h-screen flex items-center justify-center">Pet not found.</div>;

    const traits = pet.personality_traits ? pet.personality_traits.split(',').map(t => t.trim()) : [];

    return (
        <div className="min-h-screen bg-bg-primary pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-4xl mx-auto">
                <Link to={`/u/profile`} className="inline-flex items-center text-text-secondary hover:text-brand-secondary mb-6 transition font-medium text-sm">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Profile
                </Link>

                <div className="bg-white rounded-[32px] shadow-lg overflow-hidden">
                    {/* Hero Section */}
                    <div className="h-64 sm:h-80 bg-gray-200 relative">
                        {pet.profile_photo ? (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${pet.profile_photo})` }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-bg-secondary text-brand-secondary">
                                <span className="text-6xl">🐾</span>
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <button className="w-10 h-10 bg-bg-surface/80 backdrop-blur rounded-full flex items-center justify-center text-text-secondary hover:text-brand-secondary shadow-sm transition">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="px-8 sm:px-12 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div>
                                <h1 className="text-4xl font-bold text-natural font-logo mb-2">{pet.name}</h1>
                                <p className="text-lg text-text-secondary font-medium">
                                    {pet.breed || pet.species} • {pet.age} years old
                                </p>
                                <div className="flex gap-2 mt-4">
                                    {traits.map((trait, index) => (
                                        <span key={index} className="px-3 py-1 bg-bg-secondary text-brand-secondary text-xs font-bold uppercase tracking-wider rounded-lg border border-border">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Owner Card */}
                            {pet.owner && (
                                <div className="bg-bg-secondary p-4 rounded-2xl flex items-center gap-4 min-w-[250px] border border-border card">
                                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                                        {pet.owner.photoURL ? (
                                            <img src={pet.owner.photoURL} alt={pet.owner.first_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500"><User size={20} /></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Loved by</p>
                                        <p className="font-bold text-natural">{pet.owner.first_name} {pet.owner.last_name}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-natural mb-3 flex items-center gap-2">
                                        <Heart className="text-brand-secondary" size={20} /> About {pet.name}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                        {pet.bio || `${pet.name} hasn't shared their story yet.`}
                                    </p>
                                </div>

                                {pet.gotcha_day && (
                                    <div className="bg-bg-secondary p-6 rounded-2xl border border-border/30 flex items-center gap-4 card">
                                        <div className="w-12 h-12 bg-bg-surface rounded-full flex items-center justify-center text-brand-secondary shadow-sm">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-brand-secondary uppercase tracking-wider">Gotcha Day</p>
                                            <p className="text-lg font-bold text-natural">{new Date(pet.gotcha_day).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-bg-surface p-4 rounded-xl border border-border shadow-sm text-center card">
                                        <span className="block text-2xl font-bold text-text-primary mb-1">{pet.age}</span>
                                        <span className="text-xs text-text-tertiary font-bold uppercase">Years</span>
                                    </div>
                                    <div className="bg-bg-surface p-4 rounded-xl border border-border shadow-sm text-center card">
                                        <span className="block text-2xl font-bold text-natural mb-1 capitalize">{pet.gender ? pet.gender[0] : '?'}</span>
                                        <span className="text-xs text-gray-500 font-bold uppercase">{pet.gender || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetProfilePage;
