import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-natural text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div>
                        <h3 className="text-2xl font-bold font-logo mb-6">FurEver<span className="text-primary">Home</span></h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Connecting loving families with pets in need. Join us in our mission to give every animal a safe and happy home.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action transition duration-300">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action transition duration-300">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action transition duration-300">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-primary transition">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition">Adopt a Pet</a></li>
                            <li><a href="#" className="hover:text-primary transition">Success Stories</a></li>
                            <li><a href="#" className="hover:text-primary transition">Volunteer</a></li>
                            <li><a href="#" className="hover:text-primary transition">Donate</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-primary transition">Pet Care Tips</a></li>
                            <li><a href="#" className="hover:text-primary transition">Adoption FAQ</a></li>
                            <li><a href="#" className="hover:text-primary transition">Shelter Directory</a></li>
                            <li><a href="#" className="hover:text-primary transition">Lost & Found</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-3 mt-1 text-action" />
                                <span>123 Pet Lane, Animal City, AC 12345</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="mr-3 text-action" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="mr-3 text-action" />
                                <span>hello@fureverhome.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} FurEverHome. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
