import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react';

const Rating = ({
    value = 0, // 0 to 5
    max = 5,
    onChange, // if provided, component is interactive
    readOnly = false,
    size = 'md',
    showText = false,
    className = '',
}) => {
    const [hoverValue, setHoverValue] = useState(0);

    const sizes = {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
    };

    const iconSize = sizes[size] || sizes.md;

    const handleMouseEnter = (index) => {
        if (!readOnly && onChange) {
            setHoverValue(index);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly && onChange) {
            setHoverValue(0);
        }
    };

    const handleClick = (index) => {
        if (!readOnly && onChange) {
            onChange(index);
        }
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[...Array(max)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = (hoverValue || value) >= starValue;
                const isHalf = !isFilled && (value > index && value < index + 1); // Simple half-star logic if desired, for now pure integer logic for input, visual maybe float

                return (
                    <button
                        key={index}
                        type="button"
                        className={`transition-colors duration-200 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starValue)}
                        disabled={readOnly}
                        aria-label={`Rate ${starValue} stars`}
                    >
                        <Star
                            size={iconSize}
                            className={`${isFilled ? 'fill-status-warning text-status-warning' : 'fill-transparent text-gray-300'}`}
                        />
                    </button>
                );
            })}

            {showText && <span className="ml-2 text-sm font-medium text-text-secondary">({value})</span>}
        </div>
    );
};

Rating.propTypes = {
    value: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    showText: PropTypes.bool,
    className: PropTypes.string,
};

export default Rating;
