import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import usePets from '../../hooks/usePets';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Checkbox from '../../components/common/Form/Checkbox';

const ApplicationSubmitPage = () => {
    const { id } = useParams(); // Listing ID
    const navigate = useNavigate();
    const api = useAPI();
    const { user } = useAuth();
    const { useGetPet } = usePets();

    // Fetch Pet Data
    const { data: pet, isLoading: petLoading, isError } = useGetPet(id);

    // Fetch Adopter Profile
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['adopterProfile', 'me'],
        queryFn: async () => {
            try {
                const res = await api.get('/adoption/adopter-profile/me/');
                return res.data;
            } catch (err) {
                return null;
            }
        },
        retry: false
    });

    const [message, setMessage] = useState('');
    const [agreements, setAgreements] = useState({
        guarantee: false,
        meet: false,
        accurate: false
    });

    const submitMutation = useMutation({
        mutationFn: async (payload) => {
            return await api.post('/adoption/applications/', payload);
        },
        onSuccess: () => {
            toast.success("Application Submitted Successfully!");
            navigate('/dashboard/applications');
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.response?.data?.detail || "Failed to submit application.");
        }
    });

    if (petLoading || profileLoading) return <div className="p-12 text-center">Loading...</div>;
    if (isError || !pet) return <div className="p-12 text-center text-red-500">Pet listing not found.</div>;

    // Redirect if no profile
    if (!profile && !profileLoading) {
        return (
            <div className="min-h-screen bg-bg-primary py-12 px-4 flex items-center justify-center">
                <Card className="max-w-md p-8 text-center">
                    <AlertCircle size={48} className="mx-auto text-brand-primary mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Profile Required</h2>
                    <p className="text-text-secondary mb-6">You need to complete your Adopter Profile before applying for a pet.</p>
                    <Button variant="primary" onClick={() => navigate('/dashboard/applications/setup')}>
                        Create Adopter Profile
                    </Button>
                </Card>
            </div>
        );
    }

    const isReady = message.length >= 50 && Object.values(agreements).every(Boolean);

    const handleSubmit = () => {
        if (!isReady) return;
        submitMutation.mutate({
            pet: pet.id,
            message: message,
            custom_answers: {} // Placeholder for custom questions if implemented
        });
    };

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Apply to Adopt {pet.pet_name}</h1>
                        <p className="text-text-secondary">Take the next step in bringing {pet.pet_name} home.</p>
                    </div>

                    {/* Profile Review Card */}
                    <Card className="p-6 border-l-4 border-l-status-success">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-text-primary">Your Adopter Profile</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${profile.readiness_score >= 80 ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'
                                        }`}>
                                        Readiness Score: {profile.readiness_score}%
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/applications/setup')}>Edit Profile</Button>
                        </div>
                        <p className="text-sm text-text-secondary">Your profile details (Housing, Lifestyle, Experience) will be shared with {pet.owner_name} automatically.</p>
                    </Card>

                    {/* Personalized Message */}
                    <div className="space-y-3">
                        <label className="block font-bold text-text-primary">
                            Message to {pet.owner_name} <span className="text-status-error">*</span>
                        </label>
                        <div className="bg-status-info/10 p-4 rounded-xl text-sm text-status-info mb-2">
                            <p className="font-bold mb-1">Tips for a great application:</p>
                            <ul className="list-disc list-inside space-y-1 opacity-80">
                                <li>Why is {pet.pet_name} the right fit for you?</li>
                                <li>How will you handle their specific needs?</li>
                                <li>Share a bit about your daily routine.</li>
                            </ul>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-48 p-4 rounded-xl border border-border focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none shadow-sm"
                            placeholder={`Hi ${pet.owner_name}, I'd love to adopt ${pet.pet_name} because...`}
                        ></textarea>
                        <p className="text-right text-xs text-text-tertiary">{message.length} characters (min 50)</p>
                    </div>

                    {/* Agreements */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <h3 className="font-bold text-text-primary">Commitment Statement</h3>
                        <Card className="p-4 space-y-3 bg-bg-surface border-border">
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
                            disabled={!isReady || submitMutation.isPending}
                            isLoading={submitMutation.isPending}
                            onClick={handleSubmit}
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
                            <div className="h-48 bg-bg-secondary">
                                <img
                                    src={pet.main_photo || (pet.photos && pet.photos[0]) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'}
                                    alt={pet.pet_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-text-primary mb-1">{pet.pet_name}</h2>
                                <p className="text-text-secondary font-medium mb-4">{pet.breed}</p>

                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                        {pet.pet_owner_avatar ? (
                                            <img src={pet.pet_owner_avatar} alt={pet.owner_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-tertiary uppercase font-bold">Listed By</p>
                                        <p className="font-bold text-text-primary text-sm">{pet.owner_name || 'Pet Owner'}</p>
                                    </div>
                                </div>

                                {pet.adoption_fee && parseInt(pet.adoption_fee) > 0 ? (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-text-secondary">Adoption Fee</span>
                                        <span className="font-bold text-brand-primary">${pet.adoption_fee}</span>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-text-secondary">Adoption Fee</span>
                                        <span className="font-bold text-brand-primary">None</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate(`/pets/${id}`)}
                                    className="w-full mt-4 text-brand-primary text-sm font-bold hover:underline flex items-center justify-center"
                                >
                                    View Full Listing <ArrowRight size={16} className="ml-1" />
                                </button>
                            </div>
                        </Card>

                        <div className="bg-status-warning/10 p-6 rounded-2xl border border-status-warning/20 flex gap-3">
                            <AlertCircle className="text-status-warning shrink-0" />
                            <p className="text-xs text-status-warning leading-relaxed">
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
