import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({
    columns = [],
    data = [],
    isLoading,
    emptyMessage = 'No data available',
    className = '',
    // Pagination Props
    pagination,
    onPageChange,
    currentPage = 1,
    totalPages = 1,
}) => {
    if (isLoading) {
        return (
            <div className="w-full bg-bg-surface rounded-2xl border border-border p-8 text-center animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 mx-auto"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>)}
                </div>
            </div>
        );
    }

    if (!data?.length) {
        return (
            <div className="w-full bg-bg-surface rounded-2xl border border-border p-12 text-center text-text-secondary">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`w-full overflow-hidden bg-bg-surface rounded-2xl border border-border shadow-soft ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-bg-secondary/50">
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 text-sm font-semibold text-text-secondary whitespace-nowrap">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-bg-secondary/30 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="p-4 text-sm text-text-primary align-middle">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {(pagination || totalPages > 1) && (
                <div className="border-t border-border p-4 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-text-primary"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-text-primary"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.node.isRequired,
        accessor: PropTypes.string, // key in data object
        render: PropTypes.func, // (row) => node
    })).isRequired,
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    emptyMessage: PropTypes.string,
    className: PropTypes.string,
    pagination: PropTypes.bool,
    onPageChange: PropTypes.func,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
};

export default Table;
