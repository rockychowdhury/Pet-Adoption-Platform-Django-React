import React from 'react';
import { Search, MessageCircle, Home } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search size={40} />,
            title: 'Search',
            description: 'Browse through our list of available pets and find your perfect match.',
            color: 'bg-primary'
        },
        {
            icon: <MessageCircle size={40} />,
            title: 'Connect',
            description: 'Message the shelter or owner to ask questions and schedule a visit.',
            color: 'bg-secondary'
        },
        {
            icon: <Home size={40} />,
            title: 'Adopt',
            description: 'Complete the adoption process and bring your new best friend home.',
            color: 'bg-marble'
        }
    ];

    return (
        <section className="py-20 bg-newBg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-natural mb-4 font-logo">How It <span className="text-action">Works</span></h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-inter">Adopting a pet is easy and straightforward. Here is how you can get started.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {steps.map((step, index) => (
                        <div key={index} className="relative bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 text-center group">
                            <div className={`w-20 h-20 mx-auto ${step.color} rounded-2xl flex items-center justify-center text-action mb-6 transform group-hover:rotate-6 transition duration-300`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-natural mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.description}</p>

                            {/* Connector line for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-5 w-10 border-t-2 border-dashed border-gray-300 transform -translate-y-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
