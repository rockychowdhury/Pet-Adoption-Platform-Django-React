import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Share2, Heart, MapPin, Calendar, CheckCircle, AlertCircle, Maximize2, Flag, MessageCircle } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';

const PetDetailPage = () => {
    const { id } = useParams();
    const api = useAPI();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { data: pet, isLoading } = useQuery({
        queryKey: ['pet', id],
        queryFn: async () => {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                id: id,
                name: 'Bella',
                breed: 'Golden Retriever',
                type: 'Purebred',
                age_years: 2,
                age_months: 3,
                gender: 'Female',
                status: 'Active', // or 'Rehoming'
                added_on: '2023-10-24',
                location: 'San Francisco, CA',
                bio: 'Bella is a high-energy Golden Retriever who loves swimming and playing fetch. She is incredibly friendly with children and other dogs. We are looking to rehome her because we are moving overseas and cannot take her with us. She is fully vaccinated, microchipped, and house-trained. She knows basic commands like sit, stay, and paw. She does have a bit of separation anxiety, so a home where someone is around most of the day would be ideal.',
                photos: [
                    'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', // Main
                    'https://images.unsplash.com/photo-1537151608828-ea2b11e77ee8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
                ],
                owner: {
                    id: 101,
                    name: 'Alex Morgan',
                    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    role: 'Pet Owner',
                    stats: {
                        pets: 3,
                        reviews: 12,
                        rating: 5.0
                    }
                },
                rehoming_status: {
                    is_rehoming: true,
                    posted_ago: '2d ago',
                    applications_count: 5,
                    period_open: true
                }
            };
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
    );

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % pet.photos.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + pet.photos.length) % pet.photos.length);
    };

    return (
        <div className="min-h-screen bg-bg-primary pb-20">
            {/* Using the specific creamy background color from the UI image */}

            {/* Nav / Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
                <Link to="/dashboard/my-pets" className="text-xl font-bold text-text-primary hover:text-brand-primary transition-colors">
                    FurEver Home
                </Link>
                <div className="flex gap-4">
                    <button className="p-2 rounded-full bg-bg-surface shadow-sm hover:shadow-md transition">
                        <Share2 size={20} className="text-text-secondary" />
                    </button>
                    <img src={pet.owner.avatar} alt="User" className="w-10 h-10 rounded-full border border-border" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Images & Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Gallery */}
                    <div className="relative h-[400px] md:h-[500px] rounded-[32px] overflow-hidden group shadow-lg">
                        <img
                            src={pet.photos[currentImageIndex]}
                            alt={pet.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Fullscreen Trigger */}
                        <button className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-2 hover:bg-black/80 transition">
                            <Maximize2 size={14} /> Fullscreen
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {pet.photos.map((photo, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-brand-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <img src={photo} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Basic Info */}
                    <div>
                        <h1 className="text-4xl font-bold text-text-primary mb-2">{pet.name}</h1>
                        <p className="text-xl text-text-secondary font-medium">{pet.breed} • {pet.type}</p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-bg-secondary p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Age</p>
                            <p className="text-lg font-bold text-text-primary">{pet.age_years} Years {pet.age_months} Months</p>
                        </div>
                        <div className="bg-bg-secondary p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Gender</p>
                            <p className="text-lg font-bold text-text-primary">{pet.gender}</p>
                        </div>
                        <div className="bg-bg-secondary p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Status</p>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-success/10 text-status-success text-xs font-bold">
                                {pet.status}
                            </div>
                        </div>
                        <div className="bg-bg-secondary p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Added On</p>
                            <p className="text-lg font-bold text-text-primary">{new Date(pet.added_on).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* About Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-text-primary mb-4">About {pet.name}</h3>
                        <p className="text-text-secondary leading-relaxed text-lg whitespace-pre-line">
                            {pet.bio}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link to={`/pets/edit/${pet.id}`}>
                            <Button variant="primary" className="px-8 py-3 rounded-full flex items-center gap-2">
                                <span className="text-sm font-bold">Edit Profile</span>
                            </Button>
                        </Link>
                        <Button variant="outline" className="border border-border bg-bg-surface hover:bg-bg-secondary text-text-primary px-8 py-3 rounded-full flex items-center gap-2">
                            <span className="text-sm font-bold">Create Rehoming Listing</span>
                        </Button>
                        <div className="flex-1 text-right">
                            <Button variant="danger" className="bg-status-error/10 hover:bg-status-error/20 text-status-error px-8 py-3 rounded-full flex items-center gap-2 ml-auto">
                                <span className="text-sm font-bold">Delete Profile</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Cards */}
                <div className="space-y-6">
                    {/* Owner Profile Card */}
                    <div className="bg-bg-surface rounded-3xl p-6 shadow-sm border border-border">
                        <h3 className="text-lg font-bold text-text-primary mb-6">Owner Profile</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <img src={pet.owner.avatar} alt={pet.owner.name} className="w-16 h-16 rounded-full object-cover" />
                            <div>
                                <h4 className="font-bold text-lg text-text-primary">{pet.owner.name}</h4>
                                <span className="bg-brand-secondary/10 text-brand-secondary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{pet.owner.role}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-center pb-6 border-b border-border mb-4">
                            <div>
                                <p className="text-lg font-bold text-text-primary">{pet.owner.stats.pets}</p>
                                <p className="text-[10px] text-text-tertiary font-bold uppercase">Pets</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-text-primary">{pet.owner.stats.reviews}</p>
                                <p className="text-[10px] text-text-tertiary font-bold uppercase">Reviews</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-text-primary">{pet.owner.stats.rating}</p>
                                <p className="text-[10px] text-text-tertiary font-bold uppercase">Rating</p>
                            </div>
                        </div>
                        <Link to={`/profile/${pet.owner.id}`} className="block text-center text-sm font-bold text-text-secondary hover:text-brand-primary transition-colors">
                            View Full Profile →
                        </Link>
                    </div>

                    {/* Rehoming Status Card */}
                    {pet.rehoming_status.is_rehoming && (
                        <div className="bg-bg-surface rounded-3xl p-0 shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border bg-bg-secondary">
                                <h3 className="text-lg font-bold text-text-primary">Rehoming Listing</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="bg-status-warning/10 text-status-warning text-[10px] font-bold px-2 py-1 rounded-full uppercase">Being Rehomed</span>
                                    <span className="text-xs text-text-tertiary">Posted {pet.rehoming_status.posted_ago}</span>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-text-primary mb-1">Application Period Open</p>
                                    <p className="text-xs text-text-secondary flex items-center gap-1">
                                        <MessageCircle size={12} /> {pet.rehoming_status.applications_count} Applications received
                                    </p>
                                </div>

                                <Link to="/dashboard/rehoming/manage" className="block w-full">
                                    <Button variant="outline" className="w-full justify-center bg-bg-surface hover:bg-bg-secondary border border-border">
                                        View Listing Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetDetailPage;
