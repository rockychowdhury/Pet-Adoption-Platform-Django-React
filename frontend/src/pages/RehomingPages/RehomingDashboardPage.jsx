
import React, { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
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
import HistoryTable from './components/HistoryTable';

const RehomingDashboardPage = () => {
    const queryClient = useQueryClient();
    const { useGetListings, useDeleteListing, useGetRehomingRequests, usePublishRehomingRequest, useCreateListing } = useRehoming();
    const { data: listings } = useGetListings({ owner: 'me' });
    const { data: requests } = useGetRehomingRequests();
    const deleteListingMutation = useDeleteListing();
    const publishMutation = usePublishRehomingRequest();
    const { mutate: createListing } = useCreateListing();

    // State
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'All';

    const setActiveTab = (tabId) => {
        setSearchParams({ tab: tabId });
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);

    const tabs = [
        { id: 'All', label: 'All Listings' },
        { id: 'Active', label: 'Active' },
        { id: 'Rehomed', label: 'Rehomed' }
    ];

    const listingsList = useMemo(() => Array.isArray(listings) ? listings : (listings?.results || []), [listings]);
    const requestsList = useMemo(() => Array.isArray(requests) ? requests : (requests?.results || []), [requests]);

    // Unified List
    const filteredItems = useMemo(() => {
        let items = [];

        // Helper to normalize
        const normalizeListing = (l) => ({ ...l, type: 'listing' });
        const normalizeRequest = (r) => ({
            id: r.id,
            type: 'request',
            status: r.status,
            pet: r.pet_details,
            created_at: r.created_at,
            location_city: r.location_city,
            // cooling_period_end removed
        });

        const activeListings = listingsList.map(normalizeListing);
        const activeRequests = requestsList.map(normalizeRequest);

        // Filter Logic based on User Requirements
        switch (activeTab) {
            case 'All':
                // Show ALL listings regardless of status
                // Exclude requests that are already 'listed' to avoid duplicates with the actual Listing object
                items = [...activeListings, ...activeRequests.filter(r => r.status !== 'listed')];
                break;
            case 'Active':
                items = activeListings.filter(l => l.status === 'active');
                break;
            case 'Rehomed':
                items = activeListings.filter(l => l.status === 'rehomed');
                break;
            default:
                items = activeListings;
        }

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => {
                const name = item.pet?.name?.toLowerCase() || '';
                const breed = item.pet?.breed?.toLowerCase() || '';
                return name.includes(query) || breed.includes(query);
            });
        }

        return items;
    }, [listingsList, requestsList, activeTab, searchQuery]);

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
    const getStatusStyle = (item) => {
        const status = item.status?.toLowerCase();

        // Special Request Statuses
        if (item.type === 'request') {
            if (status === 'confirmed') return { bg: 'bg-green-500/90', text: 'Ready to Publish', icon: CheckCircle2 };
            if (status === 'listed') return { bg: 'bg-brand-secondary/90', text: 'Listed', icon: CheckCircle2 };
            if (status === 'draft') return { bg: 'bg-gray-400/90', text: 'Draft Request', icon: Edit2 };
        }

        switch (status) {
            case 'active': return { bg: 'bg-brand-primary/90', text: 'Active', icon: CheckCircle2 };
            case 'pending_review': return { bg: 'bg-status-warning/90', text: 'In Review', icon: Clock };
            case 'draft': return { bg: 'bg-text-secondary/80', text: 'Draft', icon: Edit2 };
            case 'adopted':
            case 'rehomed': return { bg: 'bg-purple-500/90', text: 'Rehomed', icon: Heart };
            case 'rejected': return { bg: 'bg-status-error/90', text: 'Needs Revision', icon: AlertTriangle };
            case 'on_hold': return { bg: 'bg-orange-500/90', text: 'Paused', icon: PauseCircle };
            case 'closed': return { bg: 'bg-text-tertiary/90', text: 'Closed', icon: AlertCircle }; // Archive icon wasn't defined in import, swapped to AlertCircle or need import
            default: return { bg: 'bg-text-secondary/80', text: status, icon: AlertCircle };
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight font-logo">
                        Rehoming
                    </h1>
                    <p className="text-text-secondary font-medium mt-1">
                        Manage your listings and applications
                    </p>
                </div>
                <Link to="/rehoming">
                    <button className="bg-brand-primary text-text-inverted px-6 py-2.5 rounded-full font-bold text-sm tracking-wide hover:opacity-90 hover:shadow-md transition-all active:scale-95 flex items-center gap-2">
                        <Plus size={16} strokeWidth={3} />
                        Start Rehoming
                    </button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-bg-surface rounded-2xl p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-text-primary text-text-inverted shadow-md'
                                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80 hover:text-text-primary'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Toggle */}
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-secondary border-none rounded-xl py-2 pl-9 pr-4 outline-none text-sm font-medium focus:ring-2 focus:ring-brand-primary/50 transition-all"
                        />
                    </div>

                    <div className="bg-bg-secondary p-1 rounded-xl flex shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-bg-surface text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {!listings && !requests ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-primary border-t-transparent" />
                </div>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}>

                    {/* Create New Card (Grid Only) */}
                    {viewMode === 'grid' && (activeTab === 'All' || activeTab === 'Active') && !searchQuery && (
                        <Link
                            to="/rehoming/start"
                            className="group bg-bg-surface rounded-3xl p-4 border border-dashed border-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[380px] cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-bg-secondary rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-text-tertiary group-hover:text-brand-primary group-hover:bg-white">
                                <Plus size={28} />
                            </div>
                            <span className="text-sm font-bold text-text-secondary group-hover:text-brand-primary transition-colors">Start New Listing</span>
                        </Link>
                    )}

                    {filteredItems.map(item => {
                        const status = getStatusStyle(item);
                        const StatusIcon = status.icon;
                        const photoUrl = item.pet?.main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80';

                        // Determine Detail Link based on Type
                        let detailLink = '#';
                        if (item.type === 'listing') {
                            detailLink = `/pets/${item.id}`; // Or listing detail page
                        } else {
                            // It's a Request
                            detailLink = `/rehoming/create?resume=${item.id}`;
                        }

                        return (
                            <motion.div
                                key={`${item.type}-${item.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`group bg-bg-surface rounded-3xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 flex  ${viewMode === 'grid' ? 'flex-col h-full' : 'flex-row h-56'}`}
                            >
                                {/* Image Section */}
                                <div className={`relative overflow-hidden bg-bg-secondary/20 ${viewMode === 'grid' ? 'aspect-[3/2] w-full' : 'w-56 h-full shrink-0'}`}>
                                    <img
                                        src={photoUrl}
                                        alt={item.pet?.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {viewMode === 'grid' && (
                                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                        <div className={`px-2.5 py-1 text-text-inverted text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md ${status.bg}`}>
                                            <StatusIcon size={10} strokeWidth={3} />
                                            {status.text}
                                        </div>
                                    </div>

                                    {/* App Count Badge (Listings Only) */}
                                    {item.type === 'listing' && item.application_count > 0 && (
                                        <div className="absolute bottom-3 right-3 bg-bg-surface/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-brand-primary shadow-sm flex items-center gap-1">
                                            <Folder size={10} />
                                            {item.application_count} Apps
                                        </div>
                                    )}

                                    {/* Edit Icon */}
                                    {item.type === 'listing' && item.status !== 'rehomed' && (
                                        <Link
                                            to={`/dashboard/pets/${item.pet.id}/edit`}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-bg-surface hover:text-text-primary transition-all shadow-sm group/edit"
                                            title="Edit Listing"
                                        >
                                            <Edit2 size={14} className="group-hover/edit:scale-90 transition-transform" />
                                        </Link>
                                    )}
                                </div>

                                {/* Content Body */}
                                <div className="p-4 flex flex-col gap-3 flex-1">
                                    {/* Identity Block */}
                                    <div>
                                        <h3 className="font-bold text-xl text-text-primary leading-tight mb-0.5">{item.pet?.name}</h3>
                                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ">
                                            {item.pet?.species} • <span className="text-text-tertiary">{item.pet?.breed || 'Unknown'}</span>
                                        </p>
                                    </div>

                                    {/* Key Info Grid */}
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <span className="text-sm">🎂</span>
                                            <span className="text-[11px] font-bold">{item.pet?.age_display || 'Age N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <span className="text-sm">⚧</span>
                                            <span className="text-[11px] font-bold capitalize">{item.pet?.gender || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <span className="text-sm">📍</span>
                                            <span className="text-[11px] font-bold truncate max-w-[100px]">{item.location_city || 'Location N/A'}</span>
                                        </div>
                                        {item.type === 'listing' && (
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <span className="text-sm">👁️</span>
                                                <span className="text-[11px] font-bold">{item.view_count || 0} Views</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Meta Info */}
                                    <div className="mt-auto pt-3 border-t border-border/30 text-[9px] font-medium text-text-tertiary flex flex-col gap-0.5">
                                        <span>Created {new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-1">
                                        {item.type === 'listing' ? (
                                            // LISTING ACTIONS
                                            <>
                                                {item.status === 'active' ? (
                                                    <Link
                                                        to={`/rehoming/listings/${item.id}/applications`}
                                                        className="flex-1 bg-brand-primary text-text-inverted h-9 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        Review Apps
                                                    </Link>
                                                ) : item.status === 'rehomed' ? (
                                                    <div className="flex-1 bg-purple-100 text-purple-700 h-9 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                                                        Rehomed
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={`/pets/${item.id}`} // Preview
                                                        className="flex-1 bg-bg-secondary text-text-secondary h-9 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-bg-secondary/80 transition-all duration-300"
                                                    >
                                                        View
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="w-9 h-9 flex items-center justify-center border border-status-error/20 text-status-error bg-status-error/5 rounded-full hover:bg-status-error/10 hover:shadow-sm transition-all duration-300"
                                                    title="Delete Listing"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            // REQUEST ACTIONS
                                            <>
                                                {item.status === 'confirmed' ? (
                                                    <button
                                                        onClick={() => {
                                                            createListing({ request_id: item.id }, {
                                                                onSuccess: () => toast.success("Listing created successfully!"),
                                                                onError: () => toast.error("Failed to create listing.")
                                                            });
                                                        }}
                                                        className="flex-1 bg-status-success text-text-inverted h-9 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-status-success/90 hover:shadow-lg transition-all duration-300"
                                                    >
                                                        Create Listing
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={`/rehoming/create?resume=${item.id}`}
                                                        className="flex-1 bg-gray-800 text-white h-9 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all duration-300"
                                                    >
                                                        Resume
                                                    </Link>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                    }

                    {/* Empty State */}
                    {filteredItems.length === 0 && !(!searchQuery && activeTab === 'All' && viewMode === 'grid') && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4 text-text-tertiary">
                                <PackageOpen size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-1">No listings found</h3>
                            <p className="text-text-secondary text-sm">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            )}

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
    );
};

export default RehomingDashboardPage;
