import React, { useState, useEffect } from 'react';
import useAPI from '../../hooks/useAPI';
import { Link } from 'react-router';
import { Heart } from 'lucide-react';

const FeaturedPets = () => {
    const api = useAPI();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedPets = async () => {
            try {
                const response = await api.get('/pets/?limit=4');
                // Assuming the API returns a list, take the first 4
                // If pagination is implemented, response.data.results might be needed
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
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-natural mb-4 font-logo">Meet Our <span className="text-action">Stars</span></h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-inter">These adorable pets are looking for their forever homes. Could you be the one?</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading stars...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pets.map((pet) => (
                            <div key={pet.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 group border border-gray-100">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={pet.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"}
                                        alt={pet.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                    />
                                    <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 transition">
                                        <Heart size={20} />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-natural mb-1">{pet.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{pet.breed} • {pet.age} months</p>
                                    <Link to={`/pets/${pet.id}`} className="block w-full py-2 text-center border border-action text-action rounded-xl font-semibold hover:bg-action hover:text-white transition duration-300">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link to="/pets" className="inline-flex items-center text-action font-semibold hover:text-action_dark transition">
                        View All Pets <span className="ml-2">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedPets;
