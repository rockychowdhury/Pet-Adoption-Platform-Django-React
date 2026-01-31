import React from 'react';
import { Star, MapPin, Shield, Share2, Heart, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../common/Feedback/Badge';
import Button from '../../common/Buttons/Button';

const ServiceHero = ({ provider, onBook, onContact, onShare, onFavorite, isFavorite, onOpenGallery }) => {
    const navigate = useNavigate();

    // Helper to get image
    const heroImage = provider.media?.find(m => m.is_primary)?.file_url || provider.media?.[0]?.file_url || 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=1200';

    // Determine type based on category
    const serviceType = provider.category?.name || 'Service Provider';
    const displayAddress = `${provider.city}, ${provider.state}`;

    // Calculate starting price string
    let priceString = "";
    if (provider.foster_details?.daily_rate) priceString = `From $${provider.foster_details.daily_rate}/night`;
    else if (provider.trainer_details?.private_session_rate) priceString = `From $${provider.trainer_details.private_session_rate}/hr`;
    else if (provider.groomer_details?.base_price) priceString = `From $${provider.groomer_details.base_price}`;
    else if (provider.sitter_details?.walking_rate) priceString = `From $${provider.sitter_details.walking_rate}/walk`;
    else if (provider.vet_details) priceString = "Contact for pricing";

    return (
        <div className="w-full bg-white pb-6">
            {/* Hero Image Section */}
            <div className="relative h-64 md:h-[400px] w-full group cursor-pointer" onClick={onOpenGallery}>
                <img
                    src={heroImage}
                    alt={provider.business_name}
                    className="w-full h-full object-cover"
                />

                {/* Overlay Container for Actions - Aligned with Content */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-full relative">
                        {/* Back Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                            className="absolute top-6 left-4 md:left-8 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all hover:scale-105 pointer-events-auto text-gray-700"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        {/* View Photos Button */}
                        <div className="absolute bottom-6 right-4 md:right-8 pointer-events-auto">
                            <button
                                className="bg-black/60 hover:bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
                                onClick={(e) => { e.stopPropagation(); onOpenGallery(); }}
                            >
                                <span className="hidden sm:inline">View</span> {provider.media?.length || 1} photos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title & Actions Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    {/* Left: Provider Info */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-sans">
                                {provider.business_name}
                            </h1>
                            {provider.is_verified && (
                                <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                    <Shield size={12} fill="currentColor" /> Verified
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                {/* Icon based on category could go here, generic for now */}
                                <span className="text-gray-500 font-medium">{serviceType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star fill="#FACC15" className="text-yellow-400" size={16} />
                                <span className="font-bold text-gray-900">{provider.avg_rating || 'New'}</span>
                                <span className="text-gray-500">({provider.reviews_count} reviews)</span>
                            </div>
                            {priceString && (
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-900 font-medium">{priceString}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto self-start md:self-center">
                        <button
                            onClick={onFavorite}
                            className={`p-2.5 rounded-lg border transition-all ${isFavorite ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        >
                            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                        </button>

                        <button
                            onClick={onShare}
                            className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
                            title="Share"
                        >
                            <Share2 size={20} />
                        </button>

                        <Button
                            variant="outline"
                            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 gap-2"
                            onClick={() => {
                                // Direct WhatsApp if phone available, else open Contact Modal
                                if (provider.phone) {
                                    const phone = provider.phone.replace(/\D/g, '');
                                    window.open(`https://wa.me/${phone}`, '_blank');
                                } else {
                                    onContact();
                                }
                            }}
                        >
                            <MessageCircle size={18} />
                            WhatsApp
                        </Button>

                        <Button
                            className="bg-teal-700 hover:bg-teal-800 text-white shadow-none border-none px-6"
                            onClick={onBook}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceHero;
