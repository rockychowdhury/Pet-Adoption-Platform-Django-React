import React from 'react';
import PropTypes from 'prop-types';

const Textarea = ({
    label,
    placeholder,
    error,
    helperText,
    className = '',
    rows = 4,
    maxLength,
    value,
    onChange,
    id,
    name,
    ...props
}) => {
    const inputId = id || name || Math.random().toString(36).substr(2, 9);

    const baseStyles = 'w-full p-4 rounded-xl border bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px]';

    let stateStyles = 'border-border focus:border-border-focus focus:ring-border-focus';
    if (error) {
        stateStyles = 'border-status-error focus:border-status-error focus:ring-status-error';
    }

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="flex justify-between mb-2">
                    <label htmlFor={inputId} className="block text-sm font-semibold text-text-primary">
                        {label}
                    </label>
                </div>
            )}

            <div className="relative">
                <textarea
                    id={inputId}
                    name={name}
                    className={`${baseStyles} ${stateStyles}`}
                    placeholder={placeholder}
                    rows={rows}
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />

                {maxLength && (
                    <div className="absolute bottom-3 right-3 text-xs text-text-tertiary bg-bg-surface/80 px-1 rounded">
                        {(value?.length || 0)}/{maxLength}
                    </div>
                )}
            </div>

            {error && (
                <p id={`${inputId}-error`} className="mt-1.5 text-sm text-status-error font-medium">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-text-secondary">
                    {helperText}
                </p>
            )}
        </div>
    );
};

Textarea.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    helperText: PropTypes.string,
    className: PropTypes.string,
    rows: PropTypes.number,
    maxLength: PropTypes.number,
    value: PropTypes.string,
    onChange: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string,
};

export default Textarea;
