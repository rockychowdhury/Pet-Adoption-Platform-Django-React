import React from 'react';

const BookingStatusBadge = ({ status }) => {
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'confirmed':
            case 'accepted':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'cancelled':
            case 'rejected':
            case 'declined':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(status)}`}>
            {status || 'Unknown'}
        </span>
    );
};

export default BookingStatusBadge;
