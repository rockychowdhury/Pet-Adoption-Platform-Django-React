import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { MapPin, Calendar, Heart, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import usePets from '../../hooks/usePets';

const PetDetailsPage = () => {
    const { id } = useParams();
    const { useGetPet } = usePets();
    const { data: pet, isLoading: loading, error } = useGetPet(id);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !pet) return <div className="min-h-screen flex items-center justify-center">Pet not found.</div>;

    return (
        <div className="min-h-screen bg-natural/20 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <Link to="/pets" className="inline-flex items-center text-gray-600 hover:text-action mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Pets
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="h-96 md:h-auto relative">
                            <img
                                src={pet.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition shadow-sm">
                                    <Heart size={24} />
                                </button>
                                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-blue-500 transition shadow-sm">
                                    <Share2 size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-800 font-logo">{pet.name}</h1>
                                        <p className="text-xl text-gray-500 mt-1">{pet.breed}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${pet.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {pet.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="bg-natural/30 p-4 rounded-2xl">
                                        <span className="block text-xs text-gray-500 uppercase tracking-wide">Age</span>
                                        <span className="text-lg font-semibold text-gray-800">{pet.age} Months</span>
                                    </div>
                                    <div className="bg-natural/30 p-4 rounded-2xl">
                                        <span className="block text-xs text-gray-500 uppercase tracking-wide">Gender</span>
                                        <span className="text-lg font-semibold text-gray-800 capitalize">{pet.gender}</span>
                                    </div>
                                    <div className="bg-natural/30 p-4 rounded-2xl">
                                        <span className="block text-xs text-gray-500 uppercase tracking-wide">Color</span>
                                        <span className="text-lg font-semibold text-gray-800">{pet.color}</span>
                                    </div>
                                    <div className="bg-natural/30 p-4 rounded-2xl">
                                        <span className="block text-xs text-gray-500 uppercase tracking-wide">Weight</span>
                                        <span className="text-lg font-semibold text-gray-800">{pet.weight} kg</span>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">About {pet.name}</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {pet.description || "No description provided."}
                                    </p>
                                </div>

                                {pet.is_vaccinated && (
                                    <div className="flex items-center text-green-600 mb-8">
                                        <CheckCircle size={20} className="mr-2" />
                                        <span className="font-medium">Vaccinated & Healthy</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-action text-white rounded-xl font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Adopt {pet.name}
                                </button>
                                <button className="px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-action hover:text-action transition">
                                    Ask a Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsPage;
