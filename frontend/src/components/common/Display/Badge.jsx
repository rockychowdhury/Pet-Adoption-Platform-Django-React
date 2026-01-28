import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({
    label,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-full whitespace-nowrap transition-colors';

    const variants = {
        primary: 'bg-brand-primary/10 text-brand-primary',
        secondary: 'bg-brand-secondary/10 text-brand-secondary',
        success: 'bg-status-success/10 text-status-success',
        error: 'bg-status-error/10 text-status-error',
        warning: 'bg-status-warning/10 text-status-warning',
        info: 'bg-status-info/10 text-status-info',
        neutral: 'bg-text-secondary/10 text-text-secondary',
        outline: 'bg-transparent border border-current'
    };

    // Mapping semantic names to visual styles if needed
    const variantStyles = variants[variant] || variants.primary;

    const sizes = {
        sm: 'text-[10px] px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
        lg: 'text-sm px-3 py-1.5 gap-2',
    };

    return (
        <span
            className={`${baseStyles} ${variantStyles} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {label}
        </span>
    );
};

Badge.propTypes = {
    label: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info', 'neutral', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    icon: PropTypes.node,
    className: PropTypes.string,
};

export default Badge;
