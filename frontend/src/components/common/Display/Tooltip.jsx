import React from 'react';
import PropTypes from 'prop-types';

const Tooltip = ({
    children,
    content,
    position = 'top',
    className = '',
}) => {
    if (!content) return children;

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative group inline-block">
            {children}
            <div className={`
        absolute ${positions[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 
        group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50
        max-w-xs whitespace-normal text-center shadow-lg
        ${className}
      `}>
                {content}
                {/* Arrow could be added here similar to before pseudo-element */}
            </div>
        </div>
    );
};

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    className: PropTypes.string,
};

export default Tooltip;
