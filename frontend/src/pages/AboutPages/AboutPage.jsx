import React from 'react';
import { Heart, Home, Activity, Clock, Users, Award, Smile, Globe, Shield, Zap, ArrowRight, Mail, Search, Lightbulb, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router';
import aboutImage1 from '../../assets/about1.png';
import aboutImage2 from '../../assets/about2.jpg';

const AboutPage = () => {
    const stats = [
        { label: 'Pets Adopted', value: '15,000+', icon: Heart },
        { label: 'Partner Rescues', value: '500+', icon: Home },
        { label: 'Success Rate', value: '98%', icon: Activity },
        { label: 'Support Available', value: '24/7', icon: Clock },
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
            icon: Shield,
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
            icon: TrendingUp,
        },
    ];

    const team = [
        {
            name: 'Amelia Stone',
            role: 'Co-founder & CEO',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            description: 'Former shelter director focused on building ethical, adoption-first technology.'
        },
        {
            name: 'Ravi Patel',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
            description: 'Designs flows that make it easy to apply, chat with owners, and stay informed.'
        },
        {
            name: 'Maria Lopez',
            role: 'Rescue Partnerships',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
            description: 'Supports rescues with dashboards, training, and heart-centered onboarding.'
        },
        {
            name: 'Leo Kim',
            role: 'Engineering Lead',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
            description: 'Builds reliable infrastructure for applications, messaging, and community features.'
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

    return (
        <div className="bg-bg-primary min-h-screen font-inter text-text-primary">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80"
                        alt="Happy family with dog"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 lg:px-8">

                    {/* Content */}
                    <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-[#A68A6D] text-xs font-bold tracking-widest uppercase border border-white/10">
                            Our Mission
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white font-serif tracking-tight">
                            Connecting Hearts,<br /> Saving Lives
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
                            Building a world where every pet has a loving home and every owner has the support they need.
                        </p>
                        <div className="pt-8">
                            <Link to="/adopt" className="bg-white text-[#2D2D2D] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition duration-300 inline-block shadow-lg">
                                Start Your Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Stats Section */}
            <section className="bg-[#2D2D2D] py-16 text-white border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                        {stats.map((stat, index) => (
                            <div key={index} className="px-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4 text-[#A68A6D]">
                                    <stat.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div className="text-4xl font-bold mb-2 font-serif">{stat.value}</div>
                                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div>
                        <p className="text-[#A68A6D] font-bold uppercase tracking-widest mb-4 text-sm font-sans">Who We Are</p>
                        <h2 className="text-5xl font-bold mb-8 text-[#2D2D2D] font-serif">Our Story</h2>

                        <div className="space-y-8 text-[#57534E] text-lg leading-relaxed font-light">
                            <p>
                                PetCircle began with a simple observation: too many beloved pets were ending up in shelters simply because their owners hit a rough patch and had nowhere else to turn. We set out to change that.
                            </p>
                            <p>
                                What started as a small local network has grown into a nationwide movement. We're not just a platform; we're a safety net, a matchmaking service, and a community of animal lovers dedicated to ethical rehoming and responsible adoption.
                            </p>
                        </div>

                        {/* Quote Box */}
                        <div className="mt-12 bg-white p-8 rounded-[2rem] shadow-sm border border-transparent relative">
                            <div className="absolute left-0 top-8 bottom-8 w-1 bg-[#A68A6D] rounded-r-full"></div>
                            <p className="text-lg font-medium text-[#2D2D2D] italic mb-4 leading-relaxed font-serif">
                                "We believe that compassion is a verb. Every feature we build is designed to make kindness easier."
                            </p>
                            <p className="text-sm font-bold text-[#57534E] uppercase tracking-wider">— Sarah Jenkins, Founder</p>
                        </div>
                    </div>

                    {/* Images Layout */}
                    <div className="relative h-[500px] lg:h-[600px] w-full">
                        {/* Main Image */}
                        <div className="absolute top-0 left-0 w-[85%] h-[85%] rounded-[2.5rem] overflow-hidden shadow-xl z-0">
                            <img
                                src={aboutImage1}
                                alt="Dog running"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Overlapping Image (Bottom Right) */}
                        <div className="absolute bottom-10 right-0 w-[40%] h-[40%] rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-[#FFF8E7] z-10">
                            <img
                                src={aboutImage2}
                                alt="Puppy detail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-[#FFF8E7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-[#A68A6D] font-bold uppercase tracking-widest mb-4 text-sm font-sans">Our Principles</p>
                        <h2 className="text-5xl font-bold text-[#2D2D2D] mb-6 font-serif">What Drives Us</h2>
                        <p className="text-[#57534E] text-lg font-light">Core values that guide every decision we make.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white p-10 rounded-[2rem] text-center hover:shadow-xl transition duration-300 border border-transparent hover:border-[#A68A6D]/20 shadow-sm flex flex-col items-center h-full">
                                <div className="w-20 h-20 bg-[#FFF8E7] rounded-full flex items-center justify-center mb-8 text-[#A68A6D]">
                                    <value.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-[#2D2D2D] font-serif">{value.title}</h3>
                                <p className="text-[#57534E] leading-relaxed font-light text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <p className="text-[#A68A6D] font-bold uppercase tracking-widest mb-4 text-sm font-sans">The People</p>
                    <h2 className="text-5xl font-bold text-[#2D2D2D] mb-6 font-serif">Meet Our Team</h2>
                    <p className="text-[#57534E] text-lg font-light">
                        A small team of animal lovers, designers, and shelter partners building tools that feel as kind as they are powerful.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            {/* Image Container */}
                            <div className="relative h-64 grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Icons */}
                                <div className="absolute bottom-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                    <a href="#" className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors">
                                        <Globe size={16} /> {/* Using Globe as placeholder for Linkedin */}
                                    </a>
                                    <a href="#" className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors">
                                        <Mail size={16} />
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-[#2D2D2D] mb-1">{member.name}</h3>
                                <p className="text-[#A68A6D] font-bold text-xs uppercase tracking-wider mb-4">{member.role}</p>
                                <p className="text-[#57534E] text-sm leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trusted Partners Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <p className="text-[#A68A6D] font-bold uppercase tracking-widest mb-4 text-sm font-sans">Trusted Partners</p>
                    <h2 className="text-5xl font-bold text-[#2D2D2D] mb-6 font-serif">Working Together to Save Lives</h2>
                    <p className="text-[#57534E] text-lg font-light">
                        From local shelters to national organizations, FurEver Home supports teams dedicated to ethical, responsible adoption.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className="bg-white h-24 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow grayscale hover:grayscale-0 opacity-70 hover:opacity-100 duration-300">
                            {/* Placeholder Logos using Text or Icons since assets weren't provided */}
                            <div className="text-[#2D2D2D] font-bold text-xl flex items-center gap-2">
                                <Award size={24} />
                                <span className="hidden md:inline">Partner</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#3E332B] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Stories That Inspire Us</h2>
                        <p className="text-white/70 max-w-2xl mx-auto mb-16 text-lg font-light">
                            Real families, real pets, and the journeys that started with a single message on FurEver Home.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white p-8 rounded-3xl text-left shadow-lg transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-10 h-10 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[#A68A6D] font-serif text-xl border border-[#E6D4B9]">
                                            "
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4 text-[#FFB800] fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-[#57534E] text-lg leading-relaxed mb-8 flex-grow font-light italic">
                                        "{testimonial.text}"
                                    </p>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F3F4F6]" />
                                        <div>
                                            <p className="font-bold text-[#2D2D2D]">{testimonial.author}</p>
                                            <p className="text-xs text-[#A68A6D] font-bold uppercase tracking-wide">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-gradient-to-br from-[#3E332B] to-[#1F1812] rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
                    {/* Shiny Gradient Effect - Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-30 rotate-45 pointer-events-none blur-3xl"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">Ready to Make a Difference?</h2>
                        <p className="text-white/80 text-lg md:text-xl mb-12 leading-relaxed font-light">
                            Whether you're looking to adopt, share a pet's story, or support as a partner, FurEver Home gives you everything you need to create more happy endings.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <Link to="/pets" className="px-8 py-4 bg-white text-[#2D2D2D] rounded-full font-bold hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2 group">
                                <Search size={20} className="text-[#2D2D2D]" />
                                <span>Browse Pets</span>
                            </Link>
                            <Link to="/register" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
                                <Heart size={20} className="text-white" />
                                <span>Become a Partner</span>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                            <span>Every click can change a life</span>
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <Award size={14} />
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <span>Thank you for caring</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
