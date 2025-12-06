import React, { useState, useEffect } from 'react';
import useAPI from '../../hooks/useAPI';
import { Link } from 'react-router';
import { Heart, ArrowRight } from 'lucide-react';

import star from '../../assets/star.png';
import stars from '../../assets/stars.png';

const FeaturedPets = () => {
    const api = useAPI();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedPets = async () => {
            try {
                const response = await api.get('/pets/?limit=4');
                const data = Array.isArray(response.data) ? response.data : response.data.results || [];
                setPets(data.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch featured pets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedPets();
    }, []);

    return (
        <section className="py-24 bg-bg-primary transition-colors duration-300 relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-8 relative z-10">
                {/* Decorative Stars (Inside Container) */}
                <img src={stars} alt="" className="absolute top-0 left-4 w-20 h-20 opacity-20 animate-pulse" style={{ filter: 'brightness(0)' }} />
                <img src={star} alt="" className="absolute bottom-10 right-10 w-12 h-12 opacity-10 animate-spin-slow" style={{ filter: 'brightness(0)' }} />

                {/* Header */}
                <div className="text-center mb-16 space-y-4 relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary font-logo relative inline-block">
                        Meet Our <span className="text-brand-secondary">Stars</span>
                        <img src={star} alt="" className="absolute -top-4 -right-8 w-6 h-6 animate-spin-slow opacity-80" style={{ filter: 'brightness(0)' }} />
                    </h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto font-medium">
                        A few of the furry faces currently waiting for their forever homes.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[32px] h-[400px] shadow-soft"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pets.map((pet) => (
                            <div key={pet.id} className="group bg-white rounded-[32px] p-4 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-brand-secondary/20">
                                {/* Image Container */}
                                <div className="relative h-72 rounded-[24px] overflow-hidden mb-5">
                                    <img
                                        src={pet.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"}
                                        alt={pet.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                    />
                                    <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-red-50 transition shadow-sm">
                                        <Heart size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-2 pb-2">
                                    <h3 className="text-2xl font-bold text-text-primary mb-1">{pet.name}</h3>
                                    <p className="text-sm text-text-secondary font-medium mb-6">
                                        {pet.breed} • {pet.age} years
                                    </p>

                                    <Link
                                        to={`/pets/${pet.id}`}
                                        className="inline-block text-sm font-bold text-text-primary group-hover:text-brand-secondary transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Link */}
                <div className="text-center mt-16">
                    <Link
                        to="/pets"
                        className="inline-flex items-center gap-2 text-brand-secondary font-bold hover:text-brand-primary transition-colors text-lg group"
                    >
                        View All Pets
                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedPets;
