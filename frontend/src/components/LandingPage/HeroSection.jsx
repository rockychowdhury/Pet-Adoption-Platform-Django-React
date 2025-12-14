import React from 'react';
import { Link } from 'react-router';
import bannerImg from '../../assets/bannerimg.png';
import catImg from '../../assets/cat.png';
import star from '../../assets/star.png';
import stars from '../../assets/stars.png';
import { Heart, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden font-inter bg-bg-primary transition-colors duration-300">

            {/* Background Split (Visual only) */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-bg-secondary z-0">
                {/* Abstract Background Shapes for Depth */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-bg-secondary/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 flex flex-col lg:flex-row h-full items-center min-h-screen">

                {/* Left Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-0 relative">
                    {/* Decorative Stars Left */}
                    <img src={stars} alt="stars" className="absolute top-1/4 -left-12 w-16 h-16 opacity-40" style={{ filter: 'brightness(0)' }} />


                    {/* #SAVELIFE Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full w-fit shadow-sm mb-6">
                        <Sparkles className="text-brand-secondary fill-brand-secondary" size={20} />
                        <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">#SAVELIFE</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] mb-6 font-logo tracking-tight relative">
                        Find Your Perfect <br />
                        Pet <span className="text-brand-secondary relative inline-block">
                            Companion
                        </span> <br />
                        Today
                    </h1>

                    {/* Subheading */}
                    <div className="mb-10 max-w-md relative">
                        <p className="text-text-secondary text-lg leading-relaxed">
                            Thousands of pets waiting for a loving home. Start your adoption journey now.
                        </p>
                        <img src={star} alt="star" className="absolute bottom-0 -right-10 w-6 h-6 opacity-50" style={{ filter: 'brightness(0)' }} />
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="flex -space-x-4">
                            <img className="w-12 h-12 rounded-full border-2 border-bg-surface object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="User" />
                            <img className="w-12 h-12 rounded-full border-2 border-bg-surface object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80" alt="User" />
                            <img className="w-12 h-12 rounded-full border-2 border-bg-surface object-cover" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=80" alt="User" />
                        </div>
                        <div>
                            <p className="font-bold text-text-primary text-lg">15M+</p>
                            <p className="text-xs text-text-secondary">Active Shelters <br /> across the world</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4">
                        <button className="btn-primary px-8 py-4 rounded-full">
                            Adopt Now
                        </button>
                        <button className="btn-outline px-8 py-4 rounded-full">
                            Join Us
                        </button>
                    </div>
                </div>

                {/* Right Side - Enhanced with Depth */}
                <div className="w-full lg:w-1/2 flex items-center justify-center relative h-full perspective-1000">
                    {/* Floating Stars Right */}
                    <img src={star} alt="star" className="absolute -top-0 -right-5 w-10 h-10 animate-spin-slow" style={{ filter: 'brightness(0)' }} />
                    <img src={stars} alt="stars" className="absolute bottom-40 left-0 w-20 h-20 opacity-30 z-0" style={{ filter: 'brightness(0)' }} />

                    {/* Main Image Container with Layering */}
                    <div className="relative z-20 w-full max-w-2xl px-4 flex justify-center items-center">

                        {/* Layer 3: Floating Glass Card 1 (Top Right) - BEHIND Image */}
                        <div className="absolute top-5 right-4 md:right-0 bg-white/95 backdrop-blur-md p-4 rounded-full shadow-lg border border-white/20 animate-float z-0 transform translate-x-1/2 flex items-center gap-2">
                            <div className="w-4 h-4 bg-brand-secondary rounded-full flex items-center justify-center">
                                <ShieldCheck size={12} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-secondary">Verified owners & listings</span>
                            </div>
                        </div>

                        {/* Layer 1: Main Banner Image */}
                        <img
                            src={bannerImg}
                            alt="Happy Pets"
                            className="w-full h-auto object-contain drop-shadow-2xl max-h-[75vh] relative z-10"
                        />

                        {/* Layer 4: Floating Glass Card 2 (Bottom Right) - IN FRONT OF Image */}
                        <div className="absolute bottom-10 right-0 md:-right-6 bg-white p-4 rounded-2xl shadow-soft border border-border animate-float-delayed z-30 flex items-center gap-3">
                            <div className="bg-brand-secondary/10 p-2.5 rounded-full text-brand-secondary">
                                <Heart size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">100% Love</p>
                                <p className="text-sm font-bold text-text-primary">Guaranteed</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modern Scrolling Marquee Banner */}
            <div className="absolute bottom-8 left-0 w-full z-30 transform -rotate-1 origin-bottom-left">
                <div className="bg-brand-primary text-text-inverted py-3 overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 text-sm md:text-base font-bold tracking-widest uppercase">
                                <span>ADOPT A PET • SAVE A LIFE • FIND LOVE</span>
                                <span>•</span>
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
