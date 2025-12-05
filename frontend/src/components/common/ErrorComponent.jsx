import React from 'react';
import { Link } from 'react-router';
import { AlertTriangle } from 'lucide-react';

const ErrorComponent = ({ message = "Something went wrong.", code = "404" }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
            <div className="bg-red-50 p-6 rounded-full mb-6 animate-bounce">
                <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h1 className="text-6xl font-bold text-natural mb-4 font-logo">{code}</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! {message}</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                We couldn't find the page you were looking for or an unexpected error occurred.
            </p>
            <Link
                to="/"
                className="px-8 py-3 bg-action text-white rounded-full font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorComponent;
