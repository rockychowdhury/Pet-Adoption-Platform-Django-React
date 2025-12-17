import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Unified Input Component - Uses semantic color system
 * Works in both light and dark modes
 */
const DarkInput = forwardRef(({
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    success,
    disabled,
    required,
    className = '',
    startIcon,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    // Base classes
    let inputClasses = "w-full py-3 rounded-xl outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    // Icon padding
    if (startIcon) {
        inputClasses += " pl-11 pr-4";
    } else {
        inputClasses += " px-4";
    }

    // Standard Border Logic
    if (error) {
        inputClasses += " border border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-1 focus:ring-red-500";
    } else {
        inputClasses += " border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900";
    }

    const finalClasses = `${inputClasses} ${className}`.trim();

    return (
        <div className="w-full relative">
            {startIcon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-gray-400">
                    {startIcon}
                </div>
            )}
            <input
                ref={ref}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={finalClasses}
                onFocus={(e) => {
                    setIsFocused(true);
                    if (props.onFocus) props.onFocus(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    if (props.onBlur) props.onBlur(e);
                }}
                aria-invalid={error ? 'true' : 'false'}
                aria-required={required ? 'true' : 'false'}
                {...props}
            />

            {success && (
                <p className="text-green-600 text-xs mt-1.5 font-medium">
                    {success}
                </p>
            )}
        </div>
    );
});

DarkInput.displayName = 'DarkInput';

DarkInput.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    success: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
    passwordStrength: PropTypes.string,
    startIcon: PropTypes.node,
};

export default DarkInput;
