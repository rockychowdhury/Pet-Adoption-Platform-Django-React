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
    ...props
}, ref) => {
    let inputClasses = "auth-input";
    
    if (error) {
        inputClasses = "input-error";
    } else if (success) {
        inputClasses = "input-success";
    }

    const finalClasses = `${inputClasses} ${className}`.trim();

    return (
        <div className="w-full">
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
                aria-invalid={error ? 'true' : 'false'}
                aria-required={required ? 'true' : 'false'}
                {...props}
            />
            {error && (
                <p className="text-status-error text-sm mt-2 font-medium" role="alert">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-status-success text-sm mt-2 font-medium">
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
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    success: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
};

export default DarkInput;
