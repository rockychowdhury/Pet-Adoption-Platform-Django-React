import React from 'react';
import { Link } from 'react-router';
import bannerImg from '../../assets/bannerimg.png';
import catImg from '../../assets/cat.png';
import star from '../../assets/star.png';
import stars from '../../assets/stars.png';
import { Heart, ShieldCheck, MessageCircle } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden font-inter bg-[#FFF8E7]">

            {/* Background Split (Visual only) */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-[#FDE4C3] z-0">
                {/* Abstract Background Shapes for Depth */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 flex flex-col lg:flex-row h-full items-center min-h-screen">

                {/* Left Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-0 relative">
                    {/* Decorative Stars Left */}
                    <img src={star} alt="star" className="absolute -top-10 left-10 w-8 h-8 opacity-60 animate-pulse" style={{ filter: 'brightness(0)' }} />
                    <img src={stars} alt="stars" className="absolute top-1/4 -left-12 w-16 h-16 opacity-40" style={{ filter: 'brightness(0)' }} />

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2D2D2D] leading-[1.1] mb-6 font-logo tracking-tight relative">
                        Find Your Perfect <br />
                        Pet <span className="text-[#A68A6D] relative inline-block">
                            Companion
                            <img src={star} alt="star" className="absolute -top-6 -right-8 w-10 h-10 animate-spin-slow" style={{ filter: 'brightness(0)' }} />
                        </span> <br />
                        Today
                    </h1>

                    {/* Subheading */}
                    <div className="mb-10 max-w-md relative">
                        <p className="text-sm font-semibold text-gray-500 mb-2">#SaveALife</p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Thousands of pets waiting for a loving home. Start your adoption journey now.
                        </p>
                        <img src={star} alt="star" className="absolute bottom-0 -right-10 w-6 h-6 opacity-50" style={{ filter: 'brightness(0)' }} />
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="flex -space-x-4">
                            <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="User" />
                            <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80" alt="User" />
                            <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=80" alt="User" />
                        </div>
                        <div>
                            <p className="font-bold text-[#2D2D2D] text-lg">15M+</p>
                            <p className="text-xs text-gray-500">Active Shelters <br /> across the world</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4">
                        <Link to="/pets" className="px-8 py-4 bg-[#2D2D2D] text-white rounded-full font-bold hover:bg-black transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                            Adopt Now
                        </Link>
                        <Link to="/register" className="px-8 py-4 bg-transparent border-2 border-[#2D2D2D] text-[#2D2D2D] rounded-full font-bold hover:bg-[#2D2D2D] hover:text-white transition">
                            Join Us
                        </Link>
                    </div>
                </div>

                {/* Right Side - Enhanced with Depth */}
                <div className="w-full lg:w-1/2 flex items-center justify-center relative h-full perspective-1000">
                    {/* Floating Stars Right */}
                    <img src={star} alt="star" className="absolute top-20 right-10 w-12 h-12 animate-bounce z-0" style={{ filter: 'brightness(0)' }} />
                    <img src={stars} alt="stars" className="absolute bottom-40 left-0 w-20 h-20 opacity-30 z-0" style={{ filter: 'brightness(0)' }} />

                    {/* Main Image Container with Layering */}
                    <div className="relative z-20 w-full max-w-2xl px-4 flex justify-center items-center">

                        {/* Layer 3: Floating Glass Card 1 (Top Right) - BEHIND Image */}
                        <div className="absolute top-10 right-4 md:right-0 bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 animate-float z-0 max-w-[160px] transform translate-x-1/2">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-full text-green-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-xs font-bold text-gray-700">Verified</span>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-tight">All pets are vaccinated and health checked.</p>
                        </div>

                        {/* Layer 1: Main Banner Image */}
                        <img
                            src={bannerImg}
                            alt="Happy Pets"
                            className="w-full h-auto object-contain drop-shadow-2xl max-h-[75vh] relative z-10"
                        />

                        {/* Layer 4: Floating Glass Card 2 (Bottom Right) - IN FRONT OF Image */}
                        <div className="absolute bottom-20 right-0 md:-right-8 bg-white/60 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 animate-float-delayed z-30 flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full text-red-500">
                                <Heart size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">100% Love</p>
                                <p className="text-[10px] text-gray-500">Guaranteed happiness</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modern Scrolling Marquee Banner */}
            <div className="absolute bottom-8 left-0 w-full z-30 transform -rotate-1 origin-bottom-left">
                <div className="bg-[#2D2D2D] text-[#FFF8E7] py-4 overflow-hidden shadow-2xl border-y border-white/10">
                    <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 text-sm sm:text-base font-bold tracking-[0.2em] uppercase opacity-90">
                                <span>Adopt A Pet</span>
                                <span className="text-[#A68A6D]">●</span>
                                <span>Save A Life</span>
                                <span className="text-[#A68A6D]">●</span>
                                <span>Find Love</span>
                                <span className="text-[#A68A6D]">●</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 10s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 6s ease-in-out infinite 3s;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
