import React, { useState } from 'react'; // Force refresh
import { Link } from 'react-router-dom';
import { Plus, Eye, Folder, MessageCircle, MoreVertical, Edit2, Archive, Trash2 } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';

const RehomingDashboardPage = () => {
    const [filter, setFilter] = useState('All');

    // Mock Listings
    const listings = [
        {
            id: 1,
            name: 'Bella',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: '2 yrs',
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            status: 'Active',
            posted: '2 days ago',
            stats: { views: 124, applications: 5, messages: 3 }
        },
        {
            id: 2,
            name: 'Luna',
            species: 'Cat',
            breed: 'Siamese',
            age: '1 yr',
            image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            status: 'Pending Review',
            posted: '5 hrs ago',
            stats: { views: 12, applications: 0, messages: 0 }
        }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return 'bg-status-success/10 text-status-success';
            case 'Pending Review': return 'bg-status-warning/10 text-status-warning';
            case 'Adopted': return 'bg-status-info/10 text-status-info';
            default: return 'bg-bg-secondary text-text-secondary';
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">My Rehoming Listings</h1>
                    <p className="text-text-secondary mt-1">Manage your active listings and applications</p>
                </div>
                <Link to="/rehoming/start">
                    <Button variant="primary" className="shadow-lg hover:shadow-xl transition-all">
                        <Plus size={18} className="mr-2" /> Create New Listing
                    </Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-border">
                {['All', 'Active', 'Pending Review', 'On Hold', 'Adopted'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === status
                            ? 'bg-brand-primary text-text-inverted shadow-md'
                            : 'bg-bg-surface text-text-secondary hover:bg-bg-secondary border border-border'
                            }`}
                    >
                        {status} {status === 'All' && `(${listings.length})`}
                    </button>
                ))}
            </div>

            {/* Listings List */}
            <div className="space-y-4">
                {listings.map(listing => (
                    <Card key={listing.id} className="flex flex-col md:flex-row overflow-hidden group hover:border-brand-primary/50 transition-colors">
                        {/* Image */}
                        <div className="w-full md:w-48 h-48 md:h-auto relative">
                            <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 md:hidden">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(listing.status)}`}>
                                    {listing.status}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary mb-1">{listing.name}</h3>
                                    <p className="text-sm text-text-secondary font-medium">{listing.species} • {listing.breed} • {listing.age}</p>
                                    <p className="text-xs text-text-tertiary mt-2">Posted {listing.posted}</p>
                                </div>
                                <span className={`hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(listing.status)}`}>
                                    {listing.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-6 mt-6">
                                <div className="flex items-center gap-2 text-text-secondary" title="Views">
                                    <Eye size={18} /> <span className="text-sm font-bold">{listing.stats.views}</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary" title="Applications">
                                    <Folder size={18} /> <span className="text-sm font-bold">{listing.stats.applications}</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary" title="Messages">
                                    <MessageCircle size={16} className="text-brand-primary" /> <span className="text-sm font-bold">{listing.stats.messages}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t md:border-t-0 md:border-l border-border flex md:flex-col justify-end gap-3 min-w-[180px]">
                            <Link to={`/listings/${listing.id}`} className="w-full">
                                <Button variant="primary" className="w-full justify-center">View Listing</Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-center">Edit</Button>

                            <div className="md:mt-auto pt-2 flex justify-center gap-4 md:justify-end text-text-tertiary">
                                <button className="hover:text-status-error transition-colors" title="Delete"><Trash2 size={18} /></button>
                                <button className="hover:text-text-primary transition-colors" title="Archive"><Archive size={18} /></button>
                            </div>
                        </div>
                    </Card>
                ))}

                {listings.length === 0 && (
                    <div className="text-center py-20 bg-bg-surface rounded-3xl border border-dashed border-border">
                        <div className="mx-auto w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary mb-4">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">No listings found</h3>
                        <p className="text-text-secondary mb-6">Create your first listing to start searching for a home.</p>
                        <Link to="/rehoming/start">
                            <Button variant="primary">Create Listing</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RehomingDashboardPage;
