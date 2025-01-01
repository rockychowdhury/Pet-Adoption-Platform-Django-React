import React from 'react';

const ButtonFillGradient = ({ children }) => {
    return (
        <div
            className="w-full font-semibold font-poppins bg-gradient-to-r from-action via-[#C6935A] to-[#D8A76E] text-white px-6 py-2 rounded-full border-2 border-transparent hover:border-[#70503E] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-action hover:to-[#70503E] text-center"
        >
            {children}
        </div>

    );
};

export default ButtonFillGradient;