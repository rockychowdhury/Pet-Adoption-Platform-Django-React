import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({
    children,
    variant = 'default', // success, error, warning, info, outline
    size = 'md',
    icon,
    className = '',
    ...props
}) => {

    const variants = {
        default: 'bg-bg-secondary text-text-primary',
        success: 'bg-status-success/10 text-status-success border border-status-success/20',
        error: 'bg-status-error/10 text-status-error border border-status-error/20',
        warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
        info: 'bg-status-info/10 text-status-info border border-status-info/20',
        outline: 'bg-transparent border border-border text-text-secondary',
        secondary: 'bg-text-secondary text-text-inverted',
        brand: 'bg-brand-primary text-text-inverted',
    };

    const sizes = {
        sm: 'text-[10px] px-1.5 py-0.5 rounded',
        md: 'text-xs px-2.5 py-0.5 rounded-full',
        lg: 'text-sm px-3 py-1 rounded-full',
    };

    return (
        <span
            className={`inline-flex items-center font-bold uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="mr-1.5">{icon}</span>}
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'success', 'error', 'warning', 'info', 'outline', 'secondary', 'brand']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    icon: PropTypes.node,
    className: PropTypes.string,
};

export default Badge;
