import React from 'react';
import PropTypes from 'prop-types';

const Radio = ({
    label,
    checked,
    onChange,
    value,
    error,
    isDisabled,
    id,
    name,
    className = '',
    ...props
}) => {
    const radioId = id || `${name}-${value}` || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`flex items-start ${className}`}>
            <div className="relative flex items-center pt-0.5">
                <input
                    id={radioId}
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    disabled={isDisabled}
                    className="peer h-5 w-5 opacity-0 absolute z-10 cursor-pointer disabled:cursor-not-allowed"
                    {...props}
                />
                <div className={`
                h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-200
                peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-brand-secondary
                ${checked ? 'border-brand-secondary' : 'bg-bg-surface border-border'}
                ${isDisabled ? 'opacity-50 bg-bg-secondary' : 'hover:border-brand-secondary'}
                ${error ? 'border-status-error' : ''}
            `}>
                    <div className={`h-2.5 w-2.5 rounded-full bg-brand-secondary transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} />
                </div>
            </div>

            {label && (
                <label
                    htmlFor={radioId}
                    className={`ml-3 text-sm font-medium leading-none cursor-pointer select-none mt-1 ${isDisabled ? 'text-text-tertiary' : 'text-text-primary'}`}
                >
                    {label}
                </label>
            )}
        </div>
    );
};

Radio.propTypes = {
    label: PropTypes.node,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    error: PropTypes.bool,
    isDisabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
};

export default Radio;
