import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Buttons/Button';
import { CheckCircle, ArrowRight, Heart, DollarSign, Calendar } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const BecomeProviderPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleStart = () => {
        navigate('/service-provider/register');
    };

    return (
        <div className="min-h-screen bg-background-light">
            {/* Hero Section */}
            <div className="bg-brand-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-merriweather mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Turn Your Passion for Pets into a Profession
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        Join our network of trusted pet service providers. Connect with pet owners, earn money, and make a difference.
                    </p>
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleStart}
                            className="font-bold text-brand-primary bg-white hover:bg-gray-100"
                        >
                            Start Your Application <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-16 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-border text-center hover:shadow-md transition duration-300">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="text-green-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 font-merriweather">Do What You Love</h3>
                        <p className="text-text-secondary">
                            Whether it's fostering, grooming, or training, build a career around caring for animals.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-border text-center hover:shadow-md transition duration-300">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="text-blue-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 font-merriweather">Earn on Your Terms</h3>
                        <p className="text-text-secondary">
                            Set your own rates and services. Keep 100% of your earnings (we take 0% commission).
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-border text-center hover:shadow-md transition duration-300">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="text-purple-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 font-merriweather">Flexible Schedule</h3>
                        <p className="text-text-secondary">
                            Manage your availability with our easy tools. Work when you want, where you want.
                        </p>
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="py-16 bg-white border-t border-border">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center font-merriweather mb-12">How It Works</h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {[
                            "Sign up and verify your email (if you haven't already).",
                            "Complete your business profile with details about your services.",
                            "Upload photos and set your business hours to showcase your work.",
                            "Submit your application for review by our team.",
                            "Once approved, your profile goes live and you can start accepting bookings!"
                        ].map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                    {index + 1}
                                </div>
                                <p className="text-lg text-text-primary pt-1">{step}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleStart}
                        >
                            Become a Provider Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeProviderPage;
