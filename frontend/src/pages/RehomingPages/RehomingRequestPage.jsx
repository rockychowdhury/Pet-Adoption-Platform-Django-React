import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import useRehoming from '../../hooks/useRehoming';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Checkbox from '../../components/common/Form/Checkbox';

const RehomingRequestPage = () => {
    const { id } = useParams(); // Rehoming Listing ID
    const navigate = useNavigate();
    const api = useAPI();
    const { user } = useAuth();
    const { useGetListingDetail } = useRehoming();

    // Fetch Listing Data
    const { data: listing, isLoading: listingLoading, isError } = useGetListingDetail(id);

    // Fetch Adopter Profile (Optional but recommended to show readiness)
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['adopterProfile', 'me'],
        queryFn: async () => {
            try {
                const res = await api.get('/adoption/adopter-profile/me/');
                return res.data;
            } catch (err) {
                return null; // Profile might not exist, handled gracefully
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
            return await api.post('/rehoming/requests/', payload);
        },
        onSuccess: () => {
            toast.success("Request sent successfully!");
            navigate('/dashboard/applications'); // Or dashboard/rehoming/requests if that exists
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.response?.data?.detail || "Failed to send request.");
        }
    });

    if (listingLoading) return <div className="p-12 text-center">Loading...</div>;
    if (isError || !listing) return <div className="p-12 text-center text-red-500">Listing not found.</div>;

    // We can block if no profile, or just warn. Rehoming might be more flexible.
    // Let's enforce profile for consistency if desired, or at least verification.
    // For now, mirroring ApplicationSubmitPage's profile check logic but adapting text.
    if (profileLoading) return null;

    if (!profile) {
        return (
            <div className="min-h-screen bg-bg-primary py-12 px-4 flex items-center justify-center">
                <Card className="max-w-md p-8 text-center">
                    <AlertCircle size={48} className="mx-auto text-brand-primary mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Profile Required</h2>
                    <p className="text-text-secondary mb-6">To ensure trust, please complete your Adopter Profile before contacting owners.</p>
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
            listing: listing.id,
            message: message
        });
    };

    const pet = listing.pet;
    const owner = listing.owner;

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Contact {owner?.first_name} about {pet.name}</h1>
                        <p className="text-text-secondary">Start a conversation to see if you're a good match.</p>
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
                        <p className="text-sm text-text-secondary">Your profile summary will be shared with the owner to help them decide.</p>
                    </Card>

                    {/* Personalized Message */}
                    <div className="space-y-3">
                        <label className="block font-bold text-text-primary">
                            Message to Owner <span className="text-status-error">*</span>
                        </label>
                        <div className="bg-status-info/10 p-4 rounded-xl text-sm text-status-info mb-2">
                            <p className="font-bold mb-1">Tips:</p>
                            <ul className="list-disc list-inside space-y-1 opacity-80">
                                <li>Introduce yourself and your household.</li>
                                <li>Mention why {pet.name} caught your eye.</li>
                                <li>Ask any specific questions you have.</li>
                            </ul>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-48 p-4 rounded-xl border border-border focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none shadow-sm"
                            placeholder={`Hi ${owner?.first_name}, I saw your listing for ${pet.name} and...`}
                        ></textarea>
                        <p className="text-right text-xs text-text-tertiary">{message.length} characters (min 50)</p>
                    </div>

                    {/* Agreements */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <h3 className="font-bold text-text-primary">Safety & Commitment</h3>
                        <Card className="p-4 space-y-3 bg-bg-surface border-border">
                            <Checkbox
                                label="I understand that PetCircle does not verify every claim made by owners."
                                checked={agreements.guarantee}
                                onChange={() => setAgreements(prev => ({ ...prev, guarantee: !prev.guarantee }))}
                            />
                            <Checkbox
                                label="I agree to meet in a public place for the first introduction."
                                checked={agreements.meet}
                                onChange={() => setAgreements(prev => ({ ...prev, meet: !prev.meet }))}
                            />
                            <Checkbox
                                label="I confirm my profile information is accurate."
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
                            Send Request
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
                                    src={pet.main_photo || 'https://via.placeholder.com/400x300'}
                                    alt={pet.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-text-primary mb-1">{pet.name}</h2>
                                <p className="text-text-secondary font-medium mb-4">{pet.breed}</p>

                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                                        {owner?.first_name?.[0] || 'O'}
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-tertiary uppercase font-bold">Listed By</p>
                                        <p className="font-bold text-text-primary text-sm">{owner?.first_name} {owner?.last_name}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/rehoming/listings/${id}`)}
                                    className="w-full mt-4 text-brand-primary text-sm font-bold hover:underline flex items-center justify-center"
                                >
                                    View Full Listing <ArrowRight size={16} className="ml-1" />
                                </button>
                            </div>
                        </Card>

                        <div className="bg-status-warning/10 p-6 rounded-2xl border border-status-warning/20 flex gap-3">
                            <Shield size={20} className="text-status-warning shrink-0" />
                            <p className="text-xs text-status-warning leading-relaxed">
                                <strong>Safety Reminder:</strong> Do not transfer money or take the pet home until you have met in person and are comfortable.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RehomingRequestPage;
