import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import bannerImg from '../../assets/bannerimg.png';
import catImg from '../../assets/cat.png';
import star from '../../assets/star.png';
import stars from '../../assets/stars.png';
import aboutImage1 from '../../assets/about1.png';
import aboutImage2 from '../../assets/about2.jpg';
import { Heart, ShieldCheck, MessageCircle, Sparkles, Star } from 'lucide-react';
import SectionCursor from '../common/SectionCursor';
import Button from '../common/Buttons/Button';

const HeroSection = () => {
    // Animation Variants
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
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
            },
        },
    };

    const revealVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section className="relative w-full min-h-screen pt-24 flex flex-col lg:flex-row overflow-hidden  bg-bg-secondary transition-colors duration-300">
            <SectionCursor label="PET NETWORK" icon={<Sparkles size={14} />} className="w-full h-full">


                {/* Content Container */}
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row h-full items-center flex-1 py-12 lg:py-0">

                    {/* Left Side */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="w-full lg:w-1/2 flex-1 flex flex-col lg:space-y-8 justify-center py-12 lg:py-0 relative"
                    >
                        {/* Decorative Stars Left */}
                        <motion.img
                            variants={itemVariants}
                            src={stars}
                            alt="stars"
                            className="absolute top-1/4 -left-12 w-16 h-16 opacity-30 pointer-events-none"
                            style={{ filter: 'brightness(0)' }}
                        />

                        {/* Main Heading */}
                        <motion.div
                            variants={revealVariants}
                            className="mb-8"
                        >
                            <motion.h1
                                variants={itemVariants}
                                className="text-display-xl font-black text-text-primary relative"
                            >
                                Safe Rehoming & <br />
                                <span className="text-brand-primary relative inline-block">
                                    Verified
                                </span> Pet <br /> Care
                            </motion.h1>
                        </motion.div>

                        {/* Subheading */}
                        <motion.div
                            variants={itemVariants}
                            className="mb-10 max-w-lg relative"
                        >
                            <p className="text-text-secondary text-xl  leading-relaxed font-medium opacity-80">
                                The trusted platform for responsible rehoming and connecting with verified foster carers and veterinary clinics.
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
                            <Link to="/pets">
                                <Button variant="primary" size="lg" className="rounded-full px-10 py-5 h-auto text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20">
                                    Find a Pet
                                </Button>
                            </Link>
                            <Link to="/services">
                                <Button variant="outline" size="lg" className="rounded-full px-10 py-5 h-auto text-xs uppercase tracking-[0.2em] bg-bg-surface border-border/60 hover:bg-bg-secondary">
                                    Find Services
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Layered Image Layout */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="w-full lg:w-1/2 flex-1 flex items-center justify-center relative mt-12 lg:mt-0"
                    >
                        {/* Layered Content Container - Trusting children for height */}
                        <div className="relative w-full max-w-2xl px-4 flex justify-center items-center">

                            {/* Elegant Decorative Elements (Behind) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-brand-primary/5 rounded-[100px] blur-[100px] -z-10 rotate-12"></div>

                            {/* Images Layout Container */}
                            <div className="relative h-[500px] lg:h-[600px] w-full">
                                {/* Main Image */}
                                <motion.div
                                    variants={itemVariants}
                                    className="absolute top-20 right-20 w-[80%] h-[80%] rounded-[2.5rem] overflow-hidden  z-0"
                                >
                                    {/* Overlay for Dark Mode contrast */}
                                    <div className="absolute inset-0 bg-black/5 dark:bg-black/40 mix-blend-multiply z-20 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
                                    <img
                                        src={aboutImage1}
                                        alt="Dog running"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Overlapping Image (Bottom Right) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="absolute -bottom-10 right-0 w-[40%] h-[40%] rounded-[2rem] overflow-hidden shadow-2xl border-[12px] border-bg-secondary z-10"
                                >
                                    <img
                                        src={aboutImage2}
                                        alt="Puppy detail"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </div>

                            {/* Decorative Star */}
                            <motion.img
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                src={star}
                                alt=""
                                className="absolute top-0 right-0 w-12 h-12 opacity-40 hidden md:block dark:invert transition-all duration-300 z-20"
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
                                    <span>RESPONSIBLE REHOMING</span>
                                    <span className="opacity-30">•</span>
                                    <span>VERIFIED PROVIDERS</span>
                                    <span className="opacity-30">•</span>
                                    <span>TRUSTED CARE</span>
                                    <span className="opacity-30">•</span>
                                    <span>SAFETY FIRST</span>
                                    <span className="opacity-30">•</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </SectionCursor>

        </section>
    );
};

export default HeroSection;

