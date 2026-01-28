import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Check, X, Search, Filter, MoreVertical,
    Shield, ShieldCheck, ShieldAlert
} from 'lucide-react';
import useAdmin from '../../hooks/useAdmin';
import Card from '../../components/common/Layout/Card';
import Badge from '../../components/common/Feedback/Badge';
import Button from '../../components/common/Buttons/Button';
import { toast } from 'react-toastify';

const AdminProvidersPage = () => {
    const { useGetProviders, useUpdateProviderStatus } = useAdmin();
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    // Fetch data
    const { data: providers, isLoading, refetch } = useGetProviders({
        status: statusFilter,
        search: search
    });

    const updateStatusMutation = useUpdateProviderStatus();

    const handleStatusUpdate = (id, newStatus) => {
        if (!confirm(`Are you sure you want to mark this provider as ${newStatus}?`)) return;

        updateStatusMutation.mutate({ id, status: newStatus }, {
            onSuccess: () => {
                toast.success(`Provider ${newStatus} successfully`);
                refetch();
            },
            onError: () => {
                toast.error('Failed to update status');
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'verified': return <Badge variant="success" icon={<ShieldCheck size={12} />}>Verified</Badge>;
            case 'pending': return <Badge variant="warning" icon={<Shield size={12} />}>Pending</Badge>;
            case 'rejected': return <Badge variant="error" icon={<ShieldAlert size={12} />}>Rejected</Badge>;
            default: return <Badge variant="neutral">{status}</Badge>;
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">Service Providers</h1>
                    <p className="text-text-secondary font-medium mt-1">Manage verification and status of service providers.</p>
                </div>
            </div>

            <Card className="p-4 flex flex-wrap gap-4 items-center justify-between sticky top-4 z-10 shadow-lg border-brand-primary/10">
                <div className="flex gap-2 items-center flex-1 min-w-[300px]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or business..."
                            className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    {['', 'pending', 'verified', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === status
                                ? 'bg-brand-primary text-white shadow-md transform scale-105'
                                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                                }`}
                        >
                            {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </Card>

            {isLoading ? (
                <div className="text-center py-20 text-text-secondary">Loading providers...</div>
            ) : (
                <div className="bg-bg-surface border border-border rounded-[2rem] overflow-hidden shadow-xl">
                    <table className="w-full">
                        <thead className="bg-bg-secondary/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Business Info</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Category</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Contact</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {providers?.results?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-text-secondary font-medium">
                                        No providers found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                providers?.results?.map((provider) => (
                                    <tr key={provider.id} className="group hover:bg-bg-secondary/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-bold text-text-primary text-base">{provider.business_name}</p>
                                                <p className="text-xs text-text-secondary mt-0.5">Owner: {provider.user.username}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-secondary/10 text-brand-secondary">
                                                {provider.category.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-text-secondary space-y-0.5">
                                                <p>{provider.email}</p>
                                                <p>{provider.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(provider.verification_status)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                                                {provider.verification_status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            onClick={() => handleStatusUpdate(provider.id, 'verified')}
                                                            disabled={updateStatusMutation.isPending}
                                                            className="h-8 w-8 !p-0 flex items-center justify-center rounded-full"
                                                            title="Approve"
                                                        >
                                                            <Check size={14} />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => handleStatusUpdate(provider.id, 'rejected')}
                                                            disabled={updateStatusMutation.isPending}
                                                            className="h-8 w-8 !p-0 flex items-center justify-center rounded-full"
                                                            title="Reject"
                                                        >
                                                            <X size={14} />
                                                        </Button>
                                                    </>
                                                )}
                                                {provider.verification_status === 'verified' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(provider.id, 'rejected')}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Revoke
                                                    </Button>
                                                )}
                                                {provider.verification_status === 'rejected' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(provider.id, 'verified')}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Re-Approve
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls could go here if paginated response */}
            {(providers?.count > 20) && (
                <div className="text-center text-sm text-text-secondary mt-4">
                    Showing 20 of {providers.count}. Pagination not implemented in this view yet.
                </div>
            )}
        </div>
    );
};

export default AdminProvidersPage;
