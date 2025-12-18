import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    isDisabled = false,
    leftIcon,
    rightIcon,
    children,
    type = 'button',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const variants = {
        primary: 'bg-brand-primary text-text-inverted hover:opacity-90 shadow-md hover:shadow-lg focus:ring-brand-primary',
        secondary: 'bg-transparent border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-text-inverted focus:ring-brand-secondary',
        danger: 'bg-status-error text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-status-error',
        text: 'bg-transparent text-text-primary hover:bg-bg-secondary hover:underline focus:ring-gray-400',
        ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary focus:ring-gray-400',
        outline: 'bg-transparent border-2 border-border text-text-primary hover:bg-bg-secondary hover:border-border-focus focus:ring-border-focus'
    };

    const sizes = {
        sm: 'h-9 px-3 text-sm rounded-lg',
        md: 'h-12 px-6 text-base rounded-xl',
        lg: 'h-14 px-8 text-lg rounded-2xl',
    };

    const loadingIcon = <Loader2 className="animate-spin mr-2" size={size === 'sm' ? 16 : 20} />;

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isDisabled || isLoading}
            {...props}
        >
            {isLoading && loadingIcon}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'text', 'ghost', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Button;
