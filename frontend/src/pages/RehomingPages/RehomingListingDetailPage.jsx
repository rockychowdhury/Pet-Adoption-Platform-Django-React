import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Heart, Flag, Shield, ChevronLeft, ChevronRight, Check, X, AlertTriangle, MapPin, Calendar, MessageCircle } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import useAuth from '../../hooks/useAuth';
import useRehoming from '../../hooks/useRehoming';

const RehomingListingDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [currentImage, setCurrentImage] = useState(0);

    // Hooks
    const { useGetListingDetail } = useRehoming();
    const { data: listing, isLoading, error } = useGetListingDetail(id);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !listing) return <div className="min-h-screen flex items-center justify-center">Listing not found.</div>;

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % (listing.pet.photos?.length || 1));
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + (listing.pet.photos?.length || 1)) % (listing.pet.photos?.length || 1));

    const photos = listing.pet.photos || [];
    const displayPhotos = photos.length > 0 ? photos.map(p => p.url || p) : ['https://via.placeholder.com/800x600?text=No+Photo'];

    return (
        <div className="min-h-screen bg-bg-primary pb-20">
            {/* Breadcrumb / Nav */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <Link to="/pets" className="text-sm font-bold text-text-tertiary hover:text-brand-primary flex items-center gap-1">
                    <ChevronLeft size={14} /> Back to Search
                </Link>
            </div>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Gallery */}
                    <div className="space-y-3">
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm group">
                            <img src={displayPhotos[currentImage]} alt="Main" className="w-full h-full object-cover" />
                            {displayPhotos.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                                        {currentImage + 1} / {displayPhotos.length}
                                    </div>
                                </>
                            )}
                        </div>
                        {displayPhotos.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {displayPhotos.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${currentImage === idx ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={src} className="w-full h-full object-cover" alt="Thumb" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Header Info */}
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h1 className="text-3xl font-bold text-text-primary mb-1">{listing.pet.name}</h1>
                                <div className="flex items-center gap-3 text-text-secondary text-sm">
                                    <span className="font-semibold">{listing.pet.breed}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {listing.location_city}, {listing.location_state}</span>
                                </div>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-bold text-text-secondary flex items-center gap-1.5 justify-end"><Calendar size={12} /> Posted {new Date(listing.published_at || listing.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Age', value: listing.pet.age_display || 'Unknown' },
                            { label: 'Gender', value: listing.pet.gender },
                            { label: 'Urgency', value: listing.urgency.replace('_', ' ') },
                        ].map(stat => (
                            <div key={stat.label} className="bg-bg-secondary p-3 rounded-xl border border-border">
                                <p className="text-[10px] uppercase font-bold text-brand-primary tracking-wider mb-0.5">{stat.label}</p>
                                <p className="font-bold text-text-primary capitalize text-sm">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* About */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-text-primary">About {listing.pet.name}</h2>
                        <p className="text-text-secondary text-base leading-relaxed whitespace-pre-wrap">{listing.reason}</p>
                    </div>

                    {/* Adoption Terms */}
                    <Card className="p-6 bg-status-success/10 border-status-success/20">
                        <h3 className="text-lg font-bold text-status-success mb-4">Ideal Home</h3>
                        <p className="text-text-secondary text-sm whitespace-pre-wrap">{listing.ideal_home_notes}</p>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Action Card */}
                    <div className="bg-bg-surface p-5 rounded-2xl shadow-xl border border-border sticky top-24">
                        <div className="flex justify-between items-center mb-5">
                            <span className="text-xs font-bold text-text-tertiary">Rehoming Fee may apply</span>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full hover:bg-status-error/10 hover:text-status-error transition-colors border border-border">
                                    <Heart size={18} />
                                </button>
                                <button className="p-2 rounded-full hover:bg-bg-secondary transition-colors border border-border">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* WhatsApp Contact Logic */}
                        {listing.owner?.phone_number ? (
                            <button
                                onClick={() => {
                                    const message = encodeURIComponent(`Hi ${listing.owner.first_name}, I'm interested in adopting ${listing.pet.name}!`);
                                    window.open(`https://wa.me/${listing.owner.phone_number}?text=${message}`, '_blank');
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3.5 mb-3 bg-[#25D366] text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <MessageCircle size={20} />
                                Contact on WhatsApp
                            </button>
                        ) : (
                            <div className="w-full py-3.5 mb-3 bg-bg-secondary text-text-tertiary rounded-xl font-bold text-base text-center cursor-not-allowed">
                                Contact Info Not Available
                            </div>
                        )}

                        <p className="text-center text-[10px] text-text-tertiary mb-5">Start a conversation with the owner</p>

                        <div className="pt-5 border-t border-border">
                            <h4 className="font-bold text-xs text-text-secondary mb-3 uppercase tracking-wider">Listed by</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-lg">
                                    {listing.owner?.first_name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-text-primary text-sm">{listing.owner?.first_name} {listing.owner?.last_name}</p>
                                    <p className="text-[10px] text-text-secondary flex items-center gap-1">
                                        Verified User
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-bg-secondary p-5 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-3 text-text-primary">
                            <Shield size={18} />
                            <h4 className="font-bold text-sm">Safety Tips</h4>
                        </div>
                        <ul className="space-y-2 text-xs text-text-secondary">
                            <li className="flex gap-2"><div className="w-1 m-1.5 rounded-full bg-text-tertiary"></div> Meet in public places</li>
                            <li className="flex gap-2"><div className="w-1 m-1.5 rounded-full bg-text-tertiary"></div> Bring a friend along</li>
                            <li className="flex gap-2"><div className="w-1 m-1.5 rounded-full bg-text-tertiary"></div> Never send money beforehand</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RehomingListingDetailPage;
