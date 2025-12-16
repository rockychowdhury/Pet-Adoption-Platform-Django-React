import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const Select = ({
    label,
    options = [],
    error,
    helperText,
    className = '',
    placeholder = 'Select an option',
    id,
    name,
    value,
    onChange,
    isDisabled,
    ...props
}) => {
    const selectId = id || name || Math.random().toString(36).substr(2, 9);

    const baseStyles = 'w-full h-12 pl-4 pr-10 rounded-xl border bg-bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    let stateStyles = 'border-border focus:border-border-focus focus:ring-border-focus';
    if (error) {
        stateStyles = 'border-status-error focus:border-status-error focus:ring-status-error';
    }

    // Handle both array of strings and array of objects {value, label}
    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-semibold text-text-primary mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    name={name}
                    className={`${baseStyles} ${stateStyles}`}
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
                    {...props}
                >
                    <option value="" disabled className="text-text-tertiary">
                        {placeholder}
                    </option>
                    {normalizedOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                    <ChevronDown size={20} />
                </div>
            </div>

            {error && (
                <p id={`${selectId}-error`} className="mt-1.5 text-sm text-status-error font-medium">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-text-secondary">
                    {helperText}
                </p>
            )}
        </div>
    );
};

Select.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                label: PropTypes.string.isRequired
            })
        ])
    ).isRequired,
    error: PropTypes.string,
    helperText: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    isDisabled: PropTypes.bool
};

export default Select;
