import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Lightbulb, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Checkbox from '../../components/common/Form/Checkbox';

const ApplicationSubmitPage = () => {
    const { id } = useParams(); // Listing ID
    const navigate = useNavigate();

    // Mock Data
    const pet = {
        name: 'Bella',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
        breed: 'Golden Retriever',
        owner: {
            name: 'Alex Morgan',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=facearea&facepad=2&w=100&h=100&q=80'
        },
        fee: 50
    };

    const [message, setMessage] = useState('');
    const [agreements, setAgreements] = useState({
        guarantee: false,
        meet: false,
        accurate: false
    });

    const isReady = message.length >= 50 && Object.values(agreements).every(Boolean);

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Apply to Adopt {pet.name}</h1>
                        <p className="text-text-secondary">Take the next step in bringing {pet.name} home.</p>
                    </div>

                    {/* Profile Review Card */}
                    <Card className="p-6 border-l-4 border-l-green-500">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-text-primary">Your Adopter Profile</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-bold">Readiness Score: 85%</span>
                                    <span className="text-xs text-text-tertiary">Excellent</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Review Profile</Button>
                        </div>
                        <p className="text-sm text-text-secondary">Your profile details (Housing, Lifestyle, Experience) will be shared with {pet.owner.name} automatically.</p>
                    </Card>

                    {/* Personalized Message */}
                    <div className="space-y-3">
                        <label className="block font-bold text-text-primary">
                            Message to {pet.owner.name} <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-2">
                            <p className="font-bold mb-1">Tips for a great application:</p>
                            <ul className="list-disc list-inside space-y-1 opacity-80">
                                <li>Why is {pet.name} the right fit for you?</li>
                                <li>How will you handle their specific needs?</li>
                                <li>Share a bit about your daily routine.</li>
                            </ul>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-48 p-4 rounded-xl border border-border focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none shadow-sm"
                            placeholder={`Hi ${pet.owner.name}, I'd love to adopt ${pet.name} because...`}
                        ></textarea>
                        <p className="text-right text-xs text-text-tertiary">{message.length} characters (min 50)</p>
                    </div>

                    {/* Agreements */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <h3 className="font-bold text-text-primary">Commitment Statement</h3>
                        <Card className="p-4 space-y-3 bg-gray-50 border-gray-100">
                            <Checkbox
                                label="I understand this application is not a guarantee of adoption."
                                checked={agreements.guarantee}
                                onChange={() => setAgreements(prev => ({ ...prev, guarantee: !prev.guarantee }))}
                            />
                            <Checkbox
                                label="I agree to meet in person before finalizing any adoption."
                                checked={agreements.meet}
                                onChange={() => setAgreements(prev => ({ ...prev, meet: !prev.meet }))}
                            />
                            <Checkbox
                                label="I confirm all information in my profile is accurate and honest."
                                checked={agreements.accurate}
                                onChange={() => setAgreements(prev => ({ ...prev, accurate: !prev.accurate }))}
                            />
                        </Card>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="primary"
                            className="flex-1 py-4 text-lg shadow-lg"
                            disabled={!isReady}
                            onClick={() => {
                                toast.success("Application Submitted!");
                                navigate('/applications');
                            }}
                        >
                            Submit Application
                        </Button>
                        <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                    </div>
                </div>

                {/* Sidebar - Listing Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="overflow-hidden">
                            <div className="h-48 bg-gray-100">
                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-text-primary mb-1">{pet.name}</h2>
                                <p className="text-text-secondary font-medium mb-4">{pet.breed}</p>

                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                                    <img src={pet.owner.avatar} alt={pet.owner.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="text-xs text-text-tertiary uppercase font-bold">Listed By</p>
                                        <p className="font-bold text-text-primary text-sm">{pet.owner.name}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-text-secondary">Adoption Fee</span>
                                    <span className="font-bold text-brand-primary">${pet.fee}</span>
                                </div>

                                <button className="w-full mt-4 text-brand-primary text-sm font-bold hover:underline flex items-center justify-center">
                                    View Full Listing <ArrowRight size={16} className="ml-1" />
                                </button>
                            </div>
                        </Card>

                        <div className="bg-[#FFF9F2] p-6 rounded-2xl border border-[#FFE8CC] flex gap-3">
                            <AlertCircle className="text-orange-500 shrink-0" />
                            <p className="text-xs text-orange-800 leading-relaxed">
                                <strong>Safety First:</strong> Never send money for a pet you haven't met. If asked for a deposit before meeting, please report the listing.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ApplicationSubmitPage;
