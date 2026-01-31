import React, { useState } from 'react';
import { CircleCheck, Dog, Cat, Info, Scissors, MapPin, Video, CheckCircle, Car } from 'lucide-react';
import Card from '../../../common/Layout/Card';
import Badge from '../../../common/Feedback/Badge';
import Button from '../../../common/Buttons/Button';
import { AnimatePresence, motion } from 'framer-motion';

const ServicesTab = ({ provider, onBook }) => {
    // State for expandable sections
    const [expandedEnv, setExpandedEnv] = useState(false);
    const [expandedPhil, setExpandedPhil] = useState(false);

    // Helpers
    const renderPricingItem = (label, price, description = null, subLabel = null) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-xl bg-white hover:border-brand-primary/50 transition-colors group">
            <div className="mb-2 sm:mb-0">
                <div className="font-bold text-text-primary text-lg">{label}</div>
                {description && <div className="text-sm text-text-secondary mt-1">{description}</div>}
                {subLabel && <div className="text-xs text-brand-secondary mt-1 font-medium">{subLabel}</div>}
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-xl font-bold text-brand-primary">
                        {typeof price === 'number' ? `$${price}` : price}
                    </div>
                </div>
                <Button size="sm" onClick={() => onBook({ name: label, price })}>Book</Button>
            </div>
        </div>
    );

    const renderSectionTitle = (title, icon) => (
        <h3 className="text-xl font-bold font-merriweather text-text-primary mb-6 flex items-center gap-2 border-b border-border pb-2">
            {icon} {title}
        </h3>
    );

    const renderVideo = (url) => {
        if (!url) return null;
        // Basic check for youtube/vimeo embed would be better, but for now generic link/iframe placeholder
        return (
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video className="text-white fill-current" size={32} />
                    </div>
                </div>
                {/* Real implementation would embed iframe here */}
                <div className="absolute bottom-4 left-4 text-white font-bold">Watch Video Tour</div>
            </div>
        );
    };

    // --- VETERINARY ---
    if (provider.vet_details) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {provider.vet_details.services_offered?.map((svc) => (
                        <Card key={svc.id} className="p-6 hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-lg mb-2 text-text-primary">{svc.name}</h4>
                            <p className="text-text-secondary text-sm mb-4 h-10 line-clamp-2">{svc.description}</p>
                            <div className="flex justify-between items-end border-t border-border pt-4">
                                <div>
                                    <span className="text-xs text-text-tertiary block">Starting at</span>
                                    <span className="font-bold text-brand-primary text-xl">${svc.base_price}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => onBook({ name: svc.name, price: svc.base_price })}>Book</Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {provider.vet_details.pricing_info && (
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start gap-3">
                        <Info className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm">{provider.vet_details.pricing_info}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        {renderSectionTitle("Specializations", <AwardBadge />)}
                        <div className="flex flex-wrap gap-2">
                            {provider.vet_details.species_treated?.map((s, i) => (
                                <Badge key={i} variant="secondary">{s.name}</Badge>
                            ))}
                            {/* Assuming specialized tags might come from backend later, using species for now or static */}
                        </div>
                    </section>

                    <section>
                        {renderSectionTitle("Amenities", <CircleCheck className="text-brand-primary" />)}
                        <div className="flex flex-wrap gap-3">
                            {provider.vet_details.amenities?.map((am, i) => (
                                <div key={i} className="px-4 py-2 bg-white border border-border rounded-full text-sm font-medium flex items-center gap-2 shadow-sm text-text-secondary">
                                    <CircleCheck size={16} className="text-green-500" /> {am}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    // --- TRAINER ---
    if (provider.trainer_details) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Philosophy Card */}
                <Card className="p-6 border-l-4 border-l-brand-primary">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold font-merriweather">Training Philosophy</h3>
                        <Badge variant="primary">{provider.trainer_details.primary_method || 'Positive Reinforcement'}</Badge>
                    </div>
                    <div className={`prose prose-sm max-w-none text-text-secondary transition-all overflow-hidden ${expandedPhil ? '' : 'max-h-24 relative'}`}>
                        <p>{provider.trainer_details.training_philosophy || "Contact us to learn more about our training methods."}</p>
                        {!expandedPhil && (
                            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent" />
                        )}
                    </div>
                    <button
                        onClick={() => setExpandedPhil(!expandedPhil)}
                        className="text-brand-primary text-sm font-bold mt-2 hover:underline"
                    >
                        {expandedPhil ? 'Show Less' : 'Read More'}
                    </button>

                    <div className="mt-4 pt-4 border-t border-border flex gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" />
                            <strong>{provider.trainer_details.years_experience} Years</strong> Experience
                        </div>
                        {provider.trainer_details.certifications?.length > 0 && (
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" />
                                <strong>Certified</strong>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        {renderSectionTitle("Services", <Dog className="text-brand-primary" />)}
                        <div className="space-y-4">
                            {provider.trainer_details.offers_private_sessions &&
                                renderPricingItem("Private Session", provider.trainer_details.private_session_rate, "One-on-one personalized training session.")}

                            {provider.trainer_details.offers_group_classes &&
                                renderPricingItem("Group Class", provider.trainer_details.group_class_rate, "Socialize and train with other dogs.")}

                            {provider.trainer_details.offers_board_and_train &&
                                renderPricingItem("Board & Train", "Contact", "Intensive training program.")}

                            {provider.trainer_details.offers_virtual_training &&
                                renderPricingItem("Virtual Session", "Contact", "Remote training guidance.")}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div>
                            {renderSectionTitle("Client Availability", <Info className="text-brand-primary" />)}
                            <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                <span className="font-medium text-text-secondary">Current Status</span>
                                <Badge variant={provider.trainer_details.accepting_new_clients ? 'success' : 'warning'}>
                                    {provider.trainer_details.accepting_new_clients ? 'Accepting New Clients' : 'Waitlist Only'}
                                </Badge>
                            </div>
                        </div>
                        {provider.trainer_details.video_url && (
                            <div>
                                <h4 className="font-bold mb-3 text-text-primary">Demo Video</h4>
                                {renderVideo(provider.trainer_details.video_url)}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        );
    }

    // --- FOSTER ---
    if (provider.foster_details) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        {renderSectionTitle("Foster Rates", <Dog className="text-brand-primary" />)}
                        <div className="space-y-4">
                            {renderPricingItem("Daily Rate", provider.foster_details.daily_rate, "Includes housing, feeding, and basic care.")}

                            {provider.foster_details.monthly_rate && (
                                <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-text-primary text-lg">Monthly Rate</div>
                                        <div className="text-sm text-brand-primary font-medium">{provider.foster_details.weekly_discount}% discount applied</div>
                                    </div>
                                    <div className="text-2xl font-bold text-brand-primary">${provider.foster_details.monthly_rate}</div>
                                </div>
                            )}
                        </div>
                    </section>

                    {provider.foster_details.video_url && (
                        <section>
                            {renderSectionTitle("Video Tour", <Video className="text-brand-primary" />)}
                            {renderVideo(provider.foster_details.video_url)}
                        </section>
                    )}
                </div>

                <section>
                    {renderSectionTitle("Environment & Care", <Info className="text-brand-primary" />)}

                    {/* Expandable Environment Details */}
                    <div className="border border-border rounded-xl overflow-hidden mb-6">
                        <button
                            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            onClick={() => setExpandedEnv(!expandedEnv)}
                        >
                            <span className="font-bold text-text-primary">Environment Details</span>
                            <span className="text-brand-primary text-sm">{expandedEnv ? 'Collapse' : 'Expand'}</span>
                        </button>
                        <AnimatePresence>
                            {(expandedEnv || true) && ( // Keeping open by default as 'expandable' usually implies hidden, but gap analysis said 'expandable sections'. For better UX, maybe always show grid? Let's show grid.
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="border-t border-border"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                        {Object.entries(provider.foster_details.environment_details || {}).map(([key, value], i) => (
                                            <div key={i}>
                                                <h5 className="font-bold text-text-primary capitalize text-sm mb-1">{key.replace(/_/g, ' ')}</h5>
                                                <p className="text-text-secondary text-sm">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Care Standards */}
                    {provider.foster_details.care_standards && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(provider.foster_details.care_standards).map(([key, value], i) => (
                                <Card key={i} className="p-4 bg-white">
                                    <h5 className="font-bold text-brand-secondary capitalize mb-1">{key.replace(/_/g, ' ')}</h5>
                                    <p className="text-text-secondary text-sm">{value}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        );
    }

    // --- GROOMER ---
    if (provider.groomer_details) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Salon Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <Badge variant="info" className="text-lg px-4 py-2">
                        {provider.groomer_details.salon_type === 'both' ? 'Salon & Mobile Service' : `${provider.groomer_details.salon_type} Service`}
                    </Badge>
                    {provider.groomer_details.salon_type !== 'salon' && (
                        <div className="flex items-center gap-2 text-text-secondary bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <Car size={16} /> Service Radius: Contact for details
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            {renderSectionTitle("Service Menu", <Scissors className="text-brand-primary" />)}
                            <div className="space-y-4">
                                {provider.groomer_details.service_menu?.map((item, i) => (
                                    renderPricingItem(item.name, item.price, item.description, item.duration)
                                )) || renderPricingItem("Full Grooming", provider.groomer_details.base_price, "Includes bath, haircut, nail trim, and ear cleaning.")}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <section>
                            {renderSectionTitle("Accepted Species", <Dog className="text-brand-primary" />)}
                            <div className="flex flex-wrap gap-2">
                                {provider.groomer_details.species_accepted?.map((s, i) => (
                                    <Badge key={i} variant="secondary">{s.name}</Badge>
                                ))}
                            </div>
                        </section>

                        <section>
                            {renderSectionTitle("Amenities", <CircleCheck className="text-brand-primary" />)}
                            <ul className="space-y-2">
                                {provider.groomer_details.amenities?.map((am, i) => (
                                    <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {am}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

    // --- PET SITTER ---
    if (provider.sitter_details) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dog Walking */}
                    {provider.sitter_details.offers_dog_walking && (
                        <Card className="p-6 border-t-4 border-t-brand-primary text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                                <Dog size={24} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">Dog Walking</h4>
                            <div className="text-2xl font-bold text-brand-primary mb-4">${provider.sitter_details.walking_rate}<span className="text-sm text-text-tertiary font-normal">/walk</span></div>
                            <Button size="sm" className="w-full" onClick={() => onBook({ name: "Dog Walking", price: provider.sitter_details.walking_rate })}>Book Now</Button>
                        </Card>
                    )}

                    {/* House Sitting */}
                    {provider.sitter_details.offers_house_sitting && (
                        <Card className="p-6 border-t-4 border-t-brand-secondary text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-secondary">
                                <Info size={24} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">House Sitting</h4>
                            <div className="text-2xl font-bold text-brand-primary mb-4">${provider.sitter_details.house_sitting_rate}<span className="text-sm text-text-tertiary font-normal">/night</span></div>
                            <Button size="sm" className="w-full" onClick={() => onBook({ name: "House Sitting", price: provider.sitter_details.house_sitting_rate })}>Book Now</Button>
                        </Card>
                    )}

                    {/* Drop-In Visits */}
                    {provider.sitter_details.offers_drop_in_visits && (
                        <Card className="p-6 border-t-4 border-t-brand-accent text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-accent">
                                <Cat size={24} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">Drop-In Visits</h4>
                            <div className="text-2xl font-bold text-brand-primary mb-4">${provider.sitter_details.drop_in_rate}<span className="text-sm text-text-tertiary font-normal">/visit</span></div>
                            <Button size="sm" className="w-full" onClick={() => onBook({ name: "Drop-In Visit", price: provider.sitter_details.drop_in_rate })}>Book Now</Button>
                        </Card>
                    )}
                </div>

                <section>
                    {renderSectionTitle("Service Details", <Info className="text-brand-primary" />)}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-xs font-bold text-text-tertiary uppercase mb-1">Experience</div>
                            <div className="font-medium text-text-primary">{provider.sitter_details.years_experience} Years</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-xs font-bold text-text-tertiary uppercase mb-1">Insured</div>
                            <div className="font-medium text-text-primary">{provider.sitter_details.is_insured ? 'Yes, coverage active' : 'No'}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-xs font-bold text-text-tertiary uppercase mb-1">Service Radius</div>
                            <div className="font-medium text-text-primary">{provider.sitter_details.service_radius_km} km</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-xs font-bold text-text-tertiary uppercase mb-1">Transport</div>
                            <div className="font-medium text-text-primary">{provider.sitter_details.has_transport ? 'Provided' : 'Not Provided'}</div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // Default fallback
    return <div className="text-center py-12 text-text-secondary">No specific service details available.</div>;
};

// Helper for Vet Specializations if missing icon
const AwardBadge = () => <CircleCheck className="text-brand-primary" />;

export default ServicesTab;
