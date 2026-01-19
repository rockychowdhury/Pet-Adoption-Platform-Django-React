import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, Loader } from 'lucide-react';
import useAdmin from '../../hooks/useAdmin';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const RoleRequestsPage = () => {
    const { useGetRoleRequests, useApproveRoleRequest, useRejectRoleRequest } = useAdmin();
    const [filter, setFilter] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');

    const { data: requests, isLoading } = useGetRoleRequests({ status: filter });
    const approveMutation = useApproveRoleRequest();
    const rejectMutation = useRejectRoleRequest();

    const handleApprove = async (request) => {
        try {
            await approveMutation.mutateAsync({
                id: request.id,
                admin_notes: adminNotes || 'Approved by admin'
            });
            toast.success(`Approved ${request.user_email}'s request`);
            setSelectedRequest(null);
            setAdminNotes('');
        } catch (error) {
            toast.error('Failed to approve request');
        }
    };

    const handleReject = async (request) => {
        if (!adminNotes.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            await rejectMutation.mutateAsync({
                id: request.id,
                admin_notes: adminNotes
            });
            toast.success(`Rejected ${request.user_email}'s request`);
            setSelectedRequest(null);
            setAdminNotes('');
        } catch (error) {
            toast.error('Failed to reject request');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <Badge variant="success">Approved</Badge>;
            case 'rejected':
                return <Badge variant="error">Rejected</Badge>;
            default:
                return <Badge variant="warning">Pending</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    const requestsList = requests?.results || requests || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-logo text-text-primary mb-2">
                    Role Requests
                </h1>
                <p className="text-text-secondary">
                    Review and manage user role change requests
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-bg-surface p-1 rounded-xl w-fit">
                {['pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${filter === status
                                ? 'bg-white shadow-sm text-brand-primary'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            <div className="grid gap-4">
                {requestsList.length === 0 ? (
                    <Card className="p-12 text-center">
                        <FileText size={48} className="mx-auto mb-4 text-text-tertiary opacity-20" />
                        <p className="text-text-secondary">No {filter} requests found</p>
                    </Card>
                ) : (
                    requestsList.map((request) => (
                        <Card key={request.id} className="p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                {/* Request Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                            <User className="text-brand-primary" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-text-primary">
                                                {request.user_email}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                Requesting: <span className="font-bold text-brand-primary capitalize">{request.requested_role.replace('_', ' ')}</span>
                                            </p>
                                        </div>
                                        {getStatusBadge(request.status)}
                                    </div>

                                    <div className="bg-bg-surface p-4 rounded-xl mb-3">
                                        <p className="text-sm font-bold text-text-secondary mb-1">Reason:</p>
                                        <p className="text-text-primary">{request.reason}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {format(new Date(request.created_at), 'MMM dd, yyyy')}
                                        </span>
                                        {request.admin_notes && (
                                            <span className="flex items-center gap-1">
                                                <FileText size={14} />
                                                Admin notes available
                                            </span>
                                        )}
                                    </div>

                                    {request.admin_notes && (
                                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-xs font-bold text-yellow-800 mb-1">Admin Notes:</p>
                                            <p className="text-sm text-yellow-900">{request.admin_notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {request.status === 'pending' && (
                                    <div className="flex flex-col gap-2 md:w-48">
                                        <Button
                                            variant="primary"
                                            className="bg-green-600 hover:bg-green-700 justify-center"
                                            onClick={() => setSelectedRequest(request)}
                                        >
                                            <CheckCircle size={18} className="mr-2" />
                                            Review
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Review Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl p-6">
                        <h2 className="text-2xl font-bold font-logo mb-4">Review Request</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-sm font-bold text-text-secondary">User:</p>
                                <p className="text-lg">{selectedRequest.user_email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-secondary">Requested Role:</p>
                                <p className="text-lg capitalize">{selectedRequest.requested_role.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-secondary">Reason:</p>
                                <p className="text-text-primary">{selectedRequest.reason}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">
                                    Admin Notes {filter === 'pending' && '(Required for rejection)'}:
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    rows={3}
                                    placeholder="Add notes about your decision..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                className="flex-1 bg-green-600 hover:bg-green-700 justify-center"
                                onClick={() => handleApprove(selectedRequest)}
                                disabled={approveMutation.isPending}
                            >
                                <CheckCircle size={18} className="mr-2" />
                                Approve
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 justify-center"
                                onClick={() => handleReject(selectedRequest)}
                                disabled={rejectMutation.isPending}
                            >
                                <XCircle size={18} className="mr-2" />
                                Reject
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSelectedRequest(null);
                                    setAdminNotes('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default RoleRequestsPage;
