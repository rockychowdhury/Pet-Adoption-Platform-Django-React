import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
    children,
    variant = 'basic', // basic, interactive, image
    className = '',
    onClick,
    imgSrc,
    imgAlt,
    imgOverlay,
    ...props
}) => {
    const baseStyles = 'bg-bg-surface rounded-2xl border border-border shadow-soft overflow-hidden transition-all duration-300';

    const variants = {
        basic: '',
        interactive: 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-brand-secondary/30',
        image: '', // styles handled in render
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={variant === 'interactive' ? onClick : undefined}
            {...props}
        >
            {(variant === 'image' || imgSrc) && (
                <div className="relative w-full h-48 md:h-56 overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={imgAlt || 'Card image'}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {imgOverlay && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                            {imgOverlay}
                        </div>
                    )}
                </div>
            )}

            <div className="p-5 md:p-6">
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['basic', 'interactive', 'image']),
    className: PropTypes.string,
    onClick: PropTypes.func,
    imgSrc: PropTypes.string,
    imgAlt: PropTypes.string,
    imgOverlay: PropTypes.node,
};

export default Card;
