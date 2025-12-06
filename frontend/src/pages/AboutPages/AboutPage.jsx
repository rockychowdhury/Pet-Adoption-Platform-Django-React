import React from 'react';
import { Heart, Home, Activity, Clock, Users, Award, Smile, Globe, Shield, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const AboutPage = () => {
    const stats = [
        { label: 'Lives Saved', value: '15,000+', icon: Heart },
        { label: 'Active Shelters', value: '500+', icon: Home },
        { label: 'Success Rate', value: '98%', icon: Activity },
        { label: 'Support', value: '24/7', icon: Clock },
    ];

    const values = [
        {
            title: 'Compassion First',
            description: 'We put the well-being of animals above all else, ensuring every decision is made with love and care.',
            icon: Heart,
        },
        {
            title: 'Radical Transparency',
            description: 'From shelter records to adoption fees, we believe in complete openness to build trust with our community.',
            icon: Shield,
        },
        {
            title: 'Stronger Together',
            description: 'We believe that by connecting shelters, adopters, and volunteers, we can solve the homeless pet crisis.',
            icon: Users,
        },
    ];

    const team = [
        { name: 'Olivia White', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' },
        { name: 'Ethan Hall', role: 'Head of Shelter Ops', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
        { name: 'Maya Patel', role: 'Lead Veterinarian', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
        { name: 'Sam Lee', role: 'Community Manager', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    ];

    const milestones = [
        { year: '2018', title: 'Platform Launch', description: 'FurEver Home started as a small project to help one local shelter go digital.' },
        { year: '2020', title: '1,000 Adoptions', description: 'We hit our first major milestone, proving that technology can save lives.' },
        { year: '2022', title: 'Expanded Nationwide', description: 'Partnered with over 200 shelters across the country to bring pets to more homes.' },
        { year: '2024', title: 'The Comfort Update', description: 'Redesigned our entire platform to prioritize user well-being and emotional connection.' },
    ];

    const testimonials = [
        {
            text: "The adoption process was so smooth. I felt supported every step of the way, and now I have my best friend.",
            author: "Sarah Jenkins",
            role: "Adopter",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "FurEver Home has transformed how we operate. We're finding homes for pets faster than ever before.",
            author: "Dr. Mark R.",
            role: "Shelter Director",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
        },
        {
            text: "I love the community here. It's not just about adopting; it's about sharing the journey with others.",
            author: "Emily Chen",
            role: "Volunteer",
            image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=100&q=80"
        }
    ];

    return (
        <div className="bg-[#FDFBF7] min-h-screen font-inter text-text-primary">
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
                <div className="relative z-10 text-center max-w-4xl px-6">
                    <p className="text-white/80 font-bold tracking-widest uppercase mb-4 text-sm">Who We Are</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Connecting Hearts, <br /> Saving Lives
                    </h1>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        FurEver Home is more than just a platform. We are a movement dedicated to ensuring every pet finds a loving home and every home finds its perfect companion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/pets" className="px-8 py-4 bg-white text-text-primary rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                            Adopt a Pet
                        </Link>
                        <Link to="/community" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition">
                            Join Our Community
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-[#2D2D2D] py-16 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                    <stat.icon size={32} className="text-brand-secondary" />
                                </div>
                                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                                <p className="text-white/60 uppercase tracking-wider text-xs font-bold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-brand-primary font-bold uppercase tracking-widest mb-2 text-sm">Our Story</p>
                        <h2 className="text-4xl font-bold mb-8 text-text-primary">From a Simple Idea to a Global Movement</h2>
                        <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
                            <p>
                                It started with a single shelter struggling to get their pets seen. We realized that while there was no shortage of love, there was a shortage of connection.
                            </p>
                            <p>
                                FurEver Home was born out of the belief that technology could bridge that gap. We built a platform that not only showcases pets but tells their stories, connects communities, and simplifies the adoption process.
                            </p>
                            <p>
                                Today, we are proud to be a leading force in animal welfare, helping thousands of pets find their forever families every single month.
                            </p>
                        </div>
                        <div className="mt-10">
                            <button className="flex items-center gap-2 text-brand-primary font-bold hover:underline">
                                Read full story <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1529778873920-4da4926a7071?auto=format&fit=crop&w=600&q=80"
                                alt="Cat"
                                className="rounded-2xl shadow-lg w-full h-64 object-cover mt-12"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80"
                                alt="Dog"
                                className="rounded-2xl shadow-lg w-full h-64 object-cover"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-secondary/5 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-brand-primary font-bold uppercase tracking-widest mb-2 text-sm">Our Values</p>
                        <h2 className="text-4xl font-bold text-text-primary">What Drives Us</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-[#FDFBF7] p-10 rounded-[32px] text-center hover:shadow-xl transition duration-300 border border-[#E5E0D8]">
                                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <value.icon size={40} className="text-text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-text-primary">{value.title}</h3>
                                <p className="text-text-secondary leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-brand-primary font-bold uppercase tracking-widest mb-2 text-sm">Our Team</p>
                    <h2 className="text-4xl font-bold text-text-primary">Meet the People Behind the Paws</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="group">
                            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                                    <div className="text-white">
                                        <p className="font-bold text-lg">{member.name}</p>
                                        <p className="text-sm opacity-80">{member.role}</p>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-xl text-text-primary">{member.name}</h3>
                            <p className="text-text-secondary text-sm">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Milestones Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-brand-primary font-bold uppercase tracking-widest mb-2 text-sm">Our Journey</p>
                        <h2 className="text-4xl font-bold text-text-primary">Milestones That Shaped Us</h2>
                    </div>
                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-300 group-[.is-active]:bg-brand-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#FDFBF7] p-6 rounded-2xl border border-[#E5E0D8] shadow-sm">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-text-primary">{milestone.title}</div>
                                        <time className="font-mono text-xs font-bold text-brand-primary">{milestone.year}</time>
                                    </div>
                                    <div className="text-text-secondary text-sm">{milestone.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-[#2D2D2D] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Stories That Inspire Us</h2>
                        <p className="text-white/60 max-w-2xl mx-auto">Real stories from the people who make our community special.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition">
                                <div className="flex gap-1 text-brand-secondary mb-4">
                                    {[...Array(5)].map((_, i) => <Smile key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-lg italic mb-6 text-white/90">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <p className="font-bold">{testimonial.author}</p>
                                        <p className="text-xs text-white/60 uppercase tracking-wider">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 max-w-5xl mx-auto px-6 text-center">
                <div className="bg-[#2D2D2D] rounded-[48px] p-12 md:p-24 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
                        <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
                            Join our community today. Whether you adopt, foster, or volunteer, you are changing lives.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/pets" className="px-8 py-4 bg-white text-text-primary rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                                Find a Pet
                            </Link>
                            <Link to="/register" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
