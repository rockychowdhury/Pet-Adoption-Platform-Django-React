import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-bg-secondary text-text-primary pt-24 pb-12 font-jakarta overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[120px] -z-10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
                            <h3 className="text-4xl font-black font-logo text-text-primary tracking-tight">
                                Pet<span className="text-brand-primary">Circle</span>
                            </h3>
                        </Link>
                        <p className="text-text-secondary text-base leading-relaxed max-w-xs font-medium opacity-80">
                            A warm, trusted space where pet lovers meet, share stories, and save lives together through the power of community.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={<Instagram size={20} />} href="#" />
                            <SocialIcon icon={<Facebook size={20} />} href="#" />
                            <SocialIcon icon={<Twitter size={20} />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-10">Navigation</h4>
                        <ul className="space-y-5 text-[13px] font-black uppercase tracking-widest text-text-secondary">
                            <li><FooterLink to="/adopt">Find a Pet</FooterLink></li>
                            <li><FooterLink to="/rehoming">Rehome a Pet</FooterLink></li>
                            <li><FooterLink to="/services">Pet Services</FooterLink></li>
                            <li><FooterLink to="/community">Community Feed</FooterLink></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-10">Resources</h4>
                        <ul className="space-y-5 text-[13px] font-black uppercase tracking-widest text-text-secondary">
                            <li><FooterLink to="/how-it-works">How It Works</FooterLink></li>
                            <li><FooterLink to="/faq">Help Center (FAQ)</FooterLink></li>
                            <li><FooterLink to="/about">About Us</FooterLink></li>
                            <li><FooterLink to="/contact">Contact Support</FooterLink></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/50 mb-8">Legal</h4>
                        <ul className="space-y-4 text-sm font-bold text-text-secondary">
                            <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
                            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/safety">Safety Guidelines</FooterLink></li>
                            <li><FooterLink to="/cookie-policy">Cookie Policy</FooterLink></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-12 text-center">
                    <p className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.3em]">
                        &copy; {new Date().getFullYear()} PetCircle. Crafted with <span className="text-brand-primary mx-1">♥</span> for all companions.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Helper Components
const SocialIcon = ({ icon, href }) => (
    <a
        href={href}
        className="w-11 h-11 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 transform hover:-translate-y-1"
    >
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <Link to={to} className="transition-all duration-300 text-text-secondary hover:text-text-primary flex items-center gap-2 group">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary opacity-0 -ml-3 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0"></span>
        {children}
    </Link>
);

export default Footer;
