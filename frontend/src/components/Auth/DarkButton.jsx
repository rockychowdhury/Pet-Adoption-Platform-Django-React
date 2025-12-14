import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

/**
 * Unified Button Component - Uses semantic color system
 * Works in both light and dark modes
 */
const DarkButton = ({
    type = 'button',
    onClick,
    disabled,
    loading,
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    let buttonClasses = "auth-button";
    
    if (variant === 'secondary') {
        buttonClasses = "btn-secondary";
    } else if (variant === 'ghost') {
        buttonClasses = "btn-ghost";
    } else if (variant === 'outline') {
        buttonClasses = "btn-outline";
    }

    const finalClasses = `${buttonClasses} ${className}`.trim();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={finalClasses}
            aria-busy={loading ? 'true' : 'false'}
            {...props}
        >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {!loading && children}
        </button>
    );
};

DarkButton.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline']),
    className: PropTypes.string,
};

export default DarkButton;
