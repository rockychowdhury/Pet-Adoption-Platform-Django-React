import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const Spinner = ({
    size = 'md',
    variant = 'brand', // brand, white, gray
    className = '',
    ...props
}) => {

    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const variants = {
        brand: 'text-brand-secondary',
        white: 'text-white',
        gray: 'text-text-tertiary',
        primary: 'text-brand-primary',
    };

    return (
        <div className={`flex justify-center items-center ${className}`} {...props}>
            <Loader2 className={`animate-spin ${sizes[size]} ${variants[variant]}`} />
        </div>
    );
};

Spinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    variant: PropTypes.oneOf(['brand', 'white', 'gray', 'primary']),
    className: PropTypes.string,
};

export default Spinner;
