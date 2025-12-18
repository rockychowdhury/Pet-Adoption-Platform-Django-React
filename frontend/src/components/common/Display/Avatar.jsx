import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
    src,
    alt = 'User',
    initials,
    size = 'md',
    status, // online, offline, busy
    className = '',
    ...props
}) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-base',
        xl: 'w-20 h-20 text-xl',
    };

    const statusColors = {
        online: 'bg-status-success',
        offline: 'bg-gray-400',
        busy: 'bg-status-error',
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className={`relative inline-block rounded-full ${className}`} {...props}>
            <div className={`relative overflow-hidden rounded-full ${sizes[size]} bg-brand-primary text-text-inverted flex items-center justify-center font-bold border-2 border-bg-surface shadow-sm`}>
                {src ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <span>{initials || getInitials(alt)}</span>
                )}
            </div>

            {status && (
                <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white transform translate-y-1/4 translate-x-1/4 ${statusColors[status] || 'bg-gray-400'}`} />
            )}
        </div>
    );
};

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    initials: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    status: PropTypes.oneOf(['online', 'offline', 'busy']),
    className: PropTypes.string,
};

export default Avatar;
