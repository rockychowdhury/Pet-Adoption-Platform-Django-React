import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Star, MapPin, Check, Phone, Clock, Shield, Calendar, Heart, Share2 } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';

const ServiceDetailPage = () => {
    const { id, type } = useParams(); // type will be 'vet' or 'foster' based on route
    const location = useLocation();

    // Determine type from URL if not in params explicitly (for cleaner implementation if needed)
    const isVet = location.pathname.includes('/vet/') || type === 'vet';
    const serviceType = isVet ? 'Veterinary Clinic' : 'Foster Care Provider';

    // Mock Data
    const provider = isVet ? {
        id: 1,
        name: 'City Paws Veterinary',
        image: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=1200',
        rating: 4.8,
        reviewCount: 128,
        address: '123 Main St, New York, NY 10001',
        description: "We are a full-service animal hospital providing comprehensive healthcare services to pets in New York City. Our veterinarians offer a wide variety of medical, surgical and dental services in our veterinary clinic.",
        verified: true,
        hours: [
            { day: 'Monday - Friday', time: '8:00 AM - 6:00 PM' },
            { day: 'Saturday', time: '9:00 AM - 4:00 PM' },
            { day: 'Sunday', time: 'Closed' }
        ],
        services: [
            { name: 'Wellness Exams', price: '$65+' },
            { name: 'Vaccinations', price: '$25+' },
            { name: 'Dental Care', price: 'Free Consult' },
            { name: 'Emergency Surgery', price: 'Call for quote' }
        ],
        amenities: ['On-site Pharmacy', 'Parking', 'Wheelchair Accessible', 'Separate Cat Waiting Area'],
        phone: '(555) 123-4567'
    } : {
        id: 1,
        name: 'Happy Tails Foster Home',
        image: 'https://images.unsplash.com/photo-1560709476-857e492b4f53?auto=format&fit=crop&q=80&w=1200',
        rating: 4.9,
        reviewCount: 45,
        address: 'Queens, NY',
        description: "Experienced foster home specializing in dogs with anxiety. We have a large fenced yard and two friendly dogs who love to play.",
        verified: true,
        price: 45,
        services: ['Large Fenced Yard', 'Medication Admin', 'Daily Walks', 'Photo Updates'],
        environment: {
            type: 'Single Family Home',
            yard: 'Fully Fenced (6ft)',
            pets: '2 Dogs (Golden Retrievers)',
            barks: 'Quiet Neighborhood'
        },
        routine: [
            { time: 'Morning', activity: '30 min walk + Breakfast' },
            { time: 'Mid-day', activity: 'Yard play' },
            { time: 'Evening', activity: 'Long walk + Dinner' }
        ]
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-12">
            {/* Hero Image */}
            <div className="h-64 md:h-96 w-full relative">
                <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div className="text-white">
                            <Badge variant="info" className="mb-2 bg-blue-500/20 text-blue-100 backdrop-blur-md border-blue-400/30">{serviceType}</Badge>
                            <h1 className="text-3xl md:text-5xl font-bold font-merriweather mb-2">{provider.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                                <span className="flex items-center gap-1 text-yellow-400 font-bold"><Star fill="currentColor" size={18} /> {provider.rating} ({provider.reviewCount} reviews)</span>
                                <span className="flex items-center gap-1 opacity-90"><MapPin size={18} /> {provider.address}</span>
                                {provider.verified && <span className="flex items-center gap-1 text-green-300"><Shield size={18} /> Verified Provider</span>}
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
                    {isVet ? (
                        <>
                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Services & Pricing</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {provider.services.map((svc, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 bg-white border border-border rounded-xl">
                                            <span className="font-medium text-text-primary">{svc.name}</span>
                                            <span className="text-brand-primary font-bold">{svc.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Hours</h2>
                                <div className="bg-white border border-border rounded-xl overflow-hidden">
                                    {provider.hours.map((h, idx) => (
                                        <div key={idx} className="flex justify-between p-4 border-b border-border last:border-0 hover:bg-gray-50">
                                            <span className="font-medium text-text-secondary">{h.day}</span>
                                            <span className="font-bold text-text-primary">{h.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Amenities</h2>
                                <div className="flex flex-wrap gap-3">
                                    {provider.amenities.map((item, idx) => (
                                        <div key={idx} className="px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
                                            <Check size={16} /> {item}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : (
                        /* Foster Specific */
                        <>
                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">What We Offer</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {provider.services.map((svc, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl">
                                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                                <Check size={16} />
                                            </div>
                                            <span className="text-sm font-medium text-text-primary">{svc}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-text-primary mb-4 font-merriweather">Environment</h2>
                                <Card className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-text-tertiary uppercase font-bold mb-1">Facility Type</p>
                                            <p className="font-medium text-text-primary">{provider.environment.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-tertiary uppercase font-bold mb-1">Yard Details</p>
                                            <p className="font-medium text-text-primary">{provider.environment.yard}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-tertiary uppercase font-bold mb-1">Resident Pets</p>
                                            <p className="font-medium text-text-primary">{provider.environment.pets}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-tertiary uppercase font-bold mb-1">Neighborhood</p>
                                            <p className="font-medium text-text-primary">{provider.environment.barks}</p>
                                        </div>
                                    </div>
                                </Card>
                            </section>
                        </>
                    )}

                    {/* Review Teaser */}
                    <div className="pt-8 border-t border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-text-primary font-merriweather">Reviews</h2>
                            <Link to={`/services/${id}/review`}>
                                <Button variant="outline">Write a Review</Button>
                            </Link>
                        </div>
                        {/* Mock Review */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div>
                                        <p className="font-bold text-text-primary">Alice Johnson</p>
                                        <p className="text-xs text-text-secondary">2 weeks ago</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                            </div>
                            <p className="text-text-secondary text-sm">
                                "Absolutely wonderful experience. They took such good care of our pup. Highly recommended!"
                            </p>
                        </Card>
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
                                    <Button variant="primary" className="w-full justify-center">
                                        <Phone size={18} className="mr-2" /> Call Now
                                    </Button>
                                    <Button variant="outline" className="w-full justify-center">Request Appointment</Button>
                                    <Button variant="ghost" className="w-full justify-center text-text-secondary">Get Directions</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-end mb-4 pb-4 border-b border-border">
                                    <div>
                                        <h3 className="font-bold text-lg">Daily Rate</h3>
                                        <p className="text-xs text-text-secondary">Includes basic care & walks</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-brand-primary">${provider.price}</span>
                                        <span className="text-text-secondary text-sm">/day</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl flex items-start gap-2 text-sm">
                                        <Calendar size={18} className="shrink-0 mt-0.5" />
                                        <span><strong>Limited spots left</strong> for next month. Book early!</span>
                                    </div>
                                    <Button variant="primary" className="w-full justify-center">Contact Provider</Button>
                                    <p className="text-xs text-center text-text-tertiary">Response time: Usually within 2 hours</p>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;
