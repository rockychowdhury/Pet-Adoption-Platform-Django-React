import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}) => {
    const pages = [];

    // Logic to show limited page numbers (e.g. 1, 2, ..., 5, 6, 7, ..., 10)
    // Simplified logic for now: show all if <= 7, otherwise condensed
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed text-text-primary transition-colors"
                aria-label="First page"
            >
                <ChevronsLeft size={20} />
            </button>

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed text-text-primary transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft size={20} />
            </button>

            {pages.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={typeof page !== 'number'}
                    className={`
            w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200
            ${page === currentPage
                            ? 'bg-brand-primary text-text-inverted shadow-md'
                            : typeof page === 'number'
                                ? 'text-text-primary hover:bg-bg-secondary'
                                : 'text-text-tertiary cursor-default'
                        }
          `}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed text-text-primary transition-colors"
                aria-label="Next page"
            >
                <ChevronRight size={20} />
            </button>

            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed text-text-primary transition-colors"
                aria-label="Last page"
            >
                <ChevronsRight size={20} />
            </button>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default Pagination;
