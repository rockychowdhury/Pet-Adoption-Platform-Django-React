
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Folder, MessageCircle, Edit2, Archive, Trash2, AlertCircle } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import { toast } from 'react-toastify';

const RehomingDashboardPage = () => {
    const api = useAPI();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');

    // Fetch User's Listings using the endpoint that returns all statuses for "owner=me"
    const { data: listings = [], isLoading, refetch } = useQuery({
        queryKey: ['myListings'],
        queryFn: async () => {
            const res = await api.get('/pets/?owner=me');
            return res.data; // Depending on pagination, this might be res.data.results
        }
    });

    const listingsList = Array.isArray(listings) ? listings : (listings.results || []);

    const filteredListings = listingsList.filter(listing => {
        if (filter === 'All') return true;
        // Normalize status check (backend uses lowercase, UI uses Capitalized usually)
        return listing.status?.toLowerCase() === filter.toLowerCase().replace(' ', '_');
    });

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
        try {
            await api.delete(`/pets/${id}/`);
            toast.success("Listing deleted.");
            refetch();
        } catch (err) {
            toast.error("Failed to delete listing.");
        }
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'active') return 'bg-status-success/10 text-status-success';
        if (s === 'pending_review') return 'bg-status-warning/10 text-status-warning';
        if (s === 'adopted') return 'bg-status-info/10 text-status-info';
        if (s === 'draft') return 'bg-gray-100 text-gray-600';
        return 'bg-bg-secondary text-text-secondary';
    };

    const getStatusLabel = (status) => {
        const s = status?.toLowerCase();
        if (s === 'pending_review') return 'Pending Review';
        return status?.charAt(0).toUpperCase() + status?.slice(1);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-brand-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary font-serif">My Rehoming Listings</h1>
                    <p className="text-text-secondary mt-1">Manage your active listings and applications</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/rehoming/start">
                        <Button variant="outline" className="h-10">Process Overview</Button>
                    </Link>
                    <Link to="/rehoming/create">
                        <Button variant="primary" className="h-10 shadow-lg hover:shadow-xl transition-all">
                            <Plus size={18} className="mr-2" /> Create New Listing
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-border scrollbar-hide">
                {['All', 'Active', 'Pending Review', 'Draft', 'Adopted'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === status
                            ? 'bg-brand-primary text-text-inverted shadow-md'
                            : 'bg-bg-surface text-text-secondary hover:bg-bg-secondary border border-border'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Listings List */}
            <div className="space-y-4">
                {filteredListings.length > 0 ? (
                    filteredListings.map(listing => (
                        <Card key={listing.id} className="flex flex-col md:flex-row overflow-hidden group hover:border-brand-primary/50 transition-colors">
                            {/* Image */}
                            <div className="w-full md:w-56 h-48 md:h-auto relative bg-gray-100">
                                {listing.photos && listing.photos.length > 0 ? (
                                    <img src={listing.photos[0]} alt={listing.pet_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <AlertCircle size={32} />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 md:hidden">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(listing.status)}`}>
                                        {getStatusLabel(listing.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-text-primary mb-1">{listing.pet_name}</h3>
                                        <p className="text-sm text-text-secondary font-medium">
                                            {listing.species} • {listing.breed || 'Unknown Breed'} • {listing.age_months ? `${listing.age_months}m` : 'Age unknown'}
                                        </p>
                                        <p className="text-xs text-text-tertiary mt-2">
                                            Created {new Date(listing.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(listing.status)}`}>
                                        {getStatusLabel(listing.status)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-6 mt-6">
                                    <div className="flex items-center gap-2 text-text-secondary" title="Views">
                                        <Eye size={18} /> <span className="text-sm font-bold">--</span> {/* Backend needs to track views */}
                                    </div>
                                    <Link to={`/rehoming/listings/${listing.id}/applications`} className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors" title="Applications">
                                        <Folder size={18} /> <span className="text-sm font-bold">--</span> {/* Needs count from backend */}
                                    </Link>
                                    <div className="flex items-center gap-2 text-text-secondary" title="Messages">
                                        <MessageCircle size={16} /> <span className="text-sm font-bold">--</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t md:border-t-0 md:border-l border-border flex md:flex-col justify-center gap-3 md:w-48 bg-gray-50 dark:bg-gray-800/30">
                                <Link to={`/pets/${listing.id}`} className="w-full">
                                    <Button variant="outline" className="w-full justify-center text-xs">View Public Page</Button>
                                </Link>
                                <Link to={`/rehoming/create?edit=${listing.id}`} className="w-full">
                                    <Button variant="primary" className="w-full justify-center text-xs">Edit Listing</Button>
                                </Link>

                                <div className="md:mt-auto pt-2 flex justify-center gap-4 text-text-tertiary">
                                    <button
                                        onClick={() => handleDelete(listing.id)}
                                        className="p-2 hover:bg-status-error/10 hover:text-status-error rounded-full transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-bg-surface rounded-3xl border border-dashed border-border animate-fadeIn">
                        <div className="mx-auto w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary mb-4">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">No listings found</h3>
                        <p className="text-text-secondary mb-6">Create a listing to find a new home for your pet.</p>
                        <Link to="/rehoming/start">
                            <Button variant="primary">Start Rehoming</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RehomingDashboardPage;
