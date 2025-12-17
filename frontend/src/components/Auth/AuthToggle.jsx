import React from 'react';
import { User, LogIn } from 'lucide-react';

const AuthToggle = ({ mode, onToggle }) => {
    return (
        <div className="bg-gray-100 p-1.5 rounded-full flex relative w-max mx-auto mb-8 shadow-inner border border-gray-200">
            <button
                type="button"
                onClick={() => onToggle('register')}
                className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === 'register'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                <User size={18} />
                Sign Up
            </button>
            <button
                type="button"
                onClick={() => onToggle('login')}
                className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === 'login'
                        ? 'text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                <LogIn size={18} />
                Sign In
            </button>

            {/* Sliding Background */}
            <div
                className={`absolute top-1.5 bottom-1.5 rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${mode === 'login'
                        ? 'left-[50%] right-1.5 bg-gray-900'
                        : 'left-1.5 right-[50%] bg-white border border-gray-100'
                    }`}
            />
        </div>
    );
};

export default AuthToggle;
