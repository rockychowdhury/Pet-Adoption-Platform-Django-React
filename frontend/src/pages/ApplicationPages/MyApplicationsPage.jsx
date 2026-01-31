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
    CheckCircle2, XCircle, Clock, Send, Inbox, Sparkles, Loader2
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

const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    if (status === 'approved_meet_greet') return 'Meet & Greet';
    return status.replace(/_/g, ' ');
};

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

    // Meet & Greet State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [meetGreetDate, setMeetGreetDate] = useState('');
    const [meetGreetTime, setMeetGreetTime] = useState('');

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
                <div className="flex items-center gap-4 min-w-[180px]">
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
                    <div className="flex items-center gap-3 min-w-[160px]">
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

        // Status Column
        columnHelper.accessor('application.status', {
            header: 'Status',
            cell: info => (
                <Badge variant={getStatusColor(info.getValue())} className="uppercase tracking-widest text-[10px] font-black px-2.5 py-1 whitespace-nowrap">
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
                <div className="flex items-center gap-2 text-text-secondary text-sm font-medium whitespace-nowrap">
                    <Calendar size={14} className="text-text-tertiary" />
                    {formatDate(info.getValue())}
                </div>
            )
        }),

        // Match Score Column (Moved to Last)
        ...(viewMode === 'received' ? [
            columnHelper.accessor('application.match_percentage', {
                header: ({ column }) => (
                    <div className="flex justify-center w-full">
                        <Button
                            variant="ghost"
                            className="p-0 hover:bg-transparent text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <Sparkles size={14} className="text-brand-ai" />
                            AI Match %
                            <ArrowUpDown size={12} />
                        </Button>
                    </div>
                ),
                cell: info => {
                    const score = info.getValue() || 0;
                    const isProcessed = info.row.original.application.ai_processed;

                    if (!isProcessed) return <div className="flex justify-center"><span className="text-xs text-text-tertiary font-medium">Processing...</span></div>;

                    const radius = 16;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (score / 100) * circumference;

                    return (
                        <div className="flex justify-center w-full">
                            <div className="relative flex items-center justify-center w-10 h-10 group cursor-help" title="AI Match Score: Based on your preferences/profile">
                                {/* SVG Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    {/* Track */}
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r={radius}
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        className="text-bg-secondary"
                                    />
                                    {/* Progress */}
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r={radius}
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="text-brand-ai transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                {/* Text overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[8px] font-black text-text-primary">{score}%</span>
                                </div>
                            </div>
                        </div>
                    );
                }
            })
        ] : []),
        // Actions Column
        columnHelper.display({
            id: 'actions',
            header: () => <div className="w-full text-right">Details</div>,
            cell: info => (
                <div className="flex justify-end">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full text-xs font-bold gap-2 hover:bg-bg-secondary border border-border bg-white shadow-sm transition-all"
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
                        <Eye size={14} />
                        View
                    </Button>
                </div>
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
        <div className="w-full space-y-6">
            {/* 1. Header & Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight font-logo">Application Manager</h1>
                    <p className="text-text-secondary font-medium mt-1">Track and manage all your rehoming activities.</p>
                </div>

                {/* Main Toggle */}
                <div className="bg-bg-surface p-1 rounded-full border border-border shadow-sm flex items-center gap-1 self-start md:self-auto">
                    <button
                        onClick={() => setSearchParams(prev => {
                            const newParams = new URLSearchParams(prev);
                            newParams.set('view', 'sent');
                            return newParams;
                        })}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'sent'
                            ? 'bg-brand-primary text-text-inverted shadow-md'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                            }`}
                    >
                        <Send size={16} /> Sent
                    </button>
                    <button
                        onClick={() => setSearchParams(prev => {
                            const newParams = new URLSearchParams(prev);
                            newParams.set('view', 'received');
                            return newParams;
                        })}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'received'
                            ? 'bg-brand-primary text-text-inverted shadow-md'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                            }`}
                    >
                        <Inbox size={16} /> Received
                    </button>
                </div>
            </div>

            {/* 2. Filter Bar */}
            <div className="bg-bg-surface rounded-2xl p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <div className="flex items-center gap-2">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'pending_review', label: 'Pending' },
                            { id: 'approved_meet_greet', label: 'Meet & Greet' },
                            { id: 'adopted', label: 'Adopted' },
                            { id: 'withdrawn', label: 'Withdrawn' },
                            { id: 'rejected', label: 'Rejected' },
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setStatusFilter(filter.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === filter.id
                                    ? 'bg-text-primary text-text-inverted shadow-md'
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
                        placeholder="Search..."
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* 3. Table */}
            <div className="bg-bg-surface rounded-3xl border border-border overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin w-8 h-8 text-brand-primary mx-auto mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest text-text-tertiary">Loading Data...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                            {viewMode === 'sent' ? <Send size={24} /> : <Inbox size={24} />}
                        </div>
                        <h3 className="text-lg font-black text-text-primary mb-2">No applications found</h3>
                        <p className="text-text-tertiary text-sm max-w-sm mx-auto">
                            {viewMode === 'sent' ? "You haven't applied for any pets yet." : "No applications received matching current filters."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#FAFAFA] border-b border-border">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-8 py-3 text-left text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-border">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-bg-secondary/40 transition-colors group cursor-pointer" onClick={() => {
                                        setSelectedApp(row.original);
                                        setIsDrawerOpen(true);
                                    }}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-8 py-4 align-middle">
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

            <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={viewMode === 'sent' ? 'Application Details' : 'Review Application'}
            >
                {selectedApp && (
                    <div className="space-y-8">
                        {/* 1. Header Card: Status & Match */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2">Current Status</span>
                                <Badge variant={getStatusColor(selectedApp.application.status)} className="w-fit px-3 py-1.5 text-xs font-black uppercase tracking-wider">
                                    {getStatusLabel(selectedApp.application.status)}
                                </Badge>
                            </div>

                            {/* Match Score (Only if received and processed) */}
                            {viewMode === 'received' && selectedApp.application.ai_processed && (
                                <div className="bg-brand-primary/5 border border-brand-primary/10 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles size={16} className="text-brand-ai" />
                                            <span className="text-[10px] font-black text-brand-ai uppercase tracking-widest">AI Match</span>
                                        </div>
                                        <p className="text-xs text-text-secondary font-medium max-w-[120px]">
                                            Based on compatibility
                                        </p>
                                    </div>
                                    <div className="relative flex items-center justify-center w-14 h-14">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-brand-primary/10" />
                                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={(2 * Math.PI * 24) - (selectedApp.application.match_percentage / 100) * (2 * Math.PI * 24)} strokeLinecap="round" className="text-brand-ai" />
                                        </svg>
                                        <span className="absolute text-sm font-black text-brand-primary">{selectedApp.application.match_percentage}%</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Applicant / Owner Profile */}
                        <div>
                            <h4 className="text-xs font-black text-text-tertiary uppercase tracking-widest mb-4">
                                {viewMode === 'sent' ? 'Listing Owner' : 'Applicant Profile'}
                            </h4>
                            <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
                                {/* Cover / Header */}
                                <div className="p-6 pb-0 flex gap-5">
                                    <div className="w-20 h-20 rounded-2xl bg-bg-secondary overflow-hidden shrink-0 border-2 border-white shadow-md">
                                        <img
                                            src={viewMode === 'sent' ? selectedApp.listing.owner?.photo_url : selectedApp.applicant.photo_url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h3 className="text-xl font-black text-text-primary">
                                            {viewMode === 'sent' ? selectedApp.listing.owner?.full_name : selectedApp.applicant.full_name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-bold text-text-tertiary mt-1">
                                            <MapPin size={12} />
                                            {viewMode === 'sent'
                                                ? `${selectedApp.listing.owner?.location?.city || 'Unknown'}, ${selectedApp.listing.owner?.location?.state || ''}`
                                                : `${selectedApp.applicant.location?.city || 'Unknown'}, ${selectedApp.applicant.location?.state || ''}`
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Stats & Verification */}
                                <div className="p-6 grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-text-tertiary uppercase mb-2">Verification</p>
                                        <div className="space-y-2">
                                            {selectedApp.trust_snapshot.email_verified && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-status-success">
                                                    <div className="p-1 bg-status-success/10 rounded-full"><CheckCircle2 size={10} /></div>
                                                    Email Verified
                                                </div>
                                            )}
                                            {selectedApp.trust_snapshot.identity_verified && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-status-success">
                                                    <div className="p-1 bg-status-success/10 rounded-full"><CheckCircle2 size={10} /></div>
                                                    Identity Verified
                                                </div>
                                            )}
                                            {!selectedApp.trust_snapshot.email_verified && !selectedApp.trust_snapshot.identity_verified && (
                                                <span className="text-xs text-text-tertiary italic">No verifications yet</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-tertiary uppercase mb-2">Trust Score</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-text-primary">{selectedApp.trust_snapshot.average_rating}</span>
                                            <span className="text-xs font-bold text-text-tertiary">/ 5.0</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-text-tertiary mt-1">{selectedApp.trust_snapshot.reviews_count} Reviews</p>
                                    </div>
                                </div>

                                {/* Bio Section - If available in backend data */}
                                {(viewMode === 'sent' ? selectedApp.listing.owner?.bio : selectedApp.applicant.bio) && (
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="p-4 bg-bg-secondary/50 rounded-xl border border-border/50">
                                            <p className="text-xs font-medium text-text-secondary italic line-clamp-3">
                                                "{viewMode === 'sent' ? selectedApp.listing.owner?.bio : selectedApp.applicant.bio}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Pet Details */}
                        <div>
                            <h4 className="text-xs font-black text-text-tertiary uppercase tracking-widest mb-4">Pet Interested In</h4>
                            <div className="bg-white border border-border p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-secondary shrink-0">
                                    <img src={selectedApp.pet.primary_photo} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-text-primary">{selectedApp.pet.name}</h3>
                                    <p className="text-xs font-bold text-text-secondary">{selectedApp.pet.breed}</p>
                                </div>
                                <div className="ml-auto">
                                    <Button variant="ghost" size="sm" className="text-brand-primary font-bold text-xs" onClick={() => navigate(`/rehoming/${selectedApp.listing.id}`)}>
                                        View Listing
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Message */}
                        <div>
                            <h4 className="text-xs font-black text-text-tertiary uppercase tracking-widest mb-4">Intro Message</h4>
                            <div className="bg-bg-surface border border-border p-6 rounded-3xl text-text-primary text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                                {selectedApp.application_message.intro_message}
                            </div>
                        </div>

                        {/* 5. Meet & Greet Info (Scheduled) */}
                        {selectedApp.application.status === 'approved_meet_greet' && selectedApp.application.owner_notes?.includes('[SCHEDULED:') && (
                            <div className="bg-green-50 border border-green-200 p-6 rounded-3xl flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-green-700 shadow-sm shrink-0">
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

                        {/* 6. Actions Area */}
                        {(viewMode === 'received' && selectedApp.application.status === 'pending_review') ||
                            (viewMode === 'sent' && !['withdrawn', 'rejected', 'adopted'].includes(selectedApp.application.status)) ||
                            (viewMode === 'received' && selectedApp.application.status === 'approved_meet_greet') ? (
                            <div className="sticky bottom-0 bg-bg-surface/95 backdrop-blur-md border-t border-border p-6 -mx-8 -mb-8 mt-8 flex justify-end gap-3 z-10">
                                {/* Owner: Review -> Reject or Approve */}
                                {viewMode === 'received' && selectedApp.application.status === 'pending_review' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="text-red-600 border-red-200 hover:bg-red-50 font-bold"
                                            onClick={() => updateStatusMutation.mutate({ id: selectedApp.application.id, status: 'rejected' })}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            className="bg-brand-primary text-text-inverted font-bold shadow-lg shadow-brand-primary/20"
                                            onClick={() => setShowScheduleModal(true)}
                                        >
                                            Approve for Meet & Greet
                                        </Button>
                                    </>
                                )}

                                {/* Owner: Meet & Greet -> Adapt */}
                                {viewMode === 'received' && selectedApp.application.status === 'approved_meet_greet' && (
                                    <Button
                                        className="bg-green-600 text-white hover:bg-green-700 border-none font-bold"
                                        onClick={() => updateStatusMutation.mutate({ id: selectedApp.application.id, status: 'adopted' })}
                                    >
                                        Mark as Adopted
                                    </Button>
                                )}

                                {/* Applicant: Withdraw */}
                                {viewMode === 'sent' && !['withdrawn', 'rejected', 'adopted'].includes(selectedApp.application.status) && (
                                    <Button
                                        variant="outline"
                                        className="text-text-tertiary hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-medium"
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to withdraw this application?")) {
                                                withdrawMutation.mutate(selectedApp.application.id);
                                            }
                                        }}
                                    >
                                        Withdraw Application
                                    </Button>
                                )}
                            </div>
                        ) : null}
                    </div>
                )}
            </SideDrawer>

            {/* Meet & Greet Schedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-text-primary tracking-tight">Schedule Meet & Greet</h3>
                            <button onClick={() => setShowScheduleModal(false)} className="text-text-tertiary hover:text-text-primary">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border-none font-medium focus:ring-2 focus:ring-brand-primary outline-none"
                                    value={meetGreetDate}
                                    onChange={(e) => setMeetGreetDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Time</label>
                                <input
                                    type="time"
                                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border-none font-medium focus:ring-2 focus:ring-brand-primary outline-none"
                                    value={meetGreetTime}
                                    onChange={(e) => setMeetGreetTime(e.target.value)}
                                />
                            </div>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium leading-relaxed">
                                <p>Once approved, the applicant will be notified of this time. You can exchange further details via contact info.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={() => setShowScheduleModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-brand-primary text-text-inverted shadow-lg shadow-brand-primary/20"
                                disabled={!meetGreetDate || !meetGreetTime}
                                onClick={() => {
                                    const combinedDateTime = new Date(`${meetGreetDate}T${meetGreetTime}`);
                                    const formattedString = `[SCHEDULED: ${combinedDateTime.toISOString()}]`;
                                    updateStatusMutation.mutate({
                                        id: selectedApp.application.id,
                                        status: 'approved_meet_greet',
                                        notes: formattedString
                                    });
                                    setShowScheduleModal(false);
                                }}
                            >
                                Confirm & Approve
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;
