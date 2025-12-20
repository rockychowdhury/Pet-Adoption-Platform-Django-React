import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Heart, Map as MapIcon, List as ListIcon, LayoutGrid, ChevronRight, Info } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Buttons/Button';
import Card from '../../components/common/Layout/Card';
import Badge from '../../components/common/Feedback/Badge';
import { motion, AnimatePresence } from 'framer-motion';

import useServices from '../../hooks/useServices';
import NoResults from '../../components/common/Feedback/NoResults';

const ServiceSearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isVet = location.pathname.includes('/vet');
    const serviceType = isVet ? 'Veterinary Clinics' : 'Foster Care Providers';
    const providerType = isVet ? 'vet' : 'foster';

    // State from URL
    const search = searchParams.get('search') || '';
    const city = searchParams.get('location') || '';
    const radius = searchParams.get('radius') || '25';
    const species = searchParams.getAll('species') || [];

    const [viewMode, setViewMode] = useState('list');

    // Filter out radius if no location is provided
    const queryParams = {
        providerType,
        search,
        location: city,
        radius,
        species: species.join(','),
    };
    if (!city) {
        delete queryParams.radius;
    }

    // Query Hook
    const { useGetProviders } = useServices();
    const { data: providers, isLoading } = useGetProviders(queryParams);

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (Array.isArray(value)) {
            newParams.delete(key);
            value.forEach(v => newParams.append(key, v));
        } else if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const providersList = Array.isArray(providers) ? providers : (providers?.results || []);

    return (
        <div className="min-h-screen bg-bg-primary font-jakarta">
            <Navbar />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-12">
                <div className="flex flex-col xl:flex-row gap-12 py-12">

                    {/* Simplified Filter Sidebar */}
                    <aside className="w-full xl:w-80 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <Card className="p-6 border-none shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-text-primary">Filters</h3>
                                    <button
                                        className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary hover:text-brand-primary"
                                        onClick={() => setSearchParams({})}
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {/* Species Filter */}
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary mb-4">Species Accepted</h4>
                                        <div className="space-y-3">
                                            {['Dogs', 'Cats', 'Rabbits', 'Small Animals'].map(s => (
                                                <label key={s} className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={species.includes(s)}
                                                        onChange={(e) => {
                                                            const newSpecies = e.target.checked
                                                                ? [...species, s]
                                                                : species.filter(item => item !== s);
                                                            handleFilterChange('species', newSpecies);
                                                        }}
                                                        className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                                    />
                                                    <span className={`text-[14px] font-medium transition-colors ${species.includes(s) ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                                        {s}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info Card */}
                                    <div className="bg-brand-secondary/30 rounded-2xl p-4 flex gap-3">
                                        <Info size={18} className="text-brand-primary shrink-0" />
                                        <p className="text-[12px] font-medium text-brand-primary/80 leading-snug">
                                            Verified providers undergo a thorough backround and identity check for your peace of mind.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </aside>

                    {/* Results Area */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[13px] font-bold text-[#4B5563] uppercase tracking-wider">
                                {providersList.length} Providers Found
                            </h3>

                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-text-primary shadow-sm' : 'text-text-tertiary'}`}
                                >
                                    <ListIcon size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-text-primary shadow-sm' : 'text-text-tertiary'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white h-48 rounded-2xl animate-pulse shadow-sm" />
                                ))}
                            </div>
                        ) : (
                            <div className={`grid gap-8 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
                                <AnimatePresence mode="popLayout">
                                    {providersList.map((provider) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={provider.id}
                                        >
                                            <Link to={`/services/${providerType}/${provider.id}`}>
                                                <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group">
                                                    <div className="flex flex-col md:flex-row h-full">
                                                        <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden">
                                                            <img
                                                                src={provider.photos?.[0] || 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80'}
                                                                alt={provider.business_name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                            <div className="absolute top-3 left-3">
                                                                {provider.is_verified && (
                                                                    <div className="bg-brand-primary text-white p-1 rounded-full">
                                                                        <Star size={12} fill="currentColor" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 p-6 flex flex-col">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                                                                    {provider.business_name}
                                                                </h4>
                                                                {provider.provider_type === 'foster' && (
                                                                    <span className="font-bold text-brand-primary">
                                                                        ${provider.foster_details?.daily_rate || 0}/day
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-text-tertiary text-sm mb-4">
                                                                <MapPin size={14} /> {provider.city}, {provider.state}
                                                            </div>
                                                            <p className="text-sm text-text-secondary line-clamp-2 mb-6">
                                                                {provider.description}
                                                            </p>
                                                            <div className="mt-auto flex items-center justify-between">
                                                                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                                    <Star size={14} fill="currentColor" />
                                                                    {provider.avg_rating || '5.0'}
                                                                    <span className="text-text-tertiary font-medium">({provider.reviews_count || 0})</span>
                                                                </div>
                                                                <span className="text-brand-primary font-bold text-sm flex items-center gap-1 group/btn">
                                                                    View Profile <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {providersList.length === 0 && (
                                    <div className="col-span-full">
                                        <NoResults
                                            title="No providers found"
                                            description="Try adjusting your filters or searching in a different area."
                                            onReset={() => setSearchParams({})}
                                            backgroundText="NONE"
                                            icon={Search}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceSearchPage;
