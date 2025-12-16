import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({
    items = [], // array of content nodes
    className = '',
}) => {
    const [curr, setCurr] = useState(0);

    const prev = () => setCurr((curr) => (curr === 0 ? items.length - 1 : curr - 1));
    const next = () => setCurr((curr) => (curr === items.length - 1 ? 0 : curr + 1));

    if (!items.length) return null;

    return (
        <div className={`overflow-hidden relative group rounded-2xl ${className}`}>
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {items.map((item, i) => (
                    <div key={i} className="flex-none w-full h-full">
                        {item}
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={prev}
                    className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-lg transition-transform hover:scale-110"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={next}
                    className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-lg transition-transform hover:scale-110"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {items.map((_, i) => (
                        <div
                            key={i}
                            className={`
                transition-all w-2 h-2 bg-white rounded-full
                ${curr === i ? 'p-1.5' : 'bg-opacity-50'}
              `}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

Carousel.propTypes = {
    items: PropTypes.arrayOf(PropTypes.node).isRequired,
    className: PropTypes.string,
};

export default Carousel;
