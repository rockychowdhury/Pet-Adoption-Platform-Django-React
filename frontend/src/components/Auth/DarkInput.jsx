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
        inputClasses += " border border-status-error bg-status-error/10 text-status-error placeholder-status-error/50 focus:ring-1 focus:ring-status-error";
    } else {
        inputClasses += " border border-border bg-bg-surface text-text-primary placeholder-text-tertiary focus:bg-bg-surface focus:border-brand-primary focus:ring-1 focus:ring-brand-primary";
    }

    const finalClasses = `${inputClasses} ${className}`.trim();

    return (
        <div className="w-full relative">
            {startIcon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-text-tertiary">
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
                <p className="text-status-success text-xs mt-1.5 font-medium">
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
