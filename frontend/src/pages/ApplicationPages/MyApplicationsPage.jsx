import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search, Filter, Calendar, MapPin, ChevronLeft, ChevronRight,
    MoreHorizontal, ArrowUpDown, SlidersHorizontal, Eye, User,
    CheckCircle2, XCircle, Clock, Send, Inbox, Sparkles
} from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import SideDrawer from '../../components/common/Layout/SideDrawer';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

// --- Helpers ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
};

const getStatusColor = (status) => {
    switch (status) {
        case 'adopted': return 'success';
        case 'approved_meet_greet': return 'success';
        case 'pending_review': return 'warning';
        case 'rejected': return 'error';
        case 'withdrawn': return 'neutral';
        default: return 'neutral';
    }
};

const getStatusLabel = (status) => status?.replace(/_/g, ' ') || 'Unknown';

// --- Main Page Component ---
const MyApplicationsPage = () => {
    const api = useAPI();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // View State
    const [searchParams, setSearchParams] = useSearchParams();
    const viewMode = searchParams.get('view') || 'sent'; // 'sent' | 'received'
    const [globalFilter, setGlobalFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Drawer State
    const [selectedApp, setSelectedApp] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Fetch Data
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await api.get('/rehoming/inquiries/');
            return res.data.results || res.data;
        }
    });

    // --- Data Processing ---
    const data = useMemo(() => {
        if (!user) return [];

        let filtered = applications.filter(app => {
            if (viewMode === 'sent') {
                return app.applicant.id === user.id;
            } else {
                // Received: Listing owner is me
                return app.listing.owner?.id === user.id || app.listing.owner === user.id;
            }
        });

        // Apply Status Filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.application.status === statusFilter);
        }

        return filtered;
    }, [applications, user, viewMode, statusFilter]);

    // --- Table Configuration ---
    const columnHelper = createColumnHelper();

    const columns = useMemo(() => [
        // Pet Column
        columnHelper.accessor('pet', {
            header: 'Pet',
            cell: info => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-bg-secondary shrink-0 border border-border">
                        <img
                            src={info.row.original.pet.primary_photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80"}
                            alt={info.row.original.pet.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-text-primary text-sm">{info.row.original.pet.name}</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">{info.row.original.pet.breed}</p>
                    </div>
                </div>
            )
        }),
        // Counterpart Column (Owner or Applicant)
        columnHelper.accessor('counterpart', {
            header: viewMode === 'sent' ? 'Owner' : 'Applicant',
            cell: info => {
                const person = viewMode === 'sent' ? info.row.original.listing.owner : info.row.original.applicant;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-secondary overflow-hidden shrink-0">
                            <img src={person?.photo_url || person?.photoURL} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-bold text-text-primary text-sm">{person?.full_name || 'Unknown'}</p>
                            {viewMode === 'received' && (
                                <p className="text-[10px] text-text-tertiary">{person?.location?.city}, {person?.location?.state}</p>
                            )}
                        </div>
                    </div>
                );
            }
        }),
        // Match Score Column (Only for Received)
        ...(viewMode === 'received' ? [
            columnHelper.accessor('application.match_percentage', {
                header: ({ column }) => (
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Match %
                        <ArrowUpDown size={12} />
                    </Button>
                ),
                cell: info => {
                    const score = info.getValue() || 0;
                    const isProcessed = info.row.original.application.ai_processed;

                    if (!isProcessed) return <span className="text-xs text-text-tertiary">Pending...</span>;

                    let color = "text-red-500";
                    if (score >= 80) color = "text-green-600";
                    else if (score >= 50) color = "text-yellow-600";

                    return (
                        <div className={`flex items-center gap-1.5 font-black ${color}`}>
                            <Sparkles size={14} className={score >= 80 ? "fill-green-600" : ""} />
                            {score}%
                        </div>
                    );
                }
            })
        ] : []),
        // Status Column
        columnHelper.accessor('application.status', {
            header: 'Status',
            cell: info => (
                <Badge variant={getStatusColor(info.getValue())} className="uppercase tracking-widest text-[10px] font-black px-2.5 py-1">
                    {getStatusLabel(info.getValue())}
                </Badge>
            )
        }),
        // Date Column
        columnHelper.accessor('application.submitted_at', {
            header: ({ column }) => (
                <Button variant="ghost" className="p-0 hover:bg-transparent text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown size={12} />
                </Button>
            ),
            cell: info => (
                <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
                    <Calendar size={14} className="text-text-tertiary" />
                    {formatDate(info.getValue())}
                </div>
            )
        }),
        // Actions Column
        columnHelper.display({
            id: 'actions',
            header: '',
            cell: info => (
                <button
                    className="h-8 w-8 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        const appId = info.row.original.application.id;
                        if (window.innerWidth < 768) {
                            const route = viewMode === 'sent'
                                ? `/applications/${appId}`
                                : `/applications/${appId}/review`;
                            navigate(route);
                        } else {
                            setSelectedApp(info.row.original);
                            setIsDrawerOpen(true);
                        }
                    }}
                >
                    <MoreHorizontal size={20} />
                </button>
            )
        })
    ], [viewMode]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 8,
            },
        },
    });

    // --- Action Handlers ---
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, notes }) => {
            return await api.post(`/rehoming/inquiries/${id}/update_status/`, { status, owner_notes: notes });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            toast.success("Application updated successfully");
            setIsDrawerOpen(false);
        },
        onError: () => toast.error("Failed to update status")
    });

    const withdrawMutation = useMutation({
        mutationFn: async (id) => {
            return await api.post(`/rehoming/inquiries/${id}/withdraw/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            toast.success("Application withdrawn successfully");
            setIsDrawerOpen(false);
        },
        onError: (err) => toast.error(err.response?.data?.detail || "Failed to withdraw application")
    });

    // --- Render ---
    return (
        <div className="min-h-screen bg-[#F9F8F6] py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. Header & Toggle */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-text-primary tracking-tight font-logo">Application Manager</h1>
                        <p className="text-text-secondary font-medium mt-1">Track and manage all your rehoming activities.</p>
                    </div>

                    {/* Main Toggle */}
                    <div className="bg-white p-1.5 rounded-full border border-border shadow-sm flex items-center gap-1 self-start md:self-auto">
                        <button
                            onClick={() => setSearchParams(prev => {
                                const newParams = new URLSearchParams(prev);
                                newParams.set('view', 'sent');
                                return newParams;
                            })}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'sent'
                                ? 'bg-brand-primary text-text-inverted shadow-md'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                }`}
                        >
                            <Send size={16} /> Sent Applications
                        </button>
                        <button
                            onClick={() => setSearchParams(prev => {
                                const newParams = new URLSearchParams(prev);
                                newParams.set('view', 'received');
                                return newParams;
                            })}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'received'
                                ? 'bg-brand-primary text-text-inverted shadow-md'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                }`}
                        >
                            <Inbox size={16} /> Received Applications
                        </button>
                    </div>
                </div>

                {/* 2. Filter Bar */}
                <div className="bg-white rounded-2xl p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar">


                        <div className="flex items-center gap-2">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'pending_review', label: 'Pending' },
                                { id: 'approved_meet_greet', label: 'Meet & Greet' },
                                { id: 'adopted', label: 'Adopted' },
                                { id: 'rejected', label: 'Rejected' },
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setStatusFilter(filter.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === filter.id
                                        ? 'bg-text-primary text-text-inverted shadow-lg scale-105'
                                        : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80 hover:text-text-primary'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-bg-secondary border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                </div>

                {/* 3. Table */}
                <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest text-text-tertiary">Loading Data...</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                                {viewMode === 'sent' ? <Send size={24} /> : <Inbox size={24} />}
                            </div>
                            <h3 className="text-lg font-black text-text-primary mb-2">No applications found</h3>
                            <p className="text-text-tertiary text-sm">
                                {viewMode === 'sent' ? "You haven't applied for any pets yet." : "No applications received matching current filters."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F9F8F6] border-b border-border">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} className="px-6 py-4 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-bg-secondary/30 transition-colors group cursor-pointer" onClick={() => {
                                            setSelectedApp(row.original);
                                            setIsDrawerOpen(true);
                                        }}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-6 py-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {data.length > 0 && (
                        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                            <p className="text-xs font-bold text-text-tertiary">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={!table.getCanPreviousPage()}
                                    onClick={() => table.previousPage()}
                                    className="h-8 w-8 rounded-full flex items-center justify-center text-text-primary border border-border hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    disabled={!table.getCanNextPage()}
                                    onClick={() => table.nextPage()}
                                    className="h-8 w-8 rounded-full flex items-center justify-center text-text-primary border border-border hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* 4. Details Drawer */}
            <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={viewMode === 'sent' ? 'Application Details' : 'Review Application'}
            >
                {selectedApp && (
                    <div className="space-y-8">
                        {/* Status Banner */}
                        <div className="bg-bg-secondary p-4 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">Current Status</span>
                            <Badge variant={getStatusColor(selectedApp.application.status)} className="px-3 py-1 text-sm font-black uppercase tracking-wider">
                                {getStatusLabel(selectedApp.application.status)}
                            </Badge>
                        </div>

                        {/* Meet & Greet Info */}
                        {selectedApp.application.status === 'approved_meet_greet' && selectedApp.application.owner_notes?.includes('[SCHEDULED:') && (
                            <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-green-700 shadow-sm">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-green-800 uppercase tracking-wide mb-1">Meet & Greet Scheduled</h4>
                                    <p className="text-green-900 font-bold text-lg">
                                        {(() => {
                                            const match = selectedApp.application.owner_notes.match(/\[SCHEDULED: (.*?)\]/);
                                            if (match) {
                                                const date = new Date(match[1]);
                                                return format(date, 'MMMM d, yyyy @ h:mm a');
                                            }
                                            return 'Date & Time details in notes';
                                        })()}
                                    </p>
                                    <p className="text-green-800 text-sm mt-2 font-medium">
                                        {selectedApp.application.owner_notes.replace(/\[SCHEDULED:.*?\]/, '').trim()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pet Snapshot */}
                        <div className="flex gap-6 pb-8 border-b border-border">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-bg-secondary shrink-0">
                                <img src={selectedApp.pet.primary_photo} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-text-primary">{selectedApp.pet.name}</h3>
                                <p className="text-text-secondary font-medium">{selectedApp.pet.species} • {selectedApp.pet.breed} • {selectedApp.pet.gender}</p>
                                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-text-tertiary">
                                    <MapPin size={14} />
                                    {selectedApp.listing.location.city}, {selectedApp.listing.location.state}
                                </div>
                            </div>
                        </div>

                        {/* Counterpart Info */}
                        <div>
                            <h4 className="text-xs font-black text-text-tertiary uppercase tracking-widest mb-4">
                                {viewMode === 'sent' ? 'Listing Owner' : 'Applicant Profile'}
                            </h4>
                            <div className="bg-white border border-border p-6 rounded-2xl flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-bg-secondary overflow-hidden shrink-0">
                                    <img
                                        src={viewMode === 'sent' ? selectedApp.listing.owner?.photo_url : selectedApp.applicant.photo_url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-text-primary">
                                        {viewMode === 'sent' ? selectedApp.listing.owner?.full_name : selectedApp.applicant.full_name}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-text-secondary uppercase">Verified Items</p>
                                            <div className="flex flex-col gap-1 mt-1">
                                                {selectedApp.trust_snapshot.email_verified && <div className="flex items-center gap-1.5 text-xs font-medium text-green-700"><CheckCircle2 size={12} /> Email Verified</div>}
                                                {selectedApp.trust_snapshot.identity_verified && <div className="flex items-center gap-1.5 text-xs font-medium text-green-700"><CheckCircle2 size={12} /> Identity Verified</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-text-secondary uppercase">Trust Score</p>
                                            <p className="text-xs font-medium text-text-primary mt-1">
                                                {selectedApp.trust_snapshot.reviews_count} Reviews • {selectedApp.trust_snapshot.average_rating} Stars
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <h4 className="text-xs font-black text-text-tertiary uppercase tracking-widest mb-4">Intro Message</h4>
                            <div className="bg-bg-secondary p-6 rounded-2xl text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedApp.application_message.intro_message}
                            </div>
                        </div>

                        {/* Owner Actions (Only if Received & Pending) */}
                        {viewMode === 'received' && selectedApp.application.status === 'pending_review' && (
                            <div className="pt-6 border-t border-border flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => updateStatusMutation.mutate({ id: selectedApp.application.id, status: 'rejected' })}
                                >
                                    Reject Application
                                </Button>
                                <Button
                                    className="bg-brand-primary text-text-inverted"
                                    onClick={() => updateStatusMutation.mutate({ id: selectedApp.application.id, status: 'approved_meet_greet' })}
                                >
                                    Approve for Meet & Greet
                                </Button>
                            </div>
                        )}

                        {/* Applicant Actions (Withdraw) */}
                        {viewMode === 'sent' && !['withdrawn', 'rejected', 'adopted'].includes(selectedApp.application.status) && (
                            <div className="pt-6 border-t border-border flex justify-end">
                                <Button
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
                                            withdrawMutation.mutate(selectedApp.application.id);
                                        }
                                    }}
                                >
                                    Withdraw Application
                                </Button>
                            </div>
                        )}

                        {/* Owner Actions (Approved) */}
                        {viewMode === 'received' && selectedApp.application.status === 'approved_meet_greet' && (
                            <div className="pt-6 border-t border-border flex gap-3 justify-end">
                                <Button
                                    className="bg-green-600 text-white hover:bg-green-700 border-none"
                                    onClick={() => updateStatusMutation.mutate({ id: selectedApp.application.id, status: 'adopted' })}
                                >
                                    Mark as Adopted
                                </Button>
                            </div>
                        )}

                    </div>
                )}
            </SideDrawer>
        </div>
    );
};

export default MyApplicationsPage;
