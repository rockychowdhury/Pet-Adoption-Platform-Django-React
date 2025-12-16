import React from 'react';
import PropTypes from 'prop-types';

const Switch = ({
    label,
    checked,
    onChange,
    isDisabled,
    id,
    name,
    className = '',
    size = 'md',
    ...props
}) => {
    const switchId = id || name || Math.random().toString(36).substr(2, 9);

    const sizes = {
        sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
        md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
        lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
    };

    const currentSize = sizes[size] || sizes.md;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Toggle Switch */}
            <div className="relative inline-flex items-center">
                <input
                    id={switchId}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    disabled={isDisabled}
                    className="peer sr-only"
                    {...props}
                />
                <div className={`
                ${currentSize.track} bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-secondary/50 
                rounded-full peer dark:bg-gray-700 peer-checked:after:${currentSize.translate} peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                after:border-gray-300 after:border after:rounded-full after:transition-all 
                ${currentSize.thumb} peer-checked:bg-brand-secondary
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}></div>
            </div>

            {/* Label */}
            {label && (
                <label
                    htmlFor={switchId}
                    className={`text-sm font-medium ${isDisabled ? 'text-text-tertiary' : 'text-text-primary'} cursor-pointer select-none`}
                >
                    {label}
                </label>
            )}
        </div>
    );
};

Switch.propTypes = {
    label: PropTypes.node,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    isDisabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Switch;
