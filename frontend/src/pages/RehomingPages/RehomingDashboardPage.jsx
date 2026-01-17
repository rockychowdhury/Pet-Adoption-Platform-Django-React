
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus, Search, Grid, List, PackageOpen,
    Calendar, MapPin, Folder, Edit2, Trash2,
    AlertCircle, CheckCircle2, Clock, PauseCircle,
    AlertTriangle, Heart, Eye
} from 'lucide-react';
import useRehoming from '../../hooks/useRehoming';
import ConfirmationModal from '../../components/common/Modal/ConfirmationModal';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const RehomingDashboardPage = () => {
    const { useGetListings, useDeleteListing } = useRehoming();
    const { data: listings, isLoading } = useGetListings({ owner: 'me' });
    const deleteListingMutation = useDeleteListing();

    // State
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);

    const tabs = [
        { id: 'All', label: 'All Listings' },
        { id: 'Active', label: 'Active' },
        { id: 'Pending', label: 'In Review' },
        { id: 'Draft', label: 'Drafts' },
        { id: 'History', label: 'History' } // Adopted/Archived
    ];

    const listingsList = useMemo(() => Array.isArray(listings) ? listings : (listings?.results || []), [listings]);

    // Filtering Logic
    const filteredListings = useMemo(() => {
        return listingsList.filter(l => {
            const status = l.status?.toLowerCase();

            // Tab Filter
            if (activeTab === 'Active' && status !== 'active') return false;
            if (activeTab === 'Pending' && status !== 'pending_review') return false;
            if (activeTab === 'Draft' && status !== 'draft' && status !== 'rejected') return false;
            if (activeTab === 'History' && status !== 'adopted' && status !== 'expired' && status !== 'on_hold') return false;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const name = l.pet?.name?.toLowerCase() || '';
                const breed = l.pet?.breed?.toLowerCase() || '';
                return name.includes(query) || breed.includes(query);
            }

            return true;
        });
    }, [listingsList, activeTab, searchQuery]);

    const handleDeleteClick = (listing) => {
        setListingToDelete(listing);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!listingToDelete) return;
        try {
            await deleteListingMutation.mutateAsync(listingToDelete.id);
            toast.success("Listing removed successfully.");
            setDeleteModalOpen(false);
            setListingToDelete(null);
        } catch (error) {
            toast.error("Failed to delete listing.");
        }
    };

    // Helper to get status styling
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return { bg: 'bg-brand-primary/90', text: 'Active', icon: CheckCircle2 };
            case 'pending_review': return { bg: 'bg-status-warning/90', text: 'In Review', icon: Clock };
            case 'draft': return { bg: 'bg-gray-500/90', text: 'Draft', icon: Edit2 };
            case 'adopted': return { bg: 'bg-purple-500/90', text: 'Adopted', icon: Heart };
            case 'rejected': return { bg: 'bg-status-error/90', text: 'Needs Revision', icon: AlertTriangle };
            case 'on_hold': return { bg: 'bg-orange-500/90', text: 'Paused', icon: PauseCircle };
            default: return { bg: 'bg-gray-500/90', text: status, icon: AlertCircle };
        }
    };

    return (
        <div className="min-h-screen font-sans text-text-primary pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-3">
                                Rehoming
                            </h1>
                            <p className="text-text-secondary text-lg font-medium">
                                Manage your listings and applications
                            </p>
                        </div>
                        <Link to="/rehoming">
                            <button className="bg-brand-primary text-text-inverted px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:opacity-90 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                                <Plus size={18} strokeWidth={3} />
                                Start Rehoming
                            </button>
                        </Link>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-10">
                        {/* Tabs */}
                        <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                            <div className="bg-bg-secondary p-1.5 rounded-full flex gap-1 w-max">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-bg-surface text-text-primary shadow-sm'
                                            : 'text-text-secondary hover:text-text-primary'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search & Toggle */}
                        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                            <div className="relative flex-1 lg:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search listings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-bg-surface border border-border rounded-full py-3.5 pl-12 pr-4 outline-none text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium shadow-sm"
                                />
                            </div>

                            <div className="bg-bg-surface border border-border p-1.5 rounded-full flex shrink-0 self-start sm:self-auto shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-bg-secondary text-text-primary shadow-inner' : 'text-text-tertiary hover:text-text-secondary'}`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-bg-secondary text-text-primary shadow-inner' : 'text-text-tertiary hover:text-text-secondary'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading && !listingsList.length ? (
                        <div className="flex justify-center py-32">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-gray-900" />
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}>

                            {/* Create New Card (Grid Only) */}
                            {viewMode === 'grid' && activeTab === 'All' && !searchQuery && (
                                <Link
                                    to="/rehoming/start"
                                    className="group bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 flex flex-col items-center justify-center min-h-[420px] cursor-pointer"
                                >
                                    <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-gray-900">
                                        <Plus size={32} />
                                    </div>
                                    <span className="text-lg font-bold text-gray-500 group-hover:text-gray-900 dark:text-gray-300 transition-colors">Start New Listing</span>
                                </Link>
                            )}

                            {filteredListings.map(listing => {
                                const status = getStatusStyle(listing.status);
                                const StatusIcon = status.icon;
                                const photoUrl = listing.pet?.main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80';

                                return (
                                    <motion.div
                                        key={listing.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`group bg-bg-surface rounded-3xl shadow-sm border border-border/50 overflow-hidden hover:shadow-md transition-all duration-300 flex font-jakarta ${viewMode === 'grid' ? 'flex-col h-full' : 'flex-row h-64'}`}
                                    >
                                        {/* Image Section */}
                                        <div className={`relative overflow-hidden bg-bg-secondary/20 ${viewMode === 'grid' ? 'aspect-[3/2] w-full' : 'w-64 h-full shrink-0'}`}>
                                            <img
                                                src={photoUrl}
                                                alt={listing.pet?.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {viewMode === 'grid' && (
                                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-3 left-3">
                                                <div className={`px-2.5 py-1 text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md ${status.bg}`}>
                                                    <StatusIcon size={10} strokeWidth={3} />
                                                    {status.text}
                                                </div>
                                            </div>

                                            {/* App Count Badge */}
                                            {listing.application_count > 0 && (
                                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-brand-primary shadow-sm flex items-center gap-1">
                                                    <Folder size={10} />
                                                    {listing.application_count} Apps
                                                </div>
                                            )}

                                            {/* Edit Icon */}
                                            <Link
                                                to={`/rehoming/create-listing?edit=${listing.id}`}
                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-text-primary transition-all shadow-sm group/edit"
                                                title="Edit Listing"
                                            >
                                                <Edit2 size={14} className="group-hover/edit:scale-90 transition-transform" />
                                            </Link>
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-4 flex flex-col gap-3 flex-1">
                                            {/* Identity Block */}
                                            <div>
                                                <h3 className="font-logo text-xl text-text-primary leading-tight mb-0.5">{listing.pet?.name}</h3>
                                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-jakarta">
                                                    {listing.pet?.species} • <span className="text-text-tertiary">{listing.pet?.breed || 'Unknown'}</span>
                                                </p>
                                            </div>

                                            {/* Key Info Grid */}
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <span className="text-sm">🎂</span>
                                                    <span className="text-[11px] font-bold">{listing.pet?.age_display || 'Age N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <span className="text-sm">⚧</span>
                                                    <span className="text-[11px] font-bold capitalize">{listing.pet?.gender || 'Unknown'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <span className="text-sm">📍</span>
                                                    <span className="text-[11px] font-bold truncate max-w-[100px]">{listing.location_city || 'Location N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <span className="text-sm">👁️</span>
                                                    <span className="text-[11px] font-bold">{listing.view_count || 0} Views</span>
                                                </div>
                                            </div>

                                            {/* Meta Info */}
                                            <div className="mt-auto pt-3 border-t border-border/30 text-[9px] font-medium text-text-tertiary flex flex-col gap-0.5">
                                                <span>Created {new Date(listing.created_at).toLocaleDateString()}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-1">
                                                {listing.status === 'active' ? (
                                                    <Link
                                                        to={`/rehoming/listings/${listing.id}/applications`}
                                                        className="flex-1 bg-brand-primary text-text-inverted h-10 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        Review Apps
                                                    </Link>
                                                ) : listing.status === 'draft' || listing.status === 'rejected' ? (
                                                    <Link
                                                        to={`/rehoming/create?edit=${listing.id}`}
                                                        className="flex-1 bg-brand-primary text-text-inverted h-10 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        Continue
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/pets/${listing.id}`}
                                                        className="flex-1 bg-bg-secondary text-text-secondary h-10 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-bg-secondary/80 transition-all duration-300"
                                                    >
                                                        View Preview
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={() => handleDeleteClick(listing)}
                                                    className="w-10 h-10 flex items-center justify-center border border-status-error/20 text-status-error bg-status-error/5 rounded-full hover:bg-status-error/10 hover:shadow-sm transition-all duration-300"
                                                    title="Delete Listing"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Empty State */}
                            {filteredListings.length === 0 && !(!searchQuery && activeTab === 'All' && viewMode === 'grid') && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                        <PackageOpen size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No listings found</h3>
                                    <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Listing?"
                    message={`Are you sure you want to delete this listing for ${listingToDelete?.pet?.name}? This cannot be undone.`}
                    confirmText="Delete"
                    isLoading={deleteListingMutation.isPending}
                />
            </div>
        </div>
    );
};

export default RehomingDashboardPage;
