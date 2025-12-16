import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Search, Filter, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import { useNavigate } from 'react-router-dom';

const ListingModerationPage = () => {
    const api = useAPI();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('pending_review');

    // Fetch Listings
    const { data: listings, isLoading } = useQuery({
        queryKey: ['adminListings', statusFilter],
        queryFn: async () => {
            const response = await api.get(`/admin-panel/listings/?status=${statusFilter}`);
            return response.data;
        }
    });

    // Approve Mutation
    const approveMutation = useMutation({
        mutationFn: async (id) => {
            await api.post(`/admin-panel/listings/${id}/approve/`);
        },
        onSuccess: () => {
            toast.success("Listing approved.");
            queryClient.invalidateQueries(['adminListings']);
        },
        onError: () => toast.error("Failed to approve.")
    });

    // Reject Mutation
    const rejectMutation = useMutation({
        mutationFn: async (id) => {
            await api.post(`/admin-panel/listings/${id}/reject/`);
        },
        onSuccess: () => {
            toast.success("Listing rejected.");
            queryClient.invalidateQueries(['adminListings']);
        },
        onError: () => toast.error("Failed to reject.")
    });

    if (isLoading) return <div className="p-8 text-center">Loading listings...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Listing Moderation</h1>
                    <p className="text-gray-500 mt-1">Review and manage pet listings.</p>
                </div>
                <div className="flex gap-2">
                    {['pending_review', 'active', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition ${statusFilter === status ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {listings && listings.length > 0 ? (
                    listings.map(listing => (
                        <Card key={listing.id} className="p-6 flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-48 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                <img
                                    src={listing.photo_url || 'https://via.placeholder.com/300?text=No+Image'}
                                    alt={listing.pet_name || listing.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{listing.pet_name || listing.name}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{listing.species} • {listing.breed} • {listing.age} months</p>
                                    </div>
                                    <Badge variant={
                                        listing.status === 'active' ? 'success' :
                                            listing.status === 'rejected' ? 'error' : 'warning'
                                    }>
                                        {listing.status.replace('_', ' ')}
                                    </Badge>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {listing.rehoming_story || listing.description}
                                </p>

                                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6">
                                    <span className="bg-gray-100 px-2 py-1 rounded">Fee: ${listing.adoption_fee}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">Owner Verified: {listing.owner_verified ? 'Yes' : 'No'}</span>
                                    {/* Additional info can go here */}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/pets/${listing.id}`)}
                                    >
                                        <Eye size={16} className="mr-2" /> View Details
                                    </Button>

                                    {listing.status === 'pending_review' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => approveMutation.mutate(listing.id)}
                                                disabled={approveMutation.isLoading}
                                            >
                                                <Check size={16} className="mr-2" /> Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => rejectMutation.mutate(listing.id)}
                                                disabled={rejectMutation.isLoading}
                                            >
                                                <X size={16} className="mr-2" /> Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                        <p className="text-gray-500">No listings found with status "{statusFilter.replace('_', ' ')}".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingModerationPage;
