
import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Archive,
    Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HistoryTable = ({ data }) => {
    const columns = useMemo(
        () => [
            {
                header: 'Pet Name',
                accessorKey: 'pet.name',
                cell: (info) => (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                            <img
                                src={info.row.original.pet?.main_photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'}
                                alt={info.getValue()}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="font-bold text-gray-900">{info.getValue()}</span>
                    </div>
                ),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (info) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${info.getValue() === 'listing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                        {info.getValue()}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (info) => {
                    const status = info.getValue();
                    let colorClass = 'bg-gray-100 text-gray-700';
                    let Icon = AlertCircle;

                    switch (status) {
                        case 'rehomed':
                        case 'adopted':
                            colorClass = 'bg-green-100 text-green-700';
                            Icon = Heart;
                            break;
                        case 'closed':
                            colorClass = 'bg-gray-200 text-gray-800';
                            Icon = Archive;
                            break;
                        case 'cancelled':
                        case 'expired':
                            colorClass = 'bg-red-100 text-red-700';
                            Icon = XCircle;
                            break;
                        default:
                            Icon = CheckCircle2;
                    }

                    return (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${colorClass}`}>
                            <Icon size={12} />
                            <span className="text-xs font-bold capitalize">{status.replace('_', ' ')}</span>
                        </div>
                    )
                },
            },
            {
                header: 'Last Updated',
                accessorFn: (row) => row.updated_at || row.created_at,
                cell: (info) => (
                    <span className="text-gray-500 text-sm font-medium">
                        {new Date(info.getValue()).toLocaleDateString()}
                    </span>
                )
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (info) => {
                    const item = info.row.original;
                    const link = item.type === 'listing' ? `/pets/${item.id}` : '#';
                    return (
                        <Link
                            to={link}
                            className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-full transition-colors"
                        >
                            <Eye size={18} />
                        </Link>
                    )
                }
            }
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    if (!data?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                    <Archive size={20} />
                </div>
                <p className="text-gray-500 font-medium">No history items found.</p>
            </div>
        )
    }

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="text-sm text-gray-500 font-medium">
                        Part {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-gray-600"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-gray-600"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryTable;
