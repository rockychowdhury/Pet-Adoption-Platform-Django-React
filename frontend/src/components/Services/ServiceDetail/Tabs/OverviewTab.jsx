import React from 'react';
import { MapPin, Phone, Mail, Globe, Clock, ArrowRight, Star, CheckCircle, Info } from 'lucide-react';
import Card from '../../../common/Layout/Card';
import Badge from '../../../common/Feedback/Badge';
import Button from '../../../common/Buttons/Button';

const OverviewTab = ({ provider, onViewMap, onReadReviews }) => {

    // Dynamic Key Info Logic
    const renderKeyInfo = () => {
        if (!provider) return null;

        const isFoster = !!provider.foster_details;
        const isTrainer = !!provider.trainer_details;
        const isVet = !!provider.vet_details;
        const isGroomer = !!provider.groomer_details;
        const isSitter = !!provider.sitter_details;

        const items = [];

        // 1. Capacity / Type / Experience
        if (isFoster) items.push({ label: 'Capacity', value: `${provider.foster_details.current_count} / ${provider.foster_details.capacity} animals`, icon: 'users' });
        if (isTrainer) items.push({ label: 'Experience', value: `${provider.trainer_details.years_experience} Years`, icon: 'award' });
        if (isVet) items.push({ label: 'Clinic Type', value: provider.vet_details.clinic_type, icon: 'building' });
        if (isGroomer) items.push({ label: 'Salon Type', value: provider.groomer_details.salon_type, icon: 'scissors' });
        if (isSitter) items.push({ label: 'Experience', value: `${provider.sitter_details.years_experience} Years`, icon: 'award' });

        // 2. Species / Focus
        const species = (provider.foster_details?.species_accepted || provider.trainer_details?.species_trained || provider.vet_details?.species_treated || provider.groomer_details?.species_accepted || provider.sitter_details?.species_accepted || []).slice(0, 3).map(s => s.name).join(', ');
        if (species) items.push({ label: 'Species Accepted', value: species, icon: 'paw' });

        // 3. Environment / Specialties
        if (isFoster) items.push({ label: 'Environment', value: provider.foster_details?.environment_details?.type || 'Home Environment', icon: 'home' });
        if (isTrainer && provider.trainer_details?.specializations?.[0]) items.push({ label: 'Specialty', value: provider.trainer_details.specializations[0].name, icon: 'star' });
        if (isSitter) items.push({ label: 'Transport', value: provider.sitter_details.has_transport ? 'Provided' : 'Not Provided', icon: 'car' });

        // 4. Rate
        if (isFoster) items.push({ label: 'Daily Rate', value: `$${provider.foster_details.daily_rate} / night`, icon: 'dollar' });
        if (isTrainer) items.push({ label: 'Session Rate', value: `$${provider.trainer_details.private_session_rate} / hr`, icon: 'dollar' });
        if (isGroomer) items.push({ label: 'Starting Rate', value: `$${provider.groomer_details.base_price}`, icon: 'dollar' });
        if (isSitter) items.push({ label: 'Walk Rate', value: `$${provider.sitter_details.walking_rate} / walk`, icon: 'dollar' });

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 flex flex-col gap-3 h-full">
                        <div className="flex items-center gap-2 text-gray-500">
                            {/* You can map specific icons here if needed, keeping simple for now */}
                            <Info size={16} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <div className="font-bold text-gray-900 text-base">
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- MAIN COLUMN --- */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Key Info */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 font-sans">Key Information</h3>
                        {renderKeyInfo()}
                    </section>

                    {/* About */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 font-sans">About {provider.business_name}</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {provider.description}
                        </p>
                        <button className="text-brand-primary font-bold mt-2 hover:underline text-sm">Read more</button>

                        {/* Fix 6: Separator Line */}
                        <hr className="border-gray-100 mt-8" />
                    </section>

                    {/* Featured Reviews */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 font-sans">Featured Reviews</h3>
                            <button onClick={onReadReviews} className="text-brand-primary font-medium hover:underline text-sm">
                                See all {provider.reviews_count} reviews
                            </button>
                        </div>

                        <div className="space-y-6">
                            {provider.reviews?.slice(0, 2).map((review) => ( // Show top 2 reviews
                                <Card key={review.id} className="p-6 border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                                            {review.reviewer?.first_name?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{review.reviewer?.first_name}</div>
                                            <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div className="ml-auto flex text-yellow-400 gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                    {review.verified_client && (
                                        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-green-700 bg-green-50 w-fit px-2 py-1 rounded">
                                            <CheckCircle size={12} /> Verified Client
                                        </div>
                                    )}
                                </Card>
                            ))}
                            {(!provider.reviews || provider.reviews.length === 0) && (
                                <p className="text-gray-500 italic">No reviews yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* --- SIDEBAR --- */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Location & Contact Card */}
                    <Card className="p-0 border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Location & Contact</h3>
                        </div>

                        {/* Map Snippet */}
                        <div className="h-40 bg-gray-100 relative group cursor-pointer" onClick={onViewMap}>
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <MapPin size={32} />
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full px-4 py-2 font-bold text-sm text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                View on Map
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-gray-400 shrink-0 mt-1" size={18} />
                                <div>
                                    <div className="font-medium text-gray-900">{provider.address_line1}</div>
                                    <div className="text-sm text-gray-500">{provider.city}, {provider.state} {provider.zip_code}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="text-gray-400 shrink-0" size={18} />
                                <a href={`tel:${provider.phone}`} className="text-brand-primary hover:underline font-medium">
                                    {provider.phone}
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="text-gray-400 shrink-0" size={18} />
                                <a href={`mailto:${provider.email}`} className="text-brand-primary hover:underline font-medium truncate">
                                    {provider.email}
                                </a>
                            </div>
                        </div>
                    </Card>

                    {/* Business Hours Card */}
                    <Card className="p-0 border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Business Hours</h3>
                            <Badge variant="success" className="text-xs px-2 py-0.5">Open Now</Badge>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3 text-sm">
                                {provider.hours?.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="text-gray-500 w-24">{h.day_display}</span>
                                        <span className={`font-medium ${h.is_closed ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                                            {h.is_closed ? 'Closed' : `${h.open_time?.slice(0, 5)} - ${h.close_time?.slice(0, 5)}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
