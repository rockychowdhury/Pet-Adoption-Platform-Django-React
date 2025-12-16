import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-brand-primary text-text-inverted pt-20 pb-10 font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold font-logo text-white">
                            FurEver <span className="text-white">Home</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            A warm, trusted space where pet lovers meet, share stories, and save lives together.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-secondary transition duration-300 text-white">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-secondary transition duration-300 text-white">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-secondary transition duration-300 text-white">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li><Link to="/pets" className="hover:text-brand-secondary transition">Browse Pets</Link></li>
                            <li><Link to="/community" className="hover:text-brand-secondary transition">Community Forum</Link></li>
                            <li><Link to="/login" className="hover:text-brand-secondary transition">Shelter Login</Link></li>
                            <li><Link to="/about" className="hover:text-brand-secondary transition">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li><Link to="/guide" className="hover:text-brand-secondary transition">Adoption Guide</Link></li>
                            <li><Link to="/tips" className="hover:text-brand-secondary transition">Pet Care Tips</Link></li>
                            <li><Link to="/faq" className="hover:text-brand-secondary transition">FAQs</Link></li>
                            <li><Link to="/support" className="hover:text-brand-secondary transition">Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-500 mt-0.5" />
                                <span>123 FurEver Lane, Petville</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-500" />
                                <span>hello@fureverhome.org</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} PetCircle. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
