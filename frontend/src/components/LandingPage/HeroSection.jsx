import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import bannerImg from '../../assets/bannerimg.png';
import catImg from '../../assets/cat.png';
import star from '../../assets/star.png';
import stars from '../../assets/stars.png';
import { Heart, ShieldCheck, MessageCircle, Sparkles, Star } from 'lucide-react';

const HeroSection = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden font-jakarta bg-bg-primary transition-colors duration-300">

            {/* Background Split (Visual only) */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-bg-secondary z-0">
                {/* Abstract Background Shapes for Depth */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row h-full items-center min-h-screen">

                {/* Left Side */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="w-full lg:w-1/2 flex flex-col lg:space-y-8 justify-center py-12 lg:py-0 relative"
                >
                    {/* Decorative Stars Left */}
                    <motion.img
                        variants={itemVariants}
                        src={stars}
                        alt="stars"
                        className="absolute top-1/4 -left-12 w-16 h-16 opacity-30 pointer-events-none"
                        style={{ filter: 'brightness(0)' }}
                    />

                    {/* #SAVELIFE Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-surface border border-border/50 rounded-full w-fit shadow-sm mb-4"
                    >
                        <Sparkles className="text-brand-secondary fill-brand-secondary" size={16} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-text-secondary uppercase">#SAVEPETS</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl sm:text-6xl lg:text-[94px] font-black text-text-primary leading-[0.9] mb-8 font-logo tracking-tighter relative"
                    >
                        The Community <br />
                        <span className="text-brand-primary relative inline-block">
                            Driven
                        </span> Pet Network
                    </motion.h1>

                    {/* Subheading */}
                    <motion.div
                        variants={itemVariants}
                        className="mb-10 max-w-lg relative"
                    >
                        <p className="text-text-secondary text-xl font-jakarta leading-relaxed font-medium opacity-80">
                            A warm, trusted space where pet lovers meet, share stories, and save lives through the power of community.
                        </p>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-6 mb-12"
                    >
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <img
                                    key={i}
                                    className="w-14 h-14 rounded-full border-4 border-bg-surface object-cover shadow-lg"
                                    src={`https://i.pravatar.cc/100?img=${i + 20}`}
                                    alt="User"
                                />
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-brand-secondary text-brand-secondary" />
                                ))}
                            </div>
                            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">25K+ Verified Pet Lovers</p>
                        </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-5"
                    >
                        <button className="px-10 py-5 bg-brand-primary text-text-inverted rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-brand-primary/20">
                            Find a Pet
                        </button>
                        <button className="px-10 py-5 bg-bg-surface text-text-primary border border-border/60 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-bg-secondary transition-all duration-300">
                            Join Community
                        </button>
                    </motion.div>
                </motion.div>

                {/* Right Side - Refined & Static */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full lg:w-1/2 flex items-center justify-center relative h-full mt-12 lg:mt-0"
                >
                    {/* Layered Content Container */}
                    <div className="relative w-full max-w-2xl px-4 flex justify-center items-center">

                        {/* Elegant Decorative Elements (Behind) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-brand-primary/5 rounded-[100px] blur-[100px] -z-10 rotate-12"></div>

                        {/* Main Image */}
                        <div className="relative group">
                            {/* Overlay for Dark Mode contrast */}
                            <div className="absolute inset-0 bg-black/5 dark:bg-black/40 mix-blend-multiply rounded-[100px] z-20 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500"></div>

                            <motion.img
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, delay: 0.4 }}
                                src={bannerImg}
                                alt="Happy Pets"
                                className="w-full h-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] max-h-[75vh] relative z-10"
                            />
                        </div>

                        {/* Top Accent: Verified Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute -top-14 right-0 md:right-12 bg-bg-surface/90 backdrop-blur-xl p-5 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-border/50 z-20 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-500"
                        >
                            <div className="w-12 h-12 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.1em] mb-1">Safety First</p>
                                <p className="text-sm font-black text-text-primary tracking-tight">Verified Community</p>
                            </div>
                        </motion.div>

                        {/* Bottom Accent: Community Love */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="absolute -bottom-12 left-0 md:left-14 bg-bg-surface/90 backdrop-blur-xl p-5 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-border/50 z-20 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-500"
                        >
                            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                <Heart size={24} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-1">100% Love</p>
                                <p className="text-sm font-black text-text-primary tracking-tight">Direct Rehoming</p>
                            </div>
                        </motion.div>

                        {/* Decorative Star */}
                        <motion.img
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            src={star}
                            alt=""
                            className="absolute -top-12 -right-6 w-12 h-12 opacity-40 hidden md:block dark:invert transition-all duration-300"
                            style={{ filter: 'brightness(0)' }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Modern Scrolling Marquee Banner */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-10 left-0 w-full z-30 transform -rotate-1 origin-bottom-left"
            >
                <div className="bg-brand-primary text-text-inverted py-4 overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex items-center gap-12 text-[11px] font-black tracking-[0.4em] uppercase">
                                <span>COMMUNITY FIRST</span>
                                <span className="opacity-30">•</span>
                                <span>DIRECT REHOMING</span>
                                <span className="opacity-30">•</span>
                                <span>VERIFIED TRUST</span>
                                <span className="opacity-30">•</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Custom Animation Styles */}
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
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

