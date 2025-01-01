import React from 'react';
import { FaCompass } from 'react-icons/fa'; // Import any icon library you prefer

const ExploreButton = () => {
    return (
        <button
            className="flex items-center bg-blue-500 text-white rounded-full p-2 pr-4 hover:pr-6 transition-all duration-300 overflow-hidden group"
            style={{ width: 'fit-content' }}
        >
            {/* Icon */}
            <FaCompass className="text-xl group-hover:mr-2 transition-all duration-300" />
            {/* Text */}
            <span className="hidden group-hover:block group-hover:ml-1 transition-all duration-1000">
                Explore Pets
            </span>
        </button>
    );
};

export default ExploreButton;
