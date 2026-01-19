import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Check, Phone, Clock, Shield, Calendar, Heart, Share2, Loader } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import useServices from '../../hooks/useServices';
import BookingModal from '../../components/Services/BookingModal';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const { useGetProvider } = useServices();
    const { data: provider, isLoading } = useGetProvider(id);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

    const handleOpenBooking = (service = null) => {
        setSelectedServiceForBooking(service);
        setIsBookingModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <Loader className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <h2 className="text-xl font-bold">Provider not found</h2>
            </div>
        );
    }

    // Determine type based on category slug or name
    const isVet = provider.category?.slug === 'veterinary' || provider.category?.name?.toLowerCase().includes('vet');
    const serviceType = provider.category?.name || 'Service Provider';

    // Helper to get image
    const heroImage = provider.media?.find(m => m.is_primary)?.file_url || provider.media?.[0]?.file_url || 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=1200';

    // Helper for address
    const fullAddress = `${provider.address_line1}, ${provider.city}, ${provider.state}`;

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-12">
            {/* Hero Image */}
            <div className="h-64 md:h-96 w-full relative">
                <img src={heroImage} alt={provider.business_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div className="text-white">
                            <Badge variant="info" className="mb-2 bg-blue-500/20 text-blue-100 backdrop-blur-md border-blue-400/30">{serviceType}</Badge>
                            <h1 className="text-3xl md:text-5xl font-bold font-merriweather mb-2">{provider.business_name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                                <span className="flex items-center gap-1 text-yellow-400 font-bold"><Star fill="currentColor" size={18} /> {provider.avg_rating || 'New'} ({provider.reviews_count} reviews)</span>
                                <span className="flex items-center gap-1 opacity-90"><MapPin size={18} /> {fullAddress}</span>
                                {provider.is_verified && <span className="flex items-center gap-1 text-green-300"><Shield size={18} /> Verified Provider</span>}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"><Share2 size={20} /></Button>
                            <Button variant="ghost" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"><Heart size={20} /></Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">About</h2>
                        <p className="text-text-secondary leading-relaxed whitespace-pre-line">{provider.description}</p>
                    </section>

                    {/* Services / Vet Specific */}
                    {isVet && provider.vet_details ? (
                        <>
                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Services & Pricing</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {provider.vet_details.services_offered?.map((svc, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 bg-white border border-border rounded-xl">
                                            <span className="font-medium text-text-primary">{svc.name}</span>
                                            <span className="text-brand-primary font-bold">{svc.base_price ? `$${svc.base_price}+` : 'Call for price'}</span>
                                        </div>
                                    ))}
                                </div>
                                {provider.vet_details.pricing_info && (
                                    <p className="mt-4 text-sm text-text-secondary">{provider.vet_details.pricing_info}</p>
                                )}
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Hours</h2>
                                <div className="bg-white border border-border rounded-xl overflow-hidden">
                                    {provider.hours?.map((h, idx) => (
                                        <div key={idx} className="flex justify-between p-4 border-b border-border last:border-0 hover:bg-gray-50">
                                            <span className="font-medium text-text-secondary">{h.day_display}</span>
                                            <span className="font-bold text-text-primary">
                                                {h.is_closed ? 'Closed' : `${h.open_time} - ${h.close_time}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Amenities</h2>
                                <div className="flex flex-wrap gap-3">
                                    {provider.vet_details.amenities?.map((item, idx) => (
                                        <div key={idx} className="px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
                                            <Check size={16} /> {item}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : provider.foster_details ? (
                        /* Foster Specific */
                        <>
                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Environment</h2>
                                <Card className="p-6">
                                    <pre className="text-sm font-sans whitespace-pre-wrap text-text-secondary">
                                        {JSON.stringify(provider.foster_details.environment_details, null, 2)}
                                    </pre>
                                </Card>
                            </section>
                        </>
                    ) : null}

                    {/* Review Teaser */}
                    <div className="pt-8 border-t border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-text-primary font-merriweather">Reviews</h2>
                            <Link to={`/services/${id}/review`}>
                                <Button variant="outline">Write a Review</Button>
                            </Link>
                        </div>
                        {/* Show latest review if exists */}
                        {provider.reviews && provider.reviews.length > 0 ? (
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                        <div>
                                            <p className="font-bold text-text-primary">{provider.reviews[0].reviewer?.first_name || 'User'}</p>
                                            <p className="text-xs text-text-secondary">Verified Client</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        <Star size={16} fill="currentColor" /> <span className="ml-1 text-sm font-bold">{provider.reviews[0].rating}</span>
                                    </div>
                                </div>
                                <p className="text-text-secondary text-sm">
                                    "{provider.reviews[0].comment}"
                                </p>
                            </Card>
                        ) : (
                            <p className="text-text-secondary italic">No reviews yet.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 sticky top-24">
                        {isVet ? (
                            <>
                                <h3 className="font-bold text-lg mb-2">Contact Clinic</h3>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-4 w-fit">
                                    <Clock size={16} />
                                    <span className="text-sm font-bold">Open Now</span>
                                </div>
                                <div className="space-y-4">
                                    <Button variant="primary" className="w-full justify-center" onClick={() => window.open(`tel:${provider.phone}`)}>
                                        <Phone size={18} className="mr-2" /> {provider.phone}
                                    </Button>
                                    <Button variant="outline" className="w-full justify-center" onClick={() => handleOpenBooking()}>Request Appointment</Button>
                                    <Button variant="ghost" className="w-full justify-center text-text-secondary">Get Directions</Button>
                                </div>
                            </>
                        ) : provider.foster_details ? (
                            <>
                                <div className="flex justify-between items-end mb-4 pb-4 border-b border-border">
                                    <div>
                                        <h3 className="font-bold text-lg">Daily Rate</h3>
                                        <p className="text-xs text-text-secondary">Includes basic care & walks</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-brand-primary">${provider.foster_details.daily_rate}</span>
                                        <span className="text-text-secondary text-sm">/day</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl flex items-start gap-2 text-sm">
                                        <Calendar size={18} className="shrink-0 mt-0.5" />
                                        <span><strong>{provider.foster_details.current_availability}</strong> availability.</span>
                                    </div>
                                    <Button variant="primary" className="w-full justify-center" onClick={() => handleOpenBooking()}>Contact Provider</Button>
                                </div>
                            </>
                        ) : null}
                    </Card>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                provider={provider}
                initialService={selectedServiceForBooking}
            />
        </div>
    );
};

export default ServiceDetailPage;
