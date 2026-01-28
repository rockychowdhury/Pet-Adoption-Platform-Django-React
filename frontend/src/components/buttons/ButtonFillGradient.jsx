import React from 'react';

const ButtonFillGradient = ({ children }) => {
    return (
        <div
            className="w-full font-semibold  bg-gradient-to-r from-action  to-[#D8A76E] text-white px-6 py-2 rounded-full border-2 border-secondary shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-action hover:to-action_dark text-center"
        >
            {children}
        </div>

    );
};

export default ButtonFillGradient;