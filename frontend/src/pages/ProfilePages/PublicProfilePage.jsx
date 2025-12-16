import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar, Mail, Phone, Shield, Star, Award, Share2, MessageCircle, AlertCircle } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import useAuth from '../../hooks/useAuth';

const PublicProfilePage = () => {
    const { username } = useParams();
    const api = useAPI();
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('about');

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['userProfile', username],
        queryFn: async () => {
            // Mock API call - in real app, replace with actual endpoint
            // const res = await api.get(`/users/${username}/`);
            // return res.data;

            // Simulating API response/delay
            await new Promise(resolve => setTimeout(resolve, 600));
            return {
                id: 1,
                username: username,
                first_name: 'Sarah',
                last_name: 'Jenkins',
                location_city: 'San Francisco',
                location_state: 'CA',
                photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                bio: 'Passionate animal lover and experienced foster parent. I have been fostering dogs for over 5 years and love helping them find their forever homes.',
                joined_at: '2023-01-15',
                is_verified: true,
                badges: ['Verified ID', 'Top Foster', 'Responsive'],
                stats: {
                    rehomed: 12,
                    active_listings: 2,
                    reviews: 28,
                    rating: 4.9
                },
                listings: [
                    {
                        id: 101,
                        name: 'Bella',
                        breed: 'Golden Retriever',
                        age: '2 years',
                        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                        status: 'Available'
                    },
                    {
                        id: 102,
                        name: 'Max',
                        breed: 'Beagle Mix',
                        age: '4 months',
                        image: 'https://images.unsplash.com/photo-1537151608828-ea2b11e77ee8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                        status: 'Available'
                    }
                ],
                reviews: [
                    {
                        id: 1,
                        author: 'Mike T.',
                        rating: 5,
                        text: 'Sarah is amazing! The adoption process was smooth and she really cares about her fosters.',
                        date: '2023-10-12'
                    },
                    {
                        id: 2,
                        author: 'Emily R.',
                        rating: 5,
                        text: 'Very responsive and helpful. Bella is the perfect addition to our family.',
                        date: '2023-09-28'
                    }
                ]
            };
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">User not found</h2>
            <p className="text-gray-600">The user you are looking for does not exist or has been removed.</p>
        </div>
    );

    const isOwnProfile = currentUser?.username === username;

    return (
        <div className="min-h-screen bg-bg-secondary pb-12">
            {/* Cover Photo Area - decorative */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-brand-primary/80 to-brand-secondary/80 w-full relative">
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-24">
                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Sidebar / Main Info Card */}
                    <div className="w-full md:w-80 flex-shrink-0">
                        <Card className="p-6 text-center md:text-left sticky top-24">
                            <div className="relative inline-block mx-auto md:mx-0">
                                <img
                                    src={profile.photoURL}
                                    alt={profile.first_name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                {profile.is_verified && (
                                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white" title="Verified User">
                                        <Shield size={16} fill="currentColor" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <h1 className="text-2xl font-bold text-text-primary">{profile.first_name} {profile.last_name}</h1>
                                <p className="text-text-secondary font-medium">@{profile.username}</p>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-text-secondary">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <MapPin size={16} className="text-brand-secondary" />
                                    <span>{profile.location_city}, {profile.location_state}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Calendar size={16} className="text-brand-secondary" />
                                    <span>Joined {new Date(profile.joined_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Verification Badges */}
                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
                                {profile.badges.map((badge, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
                                        <Award size={12} />
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 space-y-3">
                                {!isOwnProfile ? (
                                    <>
                                        <Button variant="primary" className="w-full">
                                            <MessageCircle size={18} className="mr-2" /> Message
                                        </Button>
                                        <Button variant="outline" className="w-full">
                                            <Share2 size={18} className="mr-2" /> Share Profile
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard/profile'}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>

                            {/* Verification Info */}
                            <div className="mt-8 pt-6 border-t border-border">
                                <h3 className="font-semibold text-text-primary mb-3">Verifications</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-text-secondary"><Mail size={14} /> Email</span>
                                        <span className="text-green-600 font-medium text-xs">Verified</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-text-secondary"><Phone size={14} /> Phone</span>
                                        <span className="text-green-600 font-medium text-xs">Verified</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-text-secondary"><Shield size={14} /> ID Check</span>
                                        <span className="text-green-600 font-medium text-xs">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 w-full">
                        {/* Tabs */}
                        <div className="bg-bg-surface rounded-2xl shadow-sm border border-border p-2 mb-6 flex gap-2">
                            {['about', 'listings', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab
                                            ? 'bg-brand-primary text-text-inverted shadow-md'
                                            : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-text-primary mb-4">About {profile.first_name}</h2>
                                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                                        {profile.bio}
                                    </p>
                                </Card>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-bg-surface p-4 rounded-2xl border border-border text-center">
                                        <p className="text-2xl font-bold text-brand-primary">{profile.stats.rehomed}</p>
                                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mt-1">Pets Rehomed</p>
                                    </div>
                                    <div className="bg-bg-surface p-4 rounded-2xl border border-border text-center">
                                        <p className="text-2xl font-bold text-brand-primary">{profile.stats.active_listings}</p>
                                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mt-1">Active Listings</p>
                                    </div>
                                    <div className="bg-bg-surface p-4 rounded-2xl border border-border text-center">
                                        <p className="text-2xl font-bold text-brand-primary">{profile.stats.reviews}</p>
                                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mt-1">Reviews</p>
                                    </div>
                                    <div className="bg-bg-surface p-4 rounded-2xl border border-border text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-2xl font-bold text-brand-primary">{profile.stats.rating}</span>
                                            <Star size={16} className="text-yellow-400 fill-current" />
                                        </div>
                                        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mt-1">Rating</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Listings Tab */}
                        {activeTab === 'listings' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {profile.listings.map(pet => (
                                    <div key={pet.id} className="group bg-bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-brand-primary shadow-sm">
                                                {pet.status}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-text-primary">{pet.name}</h3>
                                                    <p className="text-xs text-text-secondary">{pet.breed}</p>
                                                </div>
                                                <span className="text-sm font-semibold text-text-primary">{pet.age}</span>
                                            </div>
                                            <Button size="sm" variant="outline" className="w-full mt-2">View Details</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-4">
                                {profile.reviews.map(review => (
                                    <Card key={review.id} className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                                    {review.author[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text-primary">{review.author}</h4>
                                                    <p className="text-xs text-text-tertiary">{new Date(review.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            "{review.text}"
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfilePage;
