import React from 'react';

const ButtonOutline = ({children}) => {
    return (
        <div className="transition-all font-semibold  border-action border px-6 py-2 rounded-full hover:text-white font-poppins bg-gradient-to-r hover:from-action hover:via-action hover:to-action_dark transform hover:scale-105 duration-300">
            {children}
        </div>
    );
};

export default ButtonOutline;