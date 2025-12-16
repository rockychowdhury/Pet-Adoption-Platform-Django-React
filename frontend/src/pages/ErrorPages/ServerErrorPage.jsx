import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';
import serverErrorImage from '../../assets/500.jpg';
import Logo from '../../components/common/Logo';

const ServerErrorPage = () => {
    const navigate = useNavigate();

    const handleTryAgain = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#FFF8E7] flex flex-col font-inter relative overflow-hidden">
            {/* Simplified Header */}
            <header className="px-6 py-6 md:px-12 flex justify-between items-center z-20">
                <Link to="/">
                    <Logo />
                </Link>
                <Link to="/" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
                    Back to Home
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative text-center -mt-20">

                {/* Background 500 Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-bold text-[#E8DFD0] select-none pointer-events-none z-0">
                    500
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">

                    {/* Image Section */}
                    <div className="relative mb-8">
                        <div className="w-64 h-48 md:w-80 md:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src={serverErrorImage}
                                alt="Something went wrong"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Error Badge */}
                        <div className="absolute -top-6 -left-6 w-14 h-14 md:w-16 md:h-16 bg-[#EF4444] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#FFF8E7] animate-bounce-slow">
                            <AlertTriangle size={28} strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Text Content */}
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-serif">
                        Something Went Wrong
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-md">
                        We're working on fixing this issue. Please bear with us!
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={handleTryAgain}
                            className="w-full sm:w-auto px-8 py-3 bg-[#2D2D2D] text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <RefreshCcw size={18} />
                            Try Again
                        </button>
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-[#E5E7EB] text-text-primary rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#F3F4F6] hover:border-[#D1D5DB] transition-all"
                        >
                            Go to Homepage
                        </Link>
                    </div>

                    {/* Support Link */}
                    <p className="mt-12 text-sm text-[#9CA3AF]">
                        If the problem persists, please <Link to="/contact" className="underline hover:text-text-primary transition-colors">contact support</Link>.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ServerErrorPage;
