import React from 'react';
import { Heart, Home, Activity, Clock, Users, Award, Smile, Globe, Shield, Zap, ArrowRight, Mail, Search, Lightbulb, TrendingUp, Star, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import Button from '../../components/common/Buttons/Button';
import SectionCursor from '../../components/common/SectionCursor';

// Using placeholders for now, but in a real scenario we'd use optimized assets
import aboutImage1 from '../../assets/about1.png';
import aboutImage2 from '../../assets/about2.jpg';

const AboutPage = () => {
    const stats = [
        { label: 'Pets Adopted', value: '15k+', icon: Heart },
        { label: 'Partner Rescues', value: '500+', icon: Home },
        { label: 'Success Rate', value: '98%', icon: Activity },
        { label: 'Support', value: '24/7', icon: Clock },
    ];

    const values = [
        {
            title: 'Compassion',
            description: 'We approach every situation with empathy, understanding that life can be unpredictable.',
            icon: Heart,
        },
        {
            title: 'Transparency',
            description: 'Honesty builds trust. We ensure full disclosure in medical and behavioral histories.',
            icon: Shield, // Replaced with Shield for better fit
        },
        {
            title: 'Community',
            description: 'We believe in the power of connection—neighbors helping neighbors for the love of pets.',
            icon: Users,
        },
        {
            title: 'Excellence',
            description: 'We hold ourselves to the highest standards of animal welfare and digital safety.',
            icon: Star,
        },
        {
            title: 'Innovation',
            description: 'Using technology to solve timeless problems in pet adoption and care.',
            icon: Lightbulb,
        },
        {
            title: 'Impact',
            description: 'We measure our success not in profits, but in lives saved and families created.',
            icon: TrendingUp, // Replaced with TrendingUp
        },
    ];

    const team = [
        {
            name: 'Amelia Stone',
            role: 'Co-founder & CEO',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            description: 'Former shelter director focused on building ethical, adoption-first technology.',
            social: { linkedin: '#', email: '#' }
        },
        {
            name: 'Ravi Patel',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
            description: 'Designs flows that make it easy to apply, chat with owners, and stay informed.',
            social: { linkedin: '#', email: '#' }
        },
        {
            name: 'Maria Lopez',
            role: 'Rescue Partnerships',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
            description: 'Supports rescues with dashboards, training, and heart-centered onboarding.',
            social: { linkedin: '#', email: '#' }
        },
        {
            name: 'Leo Kim',
            role: 'Engineering Lead',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
            description: 'Builds reliable infrastructure for applications, messaging, and community features.',
            social: { linkedin: '#', email: '#' }
        },
    ];

    const testimonials = [
        {
            text: "The chat with the owner made us feel supported from day one. We knew exactly what to expect before Milo came home.",
            author: "Jordan & Sam",
            role: "Adopted Milo, 2 y/o mixed breed",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "Managing our pets and applications in one dashboard means we can spend more time caring for animals, not on spreadsheets.",
            author: "Bright Paws Rescue",
            role: 'Rescue partner since 2021',
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "The community forum helped us with training tips and first vet visits. It felt like we weren't doing it alone.",
            author: "The Chen Family",
            role: "First-time adopters",
            image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=100&q=80"
        }
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="bg-bg-primary min-h-screen  text-text-primary overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-full border border-brand-primary/10 text-brand-primary font-bold text-xs tracking-widest uppercase mb-4"
                        >
                            <SectionCursor text="Our Mission" className="bg-brand-primary" />
                            <span>About PetCircle</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black font-logo tracking-tighter text-[#1F2937] leading-[0.9]"
                        >
                            Connecting Hearts,<br /> Saving Lives
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-xl md:text-2xl text-text-secondary font-medium max-w-2xl mx-auto leading-relaxed"
                        >
                            Building a world where every pet has a loving home and every owner has the support they need.
                        </motion.p>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-secondary/5 rounded-full blur-[120px]" />
                </div>
            </section>

            {/* Stats Section */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[3rem] p-12 lg:p-16 shadow-xl border border-border/40 relative overflow-hidden">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 mx-auto bg-bg-secondary rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon size={32} strokeWidth={2} />
                                </div>
                                <div className="text-4xl md:text-5xl font-black font-logo text-[#1F2937] mb-2 tracking-tight">{stat.value}</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <section className="py-24 lg:py-32">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src={aboutImage1}
                                    alt="Founder with dog"
                                    className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Floating Card */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="absolute -bottom-12 -right-12 z-20 bg-white p-8 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-border/40 max-w-sm hidden md:block"
                            >
                                <div className="flex gap-4 mb-4">
                                    <div className="w-12 h-12 bg-brand-secondary/20 rounded-full flex items-center justify-center text-brand-secondary">
                                        <Heart size={24} fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider">Compassion First</p>
                                        <p className="text-3xl font-black font-logo text-[#1F2937]">Since 2021</p>
                                    </div>
                                </div>
                                <p className="text-[#6B7280] font-medium leading-relaxed">
                                    "We believe that compassion is a verb. Every feature we build is designed to make kindness easier."
                                </p>
                            </motion.div>

                            <div className="absolute top-12 -left-12 w-64 h-64 bg-dots-pattern opacity-20 -z-10 rounded-full" />
                        </div>

                        <div className="order-1 lg:order-2 space-y-8">
                            <div>
                                <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Story</span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-logo text-[#1F2937] tracking-tight leading-none mb-6">
                                    From a Neighborhood Network to a Nationwide Movement.
                                </h2>
                            </div>
                            <div className="space-y-6 text-lg text-[#6B7280] leading-relaxed">
                                <p>
                                    PetCircle began with a simple observation: too many beloved pets were ending up in shelters simply because their owners hit a rough patch and had nowhere else to turn. We set out to change that system entirely.
                                </p>
                                <p>
                                    What started as a small local network has grown into a nationwide movement. We're not just a platform; we're a safety net, a matchmaking service, and a community of animal lovers dedicated to ethical rehoming and responsible adoption.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Link to="/contact">
                                    <Button variant="outline" className="px-8 py-6 rounded-full text-base">
                                        Get in Touch <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-bg-surface border-y border-border/40">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <span className="text-brand-primary font-bold tracking-widest uppercase text-sm">Our Principles</span>
                        <h2 className="text-4xl md:text-5xl font-black font-logo text-[#1F2937] tracking-tight">What Drives Us Forward</h2>
                        <p className="text-lg text-[#6B7280]">Core values that guide every decision we make, from code to community.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white p-10 rounded-[2.5rem] border border-border/40 hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center text-brand-primary mb-8">
                                    <value.icon size={28} strokeWidth={2} />
                                </div>
                                <h3 className="text-2xl font-black font-logo text-[#1F2937] mb-4">{value.title}</h3>
                                <p className="text-[#6B7280] font-medium leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 lg:py-32">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-2 block">The People</span>
                            <h2 className="text-4xl md:text-5xl font-black font-logo text-[#1F2937] tracking-tight">Meet Our Team</h2>
                        </div>
                        <Button variant="secondary" className="px-6 py-4 rounded-full">See All Positions</Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="group">
                                <div className="relative mb-6 rounded-3xl overflow-hidden aspect-[4/5]">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <div className="flex gap-3">
                                            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors">
                                                <Globe size={18} />
                                            </button>
                                            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors">
                                                <Mail size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#1F2937]">{member.name}</h3>
                                <p className="text-brand-primary font-bold text-xs uppercase tracking-wider mb-2">{member.role}</p>
                                <p className="text-sm text-[#6B7280] leading-relaxed">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-20 border-t border-border/40">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-[#9CA3AF] font-bold uppercase tracking-widest text-xs">Trusted By Organizations Nationwide</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {[1, 2, 3, 4, 5, 6].map((item, i) => (
                            <div key={i} className="flex items-center justify-center p-6 border border-border/40 rounded-2xl hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all">
                                <div className="flex items-center gap-2 font-black font-logo text-xl text-[#374151]">
                                    <Award size={24} className="text-brand-primary" />
                                    <span>Partner</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1600px] mx-auto bg-brand-primary rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 blur-[150px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black font-logo text-white tracking-tighter leading-none">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-xl text-brand-primary-light max-w-2xl mx-auto font-medium">
                            Whether you're looking to adopt, share a pet's story, or support as a partner, PetCircle gives you everything you need.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link to="/adopt">
                                <button className="px-10 py-5 bg-white text-brand-primary rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)]">
                                    Browse Pets
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brand-primary transition-all">
                                    Become a Partner
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
