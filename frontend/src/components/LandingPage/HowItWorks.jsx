import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
    Search, UserPlus, Send, MessageCircle, Users, Home, PartyPopper,
    ClipboardCheck, FileText, ShieldCheck, FolderOpen, HeartHandshake,
    CheckCircle, Clock, MapPin, FileSignature, ArrowRight, Sparkles, Heart
} from 'lucide-react';
import SectionCursor from '../common/SectionCursor';

import star from '../../assets/star.png';
import stars from '../../assets/stars.png';

const HowItWorks = () => {
    const rehomingRef = useRef(null);
    const stepsRef = useRef(null);

    // Scroll Progress for Timeline
    const { scrollYProgress } = useScroll({
        target: stepsRef,
        offset: ["start 60%", "end 60%"]
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
                staggerChildren: 0.15,
                delayChildren: 0.1
            },
        },
    };

    const cardReveal = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 100,
            }
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
        <section className="py-24 bg-bg-primary relative overflow-hidden ">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* --- Rehoming Section --- */}
                <div className="mb-48" ref={rehomingRef}>
                    <SectionCursor label="OWNER JOURNEY" icon={<ShieldCheck size={14} />}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-20 relative"
                        >
                            <h2 className="text-5xl md:text-6xl font-black text-text-primary mb-8 tracking-tight relative inline-block">
                                Rehoming Your <span className="text-brand-primary">Pet</span>
                            </h2>
                            <p className="text-text-secondary dark:text-text-secondary/90 text-lg max-w-2xl mx-auto font-medium opacity-80 decoration-brand-primary/30">
                                A guided process designed to ensure your pet's future is filled with love and stability.
                            </p>
                        </motion.div>

                        <div className="relative max-w-6xl mx-auto" ref={stepsRef}>
                            {/* Desktop Timeline Line */}
                            <div className="absolute left-1/2 top-4 bottom-4 w-[2px] bg-bg-secondary -translate-x-1/2 hidden md:block overflow-hidden">
                                <motion.div
                                    style={{ scaleY }}
                                    className="w-full h-full bg-brand-primary origin-top"
                                ></motion.div>
                            </div>

                            <div className="space-y-12 md:space-y-0">
                                {rehomingSteps.map((item, index) => (
                                    <TimelineStep key={index} item={item} index={index} />
                                ))}
                            </div>
                        </div>
                    </SectionCursor>
                </div>

                {/* --- Adoption Section --- */}
                <div className="mb-48">
                    <SectionCursor label="ADOPTER JOURNEY" icon={<Heart size={14} />}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-24 relative"
                        >
                            <h2 className="text-5xl md:text-7xl font-black text-text-primary mb-8 tracking-tight relative inline-block">
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
                            <p className="text-text-secondary dark:text-text-secondary/90 text-xl max-w-3xl mx-auto font-medium opacity-80 leading-relaxed ">
                                Finding your or your family's new best friend is a journey we take together. We've built the tools to make it transparent and safe.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 lg:gap-8"
                        >
                            {/* 1. Smart Discovery - Hero Card (8/12) */}
                            <motion.div
                                variants={cardReveal}
                                className="md:col-span-6 lg:col-span-8 bg-bg-surface p-12 rounded-[56px] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-brand-primary/20 group flex flex-col relative overflow-hidden backdrop-blur-xl"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-bl-[160px] -mr-8 -mt-8 group-hover:bg-brand-primary/10 transition-colors duration-700"></div>

                                <span className="inline-block px-5 py-2 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-10 self-start uppercase tracking-[0.2em] border border-brand-primary/5">
                                    Discovery
                                </span>

                                <div className="w-20 h-20 text-brand-primary bg-brand-primary/10 rounded-[28px] border border-brand-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Search size={40} strokeWidth={1.5} />
                                </div>

                                <h3 className="text-4xl font-black text-text-primary mb-6 font-logo tracking-tight">Smart Discovery</h3>
                                <p className="text-text-secondary text-lg mb-10 font-medium opacity-80 leading-relaxed max-w-xl">
                                    Find your perfect match based on lifestyle compatibility, not just looks. Our AI-driven filters prioritize local matches to ensure a sustainable bond.
                                </p>

                                <div className="mt-auto flex flex-wrap gap-3">
                                    <span className="text-[10px] font-bold bg-bg-secondary px-4 py-2 rounded-xl text-text-tertiary uppercase tracking-wider">Local First</span>
                                    <span className="text-[10px] font-bold bg-bg-secondary px-4 py-2 rounded-xl text-text-tertiary uppercase tracking-wider">Lifestyle Match</span>
                                    <span className="text-[10px] font-bold bg-bg-secondary px-4 py-2 rounded-xl text-text-tertiary uppercase tracking-wider">Verified Pets</span>
                                </div>
                            </motion.div>

                            {/* 2. Universal Profile - Tall Card (4/12 - Row Span 2) */}
                            <motion.div
                                variants={cardReveal}
                                className="md:col-span-6 lg:col-span-4 lg:row-span-2 bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-brand-secondary/40 group flex flex-col relative overflow-hidden bg-gradient-to-b from-bg-surface to-bg-secondary/20"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="w-16 h-16 text-brand-secondary bg-brand-secondary/10 rounded-2xl border border-brand-secondary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <UserPlus size={32} strokeWidth={1.5} />
                                </div>

                                <h3 className="text-3xl font-black text-text-primary mb-4 font-logo tracking-tight leading-tight">Universal Profile</h3>
                                <p className="text-text-secondary text-[15px] font-medium opacity-80 leading-relaxed mb-8">
                                    Build your "Adopter Resume" once. Verify your housing, lifestyle, and references, then apply to any pet with a single click.
                                </p>

                                <div className="mt-auto space-y-4 relative z-10">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white/60">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={14} /></div>
                                        <span className="text-xs font-bold text-text-secondary">Identity Verified</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white/60">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={14} /></div>
                                        <span className="text-xs font-bold text-text-secondary">Home Checked</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white/60">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={14} /></div>
                                        <span className="text-xs font-bold text-text-secondary">References Ready</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 3. Trust & Safety - Feature Card (4/12) */}
                            <motion.div
                                variants={cardReveal}
                                className="md:col-span-6 lg:col-span-4 bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-brand-primary/20 group flex flex-col relative overflow-hidden"
                            >
                                <div className="w-16 h-16 text-brand-primary bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-text-primary mb-3 font-logo tracking-tight">Trust & Safety</h3>
                                <p className="text-text-secondary text-sm font-medium opacity-80 leading-relaxed">
                                    Bank-level identity verification and optional background checks ensure you're meeting real, trusted owners.
                                </p>
                            </motion.div>

                            {/* 4. Secure Chat - Feature Card (4/12) */}
                            <motion.div
                                variants={cardReveal}
                                className="md:col-span-6 lg:col-span-4 bg-bg-surface p-10 rounded-[48px] shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-brand-primary/20 group flex flex-col relative overflow-hidden"
                            >
                                <div className="w-16 h-16 text-brand-primary bg-brand-primary/10 rounded-2xl border border-brand-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <MessageCircle size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-text-primary mb-3 font-logo tracking-tight">Mediated Communication</h3>
                                <p className="text-text-secondary text-sm font-medium opacity-80 leading-relaxed">
                                    Communicate securely through our platform. We mediate contact to protect your privacy until you're ready to proceed.
                                </p>
                            </motion.div>

                            {/* 5. Digital Legal - Full Width (12/12) */}
                            <motion.div
                                variants={cardReveal}
                                className="md:col-span-6 lg:col-span-12 bg-white p-12 rounded-[56px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-brand-primary/30 group flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="w-24 h-24 flex-shrink-0 text-brand-primary bg-white rounded-full border border-brand-primary/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10">
                                    <FileSignature size={40} strokeWidth={1.5} />
                                </div>

                                <div className="flex-1 text-center md:text-left relative z-10">
                                    <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em] border border-brand-primary/5">
                                        Peace of Mind
                                    </span>
                                    <h3 className="text-3xl font-black text-text-primary mb-3 font-logo tracking-tight">Digital Legal & Transfer</h3>
                                    <p className="text-text-secondary text-lg font-medium opacity-80 leading-relaxed max-w-2xl">
                                        We handle the paperwork. Automated Adoption Agreements, medical record transfers, and clear liability waivers generated instantly upon match.
                                    </p>
                                </div>

                                <div className="relative z-10 flex-shrink-0">
                                    <div className="flex -space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-bg-surface border-2 border-white flex items-center justify-center shadow-md"><FileText size={18} className="text-brand-primary" /></div>
                                        <div className="w-12 h-12 rounded-full bg-bg-surface border-2 border-white flex items-center justify-center shadow-md"><HeartHandshake size={18} className="text-brand-primary" /></div>
                                        <div className="w-12 h-12 rounded-full bg-brand-primary border-2 border-white flex items-center justify-center shadow-md text-white font-bold text-xs">+3</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </SectionCursor>
                </div>

                {/* --- FAQ Section --- */}
                <div className="mb-48">
                    <SectionCursor label="GENERAL INQUIRIES" icon={<MessageCircle size={14} />}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-24 relative"
                        >
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
                                            <h3 className="text-2xl font-black text-text-primary mb-4  tracking-tight leading-tight">
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
                    </SectionCursor>
                </div>

                {/* --- Call to Action --- */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative pt-12"
                >
                    <div className="bg-brand-primary rounded-[56px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-brand-primary/10">
                        {/* Background Accents - Subtle */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
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
const TimelineStep = ({ item, index }) => {
    const stepRef = useRef(null);

    // Local scroll progress for this specific step dot
    // This ensures the dot fills exactly when its center reaches the 60% line
    const { scrollYProgress: localProgress } = useScroll({
        target: stepRef,
        offset: ["center 85%", "center 60%"]
    });

    const smoothProgress = useSpring(localProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const stepColor = useTransform(
        smoothProgress,
        [0, 1],
        ["rgba(99, 140, 125, 0.2)", "var(--color-brand-primary)"]
    );
    const ringColor = useTransform(
        smoothProgress,
        [0, 1],
        ["rgba(99, 140, 125, 0.1)", "var(--color-brand-primary)"]
    );
    const stepScale = useTransform(
        smoothProgress,
        [0, 1],
        [1, 1.15]
    );

    return (
        <motion.div
            ref={stepRef}
            initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative md:min-h-[280px] ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Timeline Dot */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center justify-center">
                <motion.div
                    style={{
                        backgroundColor: stepColor,
                        scale: stepScale,
                        borderColor: ringColor
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-bg-primary ring-8 ring-bg-primary/50"
                >
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </motion.div>
            </div>

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

                        <h3 className="text-2xl font-black text-text-primary mb-4  tracking-tight leading-tight group-hover:text-brand-primary transition-colors">
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
