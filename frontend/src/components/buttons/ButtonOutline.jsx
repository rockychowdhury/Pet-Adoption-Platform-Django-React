import React from 'react';

const ButtonOutline = ({children}) => {
    return (
        <div className="transition font-semibold  border-action border px-6 py-2 rounded-full hover:text-white font-poppins bg-gradient-to-r hover:from-action hover:to-purple-500">
            {children}
        </div>
    );
};

export default ButtonOutline;