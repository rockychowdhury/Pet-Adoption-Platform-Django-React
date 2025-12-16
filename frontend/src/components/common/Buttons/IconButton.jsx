import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import Tooltip from '../Display/Tooltip'; // Assuming we will create this later

const IconButton = ({
    icon,
    variant = 'ghost',
    size = 'md',
    isLoading = false,
    isDisabled = false,
    label,
    tooltip,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variants = {
        primary: 'bg-brand-primary text-text-inverted hover:opacity-90 shadow-sm hover:shadow-md focus:ring-brand-primary',
        secondary: 'bg-transparent border border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-text-inverted focus:ring-brand-secondary',
        danger: 'bg-status-error text-white hover:bg-red-600 shadow-sm hover:shadow-md focus:ring-status-error',
        ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary focus:ring-gray-400',
        outline: 'bg-transparent border border-border text-text-primary hover:bg-bg-secondary hover:border-border-focus focus:ring-border-focus',
        surface: 'bg-bg-surface text-text-primary shadow-sm hover:shadow-md border border-border focus:ring-gray-400'
    };

    const sizes = {
        sm: 'w-8 h-8 p-1.5',
        md: 'w-10 h-10 p-2',
        lg: 'w-12 h-12 p-2.5',
    };

    const buttonContent = (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isDisabled || isLoading}
            aria-label={label}
            {...props}
        >
            {isLoading ? <Loader2 className="animate-spin" /> : icon}
        </button>
    );

    if (tooltip) {
        // Note: Since Tooltip might not be ready, we can wrap or just return button for now.
        // For now, I'll return just the button, and the tooltip logic can be added/uncommented when Tooltip is ready.
        // However, to follow "clean design", I'll assume standard HTML title attribute for now as a fallback
        // or if Tooltip component existed I'd use it.
        return (
            <div className="relative group inline-block">
                {buttonContent}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {tooltip}
                </span>
            </div>
        )
    }

    return buttonContent;
};

IconButton.propTypes = {
    icon: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline', 'surface']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
    label: PropTypes.string.isRequired, // Accessibility requirement
    tooltip: PropTypes.string,
    className: PropTypes.string,
};

export default IconButton;
