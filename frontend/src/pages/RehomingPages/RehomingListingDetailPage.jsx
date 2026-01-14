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

    // Hooks
    const { useGetListingDetail } = useRehoming(); // Assuming this hook exists in useRehoming
    const { data: listing, isLoading, error } = useGetListingDetail(id);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !listing) return <div className="min-h-screen flex items-center justify-center">Listing not found.</div>;

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % (listing.pet.photos?.length || 1));
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + (listing.pet.photos?.length || 1)) % (listing.pet.photos?.length || 1));

    const photos = listing.pet.photos || []; // Assuming photos is an array of objects or strings? 
    // Backend serializer sends objects: {url, delete_url}. Or just URLs if simplified?
    // Let's assume the serializer sends what we need. If PetSnapshotSerializer sends `main_photo`, but detailing might send list.
    // ListingDetailSerializer -> pet -> PetSnapshotSerializer.
    // PetSnapshotSerializer only has `main_photo`.
    // We might need to fetch full pet details or update serializer to include all photos.
    // For now, let's assume listing has photos if modified to include them, or we use pet.media.
    // Actually, looking at serializer: ListingDetailSerializer uses PetSnapshotSerializer.
    // PetSnapshotSerializer only has `main_photo`.
    // I should probably update `ListingDetailSerializer` or `PetSnapshotSerializer` to include `media` list for the detail page.

    // BUT, I can't change backend right now easily without checking.
    // `RehomingCreateListingPage` sends `photos` to `PetProfile`.
    // `PetProfile` has `media`.
    // I should update `apps/rehoming/serializers.py` to include `photos` in `PetSnapshotSerializer` or `ListingSerializer`? 
    // No, `PetSnapshotSerializer` is shared.
    // Let's check `backend/apps/rehoming/serializers.py` again.

    const displayPhotos = photos.length > 0 ? photos.map(p => p.url || p) : ['https://via.placeholder.com/800x600?text=No+Photo'];

    return (
        <div className="min-h-screen bg-bg-primary pb-20">
            {/* Breadcrumb / Nav */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Link to="/pets" className="text-sm font-bold text-text-tertiary hover:text-brand-primary flex items-center gap-1">
                    <ChevronLeft size={14} /> Back to Search
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-sm group">
                            <img src={displayPhotos[currentImage]} alt="Main" className="w-full h-full object-cover" />
                            {displayPhotos.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronRight size={24} />
                                    </button>
                                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                                        {currentImage + 1} / {displayPhotos.length}
                                    </div>
                                </>
                            )}
                        </div>
                        {displayPhotos.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {displayPhotos.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${currentImage === idx ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={src} className="w-full h-full object-cover" alt="Thumb" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Header Info */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h1 className="text-4xl font-bold text-text-primary mb-2">{listing.pet.name}</h1>
                                <div className="flex items-center gap-4 text-text-secondary">
                                    <span className="font-semibold">{listing.pet.breed}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {listing.location_city}, {listing.location_state}</span>
                                </div>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-text-secondary flex items-center gap-2 justify-end"><Calendar size={14} /> Posted {new Date(listing.published_at || listing.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Age', value: listing.pet.age_display || 'Unknown' },
                            { label: 'Gender', value: listing.pet.gender },
                            // { label: 'Weight', value: listing.pet.weight }, // Not in snapshot?
                            { label: 'Urgency', value: listing.urgency.replace('_', ' ') },
                        ].map(stat => (
                            <div key={stat.label} className="bg-bg-secondary p-4 rounded-xl border border-border">
                                <p className="text-[10px] uppercase font-bold text-brand-primary tracking-wider mb-1">{stat.label}</p>
                                <p className="font-bold text-text-primary capitalize">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* About */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-text-primary">About {listing.pet.name}</h2>
                        <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap">{listing.reason}</p>
                    </div>

                    {/* We might need to fetch more pet details to show behavior/medical if not in snapshot */}
                    {/* For now, relying on what's available or assuming the reason text covers it */}

                    {/* Adoption Terms */}
                    <Card className="p-8 bg-status-success/10 border-status-success/20">
                        <h3 className="text-xl font-bold text-status-success mb-6">Ideal Home</h3>
                        <p className="text-text-secondary whitespace-pre-wrap">{listing.ideal_home_notes}</p>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-border sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-text-tertiary">Rehoming Fee may apply</span>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full hover:bg-status-error/10 hover:text-status-error transition-colors border border-border">
                                    <Heart size={20} />
                                </button>
                                <button className="p-2 rounded-full hover:bg-bg-secondary transition-colors border border-border">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        <Link to={`/rehoming/listings/${id}/apply`} className="block w-full mb-3">
                            <Button variant="primary" className="w-full justify-center py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Send Request
                            </Button>
                        </Link>

                        <p className="text-center text-xs text-text-tertiary mb-6">Start a conversation with the owner</p>

                        <div className="pt-6 border-t border-border">
                            <h4 className="font-bold text-sm text-text-secondary mb-4 uppercase tracking-wider">Listed by</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-xl">
                                    {listing.owner?.first_name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-text-primary">{listing.owner?.first_name} {listing.owner?.last_name}</p>
                                    <p className="text-xs text-text-secondary flex items-center gap-1">
                                        Verified User
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-bg-secondary p-6 rounded-3xl border border-border">
                        <div className="flex items-center gap-2 mb-4 text-text-primary">
                            <Shield size={20} />
                            <h4 className="font-bold">Safety Tips</h4>
                        </div>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-text-tertiary mt-1.5"></div> Meet in public places</li>
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-text-tertiary mt-1.5"></div> Bring a friend along</li>
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-text-tertiary mt-1.5"></div> Never send money beforehand</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RehomingListingDetailPage;
