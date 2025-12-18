import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
    Search, UserPlus, Send, MessageCircle, Users, Home, PartyPopper,
    ClipboardCheck, FileText, ShieldCheck, FolderOpen, HeartHandshake,
    CheckCircle, Clock, MapPin, FileSignature, ArrowRight, Sparkles
} from 'lucide-react';

import star from '../../assets/star.png';
import stars from '../../assets/stars.png';

const HowItWorks = () => {
    const rehomingRef = useRef(null);

    // Scroll Progress for Timeline
    const { scrollYProgress } = useScroll({
        target: rehomingRef,
        offset: ["start 70%", "end 70%"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardReveal = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const rehomingSteps = [
        {
            step: "Step 01",
            title: "Assessment",
            icon: <ClipboardCheck size={24} />,
            description: "We'll help you explore all options first. If rehoming is necessary, we'll guide you through a pre-rehoming assessment to understand your situation.",
            badge: "~15 mins",
            badgeIcon: <Clock size={14} />,
            footer: "Resource check"
        },
        {
            step: "Step 02",
            title: "Pet Listing",
            icon: <FileText size={24} />,
            description: "Share your pet's story, personality, photos, and medical history. The more details you provide, the better the match.",
            badge: "~30 mins",
            badgeIcon: <Clock size={14} />,
            footer: "Medical records"
        },
        {
            step: "Step 03",
            title: "Listing Review",
            icon: <ShieldCheck size={24} />,
            description: "Our team reviews every listing to ensure quality, safety, and completeness before it goes live to our community.",
            badge: "24-48 hours",
            badgeIcon: <Clock size={14} />,
            footer: null
        },
        {
            step: "Step 04",
            title: "Review Applications",
            icon: <FolderOpen size={24} />,
            description: "Potential adopters will apply with detailed profiles. You review them and choose the best match for your pet's specific needs.",
            badge: "Varies",
            badgeIcon: <Users size={14} />,
            footer: null
        },
        {
            step: "Step 05",
            title: "Meet & Greet",
            icon: <HeartHandshake size={24} />,
            description: "Meet approved applicants in person in a safe, public place. See how they interact with your pet before making a decision.",
            badge: "In-person",
            badgeIcon: <MapPin size={14} />,
            footer: "Safety guide"
        },
        {
            step: "Step 06",
            title: "Final Adoption",
            icon: <CheckCircle size={24} />,
            description: "Sign the rehoming agreement and transfer ownership. We provide all the necessary digital documentation.",
            badge: "Final Step",
            badgeIcon: <FileSignature size={14} />,
            footer: null
        }
    ];

    const faqs = [
        {
            question: "Is there an adoption fee?",
            answer: "Yes, most rehomers ask for a small rehoming fee. This covers basic medical costs and ensures the adopter is serious. Our platform charges a small service fee to cover verification and hosting."
        },
        {
            question: "How do you verify users?",
            answer: "We use a multi-step identity verification process. Users must provide valid ID and pass our background checks before they can post a listing or submit an adoption application."
        },
        {
            question: "What if the adoption doesn't work out?",
            answer: "Our adoption agreement includes a return policy clause. Most owners agree to take the pet back within a certain window if it's not a match, ensuring the pet always has a safe place."
        }
    ];

    return (
        <section className="py-24 bg-bg-primary relative overflow-hidden font-jakarta">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* --- Rehoming Section --- */}
                <div className="mb-48" ref={rehomingRef}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20 relative"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border/50 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                            <ShieldCheck size={12} className="fill-current" />
                            Owner Journey
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-text-primary mb-8 font-logo tracking-tight relative inline-block">
                            Rehoming Your <span className="text-brand-primary">Pet</span>
                        </h2>
                        <p className="text-text-secondary dark:text-text-secondary/90 text-lg max-w-2xl mx-auto font-medium opacity-80 decoration-brand-primary/30">
                            A guided process designed to ensure your pet's future is filled with love and stability.
                        </p>
                    </motion.div>

                    <div className="relative max-w-6xl mx-auto">
                        {/* Desktop Timeline Line */}
                        <div className="absolute left-1/2 top-4 bottom-4 w-[2px] bg-bg-secondary -translate-x-1/2 hidden md:block overflow-hidden">
                            <motion.div
                                style={{ scaleY }}
                                className="w-full h-full bg-brand-primary origin-top"
                            ></motion.div>
                        </div>

                        <div className="space-y-12 md:space-y-0">
                            {rehomingSteps.map((item, index) => (
                                <TimelineStep key={index} item={item} index={index} scrollYProgress={scrollYProgress} total={rehomingSteps.length} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Adoption Section --- */}
                <div className="mb-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20 relative"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border/50 rounded-full text-brand-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                            <HeartHandshake size={12} className="fill-current" />
                            Adopter Journey
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-text-primary mb-8 font-logo tracking-tight relative inline-block">
                            Adopting a <span className="text-brand-primary">Pet</span>
                            <motion.img
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                src={star}
                                alt=""
                                className="absolute -top-4 -right-10 w-8 h-8 opacity-60"
                                style={{ filter: 'brightness(0)' }}
                            />
                        </h2>
                        <p className="text-text-secondary dark:text-text-secondary/90 text-lg max-w-2xl mx-auto font-medium opacity-80">
                            Finding your or your family's new best friend is a journey we take together.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-auto gap-6 lg:gap-8"
                    >
                        {/* Step 1: Browse - Large Card (2x2) */}
                        <motion.div
                            variants={cardReveal}
                            className="lg:col-span-2 lg:row-span-2 bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-border/50 hover:border-brand-primary/40 group flex flex-col relative overflow-hidden backdrop-blur-sm"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/5 rounded-bl-[120px] -mr-8 -mt-8 group-hover:bg-brand-primary/10 transition-all duration-700"></div>
                            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-10 self-start uppercase tracking-[0.2em] border border-brand-primary/5">
                                Step 01
                            </span>
                            <div className="text-brand-primary mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 origin-left">
                                <Search size={56} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-text-primary mb-4 font-jakarta tracking-tight leading-tight">Smart Browsing</h3>
                            <p className="text-text-secondary leading-relaxed text-lg mb-10 max-w-md font-medium opacity-80">
                                Find your perfect match using filters for species, breed, age, and energy level. Filter for child-friendly or multi-pet compatible companions.
                            </p>
                            <div className="mt-auto flex flex-wrap gap-3">
                                <span className="text-[10px] font-bold bg-bg-secondary px-4 py-2 rounded-xl text-text-tertiary border border-border/50">#LOCAL_SEARCH</span>
                                <span className="text-[10px] font-bold bg-bg-secondary px-4 py-2 rounded-xl text-text-tertiary border border-border/50">#PET_FILTERS</span>
                            </div>
                        </motion.div>

                        {/* Step 2: Create Profile - Wide Card (2x1) */}
                        <motion.div
                            variants={cardReveal}
                            className="lg:col-span-2 bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-border/50 hover:border-brand-secondary/40 group flex flex-col md:flex-row gap-10 items-center bg-gradient-to-br from-bg-surface to-bg-secondary/10 backdrop-blur-sm"
                        >
                            <div className="flex-shrink-0 text-brand-secondary bg-brand-secondary/10 p-6 rounded-[32px] group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 border border-brand-secondary/5">
                                <UserPlus size={48} />
                            </div>
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-secondary text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em]">
                                    Step 02
                                </span>
                                <h3 className="text-3xl font-black text-text-primary mb-3 font-jakarta tracking-tight">Universal Resume</h3>
                                <p className="text-text-secondary leading-relaxed text-[15px] font-medium opacity-80">
                                    Build a detailed adopter profile showing your housing, lifestyle, and pet experience. One profile covers every application across the platform.
                                </p>
                            </div>
                        </motion.div>

                        {/* Step 3: Apply - Tall Card (1x2) */}
                        <motion.div
                            variants={cardReveal}
                            className="lg:row-span-2 bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-border/50 hover:border-brand-primary/40 group flex flex-col backdrop-blur-sm"
                        >
                            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-10 self-start uppercase tracking-[0.2em] border border-brand-primary/10">
                                Step 03
                            </span>
                            <div className="text-brand-primary mb-10 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-700">
                                <Send size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-4 font-jakarta tracking-tight">Personalized Apply</h3>
                            <p className="text-text-secondary leading-relaxed text-[15px] mb-8 font-medium opacity-80">
                                Submit applications with direct messages to owners. Mention why you're a good fit and how you'll meet their needs.
                            </p>
                            <div className="mt-auto space-y-4">
                                <div className="h-2 w-full bg-bg-secondary rounded-full overflow-hidden border border-border/50">
                                    <div className="h-full bg-brand-primary w-2/3 shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)]"></div>
                                </div>
                                <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">Adopter Readiness: 70%</p>
                            </div>
                        </motion.div>

                        {/* Step 4: Interview - Standard Card (1x1) */}
                        <motion.div
                            variants={cardReveal}
                            className="bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-border/40 hover:border-brand-primary/40 group backdrop-blur-sm"
                        >
                            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-8 uppercase tracking-[0.2em] border border-brand-primary/10">
                                Step 04
                            </span>
                            <div className="text-brand-primary mb-6 group-hover:scale-125 group-hover:rotate-3 transition-all duration-700">
                                <MessageCircle size={40} />
                            </div>
                            <h3 className="text-xl font-black text-text-primary mb-3 font-jakarta tracking-tight">Owner Chat</h3>
                            <p className="text-text-secondary text-[14px] leading-relaxed font-medium opacity-80">
                                Chat securely to clarify history or medical records before meeting.
                            </p>
                        </motion.div>

                        {/* Step 5: Meet & Greet - Wide Card (2x1) */}
                        <motion.div
                            variants={cardReveal}
                            className="lg:col-span-2 bg-bg-secondary/40 p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-border/50 hover:border-brand-primary/40 group flex flex-col md:flex-row gap-8 items-center backdrop-blur-xl"
                        >
                            <div className="flex-shrink-0 w-20 h-20 rounded-3xl bg-white border border-border/30 shadow-sm flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 group-hover:scale-110">
                                <Users size={40} />
                            </div>
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em]">
                                    Step 05
                                </span>
                                <h3 className="text-3xl font-black text-text-primary mb-3 font-jakarta tracking-tight">Safe Meetups</h3>
                                <p className="text-text-secondary leading-relaxed text-[15px] font-medium opacity-80">
                                    Arrange a guided in-person meeting in a safe, public place to ensure the pet and your family connect well.
                                </p>
                            </div>
                        </motion.div>

                        {/* Step 6: Trial - Standard Card (1x1) */}
                        <motion.div
                            variants={cardReveal}
                            className="bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-700 border border-border/40 hover:border-brand-primary/40 group backdrop-blur-sm"
                        >
                            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-8 uppercase tracking-[0.2em] border border-brand-primary/10">
                                Step 06
                            </span>
                            <div className="text-brand-primary mb-6 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-700">
                                <Home size={40} />
                            </div>
                            <h3 className="text-xl font-black text-text-primary mb-3 font-jakarta tracking-tight">Short Trial</h3>
                            <p className="text-text-secondary text-[14px] leading-relaxed font-medium opacity-80">
                                Optional foster-to-adopt periods to ensure a long-term match.
                            </p>
                        </motion.div>

                        {/* Step 7: Adopt - Wide Ribbon Card (All columns) */}
                        <motion.div
                            variants={cardReveal}
                            className="lg:col-span-4 bg-brand-primary p-10 md:p-12 rounded-[48px] shadow-2xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:scale-[1.01] transition-all duration-700 group flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-[10px] font-black rounded-full mb-6 uppercase tracking-[0.2em]">
                                    Final Step
                                </span>
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-4 font-jakarta tracking-tight">Welcome Home!</h3>
                                <p className="text-white/90 leading-relaxed font-bold text-lg max-w-xl">
                                    Finalize documentation, sign the digital agreement, and start your journey together.
                                </p>
                            </div>
                            <div className="relative z-10 flex-shrink-0">
                                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-2xl group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out">
                                    <PartyPopper size={48} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* --- FAQ Section --- */}
                <div className="mb-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-24 relative"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bg-secondary border border-border/50 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                            <Sparkles size={12} className="fill-current" />
                            General Inquiries
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-text-primary mb-8 font-logo tracking-tight relative inline-block">
                            Frequently Asked <span className="text-brand-primary">Questions</span>
                        </h2>
                        <p className="text-text-secondary text-xl max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
                            Everything you need to know about our rehoming and adoption process.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="p-10 rounded-[48px] bg-bg-surface border border-border/40 hover:border-brand-primary/20 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex-shrink-0 flex items-center justify-center text-text-tertiary group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all duration-300">
                                        <MessageCircle size={24} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-text-primary mb-4 font-jakarta tracking-tight leading-tight">
                                            {faq.question}
                                        </h3>
                                        <p className="text-text-secondary text-lg leading-relaxed font-medium opacity-80 decoration-brand-primary/30">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- Call to Action --- */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative pt-12"
                >
                    <div className="bg-[#638C7D] rounded-[56px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-brand-primary/10">
                        {/* Background Accents - Subtle */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 font-logo tracking-tight leading-tight">
                                Ready to get <span className="opacity-90">started?</span>
                            </h2>
                            <p className="text-white/80 text-lg md:text-xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                                Join our community of pet lovers. Whether you're rehoming or adopting, we're here to help every step of the way.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-16 px-10 bg-brand-secondary text-white font-black rounded-full hover:brightness-110 transition-all duration-300 flex items-center gap-3 text-lg shadow-xl shadow-brand-secondary/20 group"
                                >
                                    Start Rehoming
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="h-16 px-10 bg-white/10 border border-white/20 text-white font-black rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-3 text-lg backdrop-blur-sm"
                                >
                                    Browse Pets
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Sub-component for Rehoming Steps to handle individual scroll logic
const TimelineStep = ({ item, index, scrollYProgress, total }) => {
    // Calculate when this step becomes "active"
    const threshold = (index / (total - 1));
    const stepColor = useTransform(
        scrollYProgress,
        [threshold - 0.05, threshold],
        ["rgba(99, 140, 125, 0.2)", "rgba(99, 140, 125, 1)"]
    );
    const stepScale = useTransform(
        scrollYProgress,
        [threshold - 0.05, threshold],
        [1, 1.25]
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative md:min-h-[280px] ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Timeline Dot */}
            <motion.div
                style={{ backgroundColor: stepColor, scale: stepScale }}
                className="absolute left-4 md:left-1/2 w-8 h-8 -translate-x-1/2 ring-8 ring-bg-primary rounded-full z-20 flex items-center justify-center shadow-lg hidden md:flex"
            >
                <div className="w-2 h-2 bg-white rounded-full"></div>
            </motion.div>

            {/* Content Card */}
            <div className={`w-full md:w-[42%] group`}>
                <div className="relative p-1 rounded-[50px] bg-gradient-to-br from-border/50 to-transparent hover:from-brand-primary/20 transition-all duration-700 hover:-translate-y-2">
                    <div className="bg-bg-surface/80 backdrop-blur-xl p-8 md:p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] hover:shadow-brand-primary/5 transition-all duration-500 border border-border/50 relative overflow-hidden h-full">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-bg-secondary flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                {item.icon}
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5 text-text-tertiary text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                    {item.badgeIcon}
                                    {item.badge}
                                </div>
                                {item.footer && (
                                    <span className="text-[10px] font-black text-brand-secondary/70 uppercase tracking-widest">{item.footer}</span>
                                )}
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-text-primary mb-4 font-jakarta tracking-tight leading-tight group-hover:text-brand-primary transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-text-secondary dark:text-text-secondary/90 leading-relaxed text-[15px] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Empty side for layout */}
            <div className="hidden md:block md:w-[42%]"></div>
        </motion.div>
    );
};

export default HowItWorks;
