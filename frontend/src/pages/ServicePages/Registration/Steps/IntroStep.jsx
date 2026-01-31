import React from 'react';
import { Shield, Check, Users, ArrowRight } from 'lucide-react';
import Button from '../../../../components/common/Buttons/Button';
import Card from '../../../../components/common/Layout/Card';

const IntroStep = ({ onStart, isLoading }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold font-merriweather text-text-primary">Become a Pet Circle Service Provider</h1>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    Join our community of trusted professionals. Whether you're a vet, foster parent, trainer, or groomer,
                    we provide the tools you need to succeed.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        icon: Users,
                        title: 'Connect with Clients',
                        desc: 'Reach thousands of pet owners looking for your specific services in your area.'
                    },
                    {
                        icon: Shield,
                        title: 'Build Trust',
                        desc: 'Our verification capability builds instant credibility with potential clients.'
                    },
                    {
                        icon: Check,
                        title: 'Manage Easily',
                        desc: 'Use our dashboard to manage bookings, hours, and your profile all in one place.'
                    }
                ].map((item, i) => (
                    <Card key={i} className="p-6 text-center hover:-translate-y-1 transition-transform border border-border">
                        <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                            <item.icon size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-text-secondary text-sm">{item.desc}</p>
                    </Card>
                ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 max-w-3xl mx-auto">
                <h3 className="font-bold text-blue-800 mb-2">Before you start:</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>Have your business contact details ready.</li>
                    <li>Prepare a description of your services.</li>
                    <li>You will need to upload photos later.</li>
                    <li>Verification may require proof of identity or certifications.</li>
                </ul>
            </div>

            <div className="flex justify-center pt-8">
                <Button
                    onClick={onStart}
                    size="lg"
                    variant="primary"
                    disabled={isLoading}
                    className="px-12 py-4 text-lg"
                >
                    {isLoading ? 'Starting...' : 'Start Application'} <ArrowRight className="ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default IntroStep;
