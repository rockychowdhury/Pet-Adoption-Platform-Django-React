import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Heart, Flag, Shield, ChevronLeft, ChevronRight, Check, X, AlertTriangle, MapPin, Calendar, MessageCircle } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import useAuth from '../../hooks/useAuth';

const RehomingListingDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [currentImage, setCurrentImage] = useState(0);

    // Mock Data
    const listing = {
        id: id,
        pet: {
            name: 'Bella',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: '2 years 3 months',
            gender: 'Female',
            weight: '55 lbs',
            energy: 5,
            location: 'San Francisco, CA',
            distance: '5 miles away',
            posted: '3 days ago',
            views: 432,
            bio: "Bella is a high-energy Golden Retriever who loves swimming and playing fetch. She is incredibly friendly with children and other dogs. We are looking to rehome her because we are moving overseas and cannot take her with us. She is fully vaccinated, microchipped, and house-trained.",
            photos: [
                'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1537151608828-ea2b11e77ee8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            ],
            medical: {
                spayed: true,
                microchipped: true,
                vaccinations: 'Up to Date',
                conditions: 'None'
            },
            behavior: {
                kids: true,
                dogs: true,
                cats: false,
                houseTrained: true,
                aggression: false
            },
            adoption: {
                fee: 50,
                includes: ['Crate', 'Leash', 'Food Bowls'],
                timeline: 'ASAP'
            }
        },
        owner: {
            id: 101,
            name: 'Alex Morgan',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            joined: '2023',
            responseRate: '100%',
            rating: 4.9,
            reviews: 12
        }
    };

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % listing.pet.photos.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + listing.pet.photos.length) % listing.pet.photos.length);

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Breadcrumb / Nav */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Link to="/browse" className="text-sm font-bold text-text-tertiary hover:text-brand-primary flex items-center gap-1">
                    <ChevronLeft size={14} /> Back to Search
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-sm group">
                            <img src={listing.pet.photos[currentImage]} alt="Main" className="w-full h-full object-cover" />
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all">
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                                {currentImage + 1} / {listing.pet.photos.length}
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {listing.pet.photos.map((src, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImage(idx)}
                                    className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${currentImage === idx ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={src} className="w-full h-full object-cover" alt="Thumb" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Header Info */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h1 className="text-4xl font-bold text-text-primary mb-2">{listing.pet.name}</h1>
                                <div className="flex items-center gap-4 text-text-secondary">
                                    <span className="font-semibold">{listing.pet.breed}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {listing.pet.location} ({listing.pet.distance})</span>
                                </div>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-text-secondary flex items-center gap-2 justify-end"><Calendar size={14} /> Posted {listing.pet.posted}</p>
                                <p className="text-xs text-text-tertiary mt-1">{listing.pet.views} views</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Age', value: listing.pet.age },
                            { label: 'Gender', value: listing.pet.gender },
                            { label: 'Weight', value: listing.pet.weight },
                            { label: 'Energy', value: 'High Energy' }, // simplified
                        ].map(stat => (
                            <div key={stat.label} className="bg-[#FFF9F2] p-4 rounded-xl border border-[#FFE8CC]">
                                <p className="text-[10px] uppercase font-bold text-[#B5823B] tracking-wider mb-1">{stat.label}</p>
                                <p className="font-bold text-[#5D554D]">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* About */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-text-primary">About {listing.pet.name}</h2>
                        <p className="text-text-secondary text-lg leading-relaxed">{listing.pet.bio}</p>
                    </div>

                    {/* Behavior */}
                    <Card className="p-8">
                        <h3 className="text-xl font-bold mb-6">Personality & Behavior</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="font-medium text-text-secondary">Good with Kids</span>
                                {listing.pet.behavior.kids ? <span className="text-green-600 font-bold flex items-center gap-1"><Check size={16} /> Yes</span> : <span className="text-red-500 font-bold flex items-center gap-1"><X size={16} /> No</span>}
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="font-medium text-text-secondary">Good with Dogs</span>
                                {listing.pet.behavior.dogs ? <span className="text-green-600 font-bold flex items-center gap-1"><Check size={16} /> Yes</span> : <span className="text-red-500 font-bold flex items-center gap-1"><X size={16} /> No</span>}
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="font-medium text-text-secondary">Good with Cats</span>
                                {listing.pet.behavior.cats ? <span className="text-green-600 font-bold flex items-center gap-1"><Check size={16} /> Yes</span> : <span className="text-red-500 font-bold flex items-center gap-1"><X size={16} /> No</span>}
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="font-medium text-text-secondary">House Trained</span>
                                {listing.pet.behavior.houseTrained ? <span className="text-green-600 font-bold flex items-center gap-1"><Check size={16} /> Yes</span> : <span className="text-red-500 font-bold flex items-center gap-1"><X size={16} /> No</span>}
                            </div>
                        </div>
                    </Card>

                    {/* Medical */}
                    <Card className="p-8">
                        <h3 className="text-xl font-bold mb-6">Medical History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-sm font-bold text-text-tertiary mb-1">Vaccinations</p>
                                <p className="font-bold text-green-600 flex items-center gap-2"><Check size={16} /> {listing.pet.medical.vaccinations}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-tertiary mb-1">Spayed / Neutered</p>
                                <p className="font-bold text-text-primary">{listing.pet.medical.spayed ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-tertiary mb-1">Microchipped</p>
                                <p className="font-bold text-text-primary">{listing.pet.medical.microchipped ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-tertiary mb-1">Medical Conditions</p>
                                <p className="font-bold text-text-primary">{listing.pet.medical.conditions}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Adoption Terms */}
                    <Card className="p-8 bg-[#F0FDF4] border-green-200">
                        <h3 className="text-xl font-bold text-green-900 mb-6">Adoption Details</h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div>
                                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Adoption Fee</p>
                                <p className="text-4xl font-bold text-green-800">${listing.pet.adoption.fee}</p>
                                <p className="text-xs text-green-600 mt-1">Covers care costs</p>
                            </div>
                            <div className="h-px md:h-auto w-full md:w-px bg-green-200"></div>
                            <div>
                                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Included Items</p>
                                <div className="flex flex-wrap gap-2">
                                    {listing.pet.adoption.includes.map(item => (
                                        <span key={item} className="bg-white text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">{item}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-border sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-3xl font-bold text-text-primary">${listing.pet.adoption.fee}</span>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors border border-border">
                                    <Heart size={20} />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-50 transition-colors border border-border">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        <Link to={`/dashboard/adopt/${id}`} className="block w-full mb-3">
                            <Button variant="primary" className="w-full justify-center py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Apply to Adopt
                            </Button>
                        </Link>

                        <p className="text-center text-xs text-text-tertiary mb-6">Usually responds within 24 hours</p>

                        <div className="pt-6 border-t border-border">
                            <h4 className="font-bold text-sm text-text-secondary mb-4 uppercase tracking-wider">Meet the Owner</h4>
                            <div className="flex items-center gap-4">
                                <img src={listing.owner.avatar} alt="Owner" className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-bold text-text-primary">{listing.owner.name}</p>
                                    <p className="text-xs text-text-secondary flex items-center gap-1">
                                        ⭐ {listing.owner.rating} ({listing.owner.reviews} reviews)
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full mt-4 justify-center">Contact Owner</Button>
                        </div>
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-4 text-slate-700">
                            <Shield size={20} />
                            <h4 className="font-bold">Safety Tips</h4>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div> Meet in public places</li>
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div> Bring a friend along</li>
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div> Never send money beforehand</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <button className="text-xs font-bold text-text-tertiary hover:text-red-500 flex items-center justify-center gap-1 mx-auto">
                            <Flag size={12} /> Report this listing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RehomingListingDetailPage;
