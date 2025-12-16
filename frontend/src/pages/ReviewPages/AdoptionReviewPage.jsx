import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, ChevronLeft, User, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import useReviews from '../../hooks/useReviews';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Buttons/Button';
import Card from '../../components/common/Layout/Card';

const AdoptionReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Mock user role determination (In real app, fetch from auth/listing context)
    // For demo: Assume query param ?role=owner or ?role=adopter determines view
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role') || 'adopter'; // 'owner' or 'adopter'

    const otherPartyName = role === 'owner' ? 'Sarah Jenkins' : 'Mike Ross';
    const contextText = role === 'owner' ? `Adopter for "Buddy"` : `Owner of "Buddy"`;

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [recommend, setRecommend] = useState(null);
    const [subRatings, setSubRatings] = useState({
        cat1: 0,
        cat2: 0,
        cat3: 0
    });

    // Dynamic Categories based on Role
    const categories = role === 'owner' ? [
        { id: 'cat1', label: 'Responsiveness' },
        { id: 'cat2', label: 'Preparation' },
        { id: 'cat3', label: 'Follow-through' }
    ] : [
        { id: 'cat1', label: 'Honesty (Description Accuracy)' },
        { id: 'cat2', label: 'Communication' },
        { id: 'cat3', label: 'Pet Care Quality' }
    ];

    const prompts = role === 'owner'
        ? "How was their communication? Were they prepared for the pet? Would you recommend them to others?"
        : "Was the pet accurately described? How was the communication with the owner? Did the pet seem well-cared for?";

    const { useSubmitAdoptionReview } = useReviews();
    const submitReview = useSubmitAdoptionReview();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare payload matching backend model
        const payload = {
            application: id, // Assuming 'id' in params is application ID
            reviewer_role: role, // 'pet_owner' or 'adopter'
            rating_overall: rating,
            review_text: review,
            would_recommend: recommend === 'yes',
            // Map category ratings
            ...subRatings
        };

        // Fix keys for category ratings if they don't match exactly
        // Frontend state keys: cat1, cat2, cat3... mapped from categories array IDs
        // We need to map cat1/cat2/cat3 to actual model field names.

        // Owner Reviewing Adopter (Role = owner):
        if (role === 'owner') {
            payload.rating_responsiveness = subRatings.cat1;
            payload.rating_preparation = subRatings.cat2;
            payload.rating_followthrough = subRatings.cat3;
        } else {
            // Adopter Reviewing Owner (Role = adopter):
            payload.rating_honesty = subRatings.cat1; // Honesty
            payload.rating_communication = subRatings.cat2; // Communication
            payload.rating_care_quality = subRatings.cat3; // Pet Care
        }

        try {
            await submitReview.mutateAsync(payload);
            toast.success("Review submitted successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Review submission failed:", error);
            toast.error("Failed to submit review. You may have already reviewed this application.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 text-text-secondary hover:bg-transparent hover:text-brand-primary">
                        <ChevronLeft size={20} className="mr-1" /> Back
                    </Button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-text-primary font-merriweather">Review Experience</h1>
                        <p className="text-xs text-text-secondary">Reviewing {role === 'owner' ? 'Adopter' : 'Pet Owner'}</p>
                    </div>
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-sm">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80" alt={otherPartyName} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">Review {otherPartyName}</h2>
                    <p className="text-text-secondary font-medium">{contextText}</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Overall Rating */}
                        <div className="text-center">
                            <label className="block text-sm font-bold text-text-secondary uppercase mb-3">Overall Rating</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            size={48}
                                            fill={(hoverRating || rating) >= star ? "#FBBF24" : "none"}
                                            className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Ratings */}
                        <div className="bg-gray-50 p-6 rounded-2xl space-y-5">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-text-primary">{cat.label}</span>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setSubRatings({ ...subRatings, [cat.id]: star })}
                                                className="focus:outline-none p-1 hover:bg-white rounded-full transition"
                                            >
                                                <Star
                                                    size={24}
                                                    fill={subRatings[cat.id] >= star ? "#FBBF24" : "none"}
                                                    className={subRatings[cat.id] >= star ? "text-yellow-400" : "text-gray-300"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">Tell us about your experience</label>
                            <p className="text-xs text-text-secondary mb-3 italic">{prompts}</p>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full p-4 rounded-xl border border-border focus:ring-1 focus:ring-brand-primary outline-none min-h-[160px] text-base"
                                placeholder="Share your honest feedback..."
                            />
                            <div className="text-right text-xs text-text-tertiary mt-1">Minimum 20 characters</div>
                        </div>

                        {/* Recommendation */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-3">Would you recommend {role === 'owner' ? 'this adopter' : 'this owner'}?</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-4 rounded-xl border cursor-pointer text-center transition ${recommend === 'yes' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-border hover:bg-gray-50'}`}>
                                    <input type="radio" name="recommend" value="yes" className="hidden" onClick={() => setRecommend('yes')} />
                                    <span className={`font-bold block text-lg ${recommend === 'yes' ? 'text-green-700' : 'text-text-primary'}`}>Yes</span>
                                </label>
                                <label className={`flex-1 p-4 rounded-xl border cursor-pointer text-center transition ${recommend === 'no' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-border hover:bg-gray-50'}`}>
                                    <input type="radio" name="recommend" value="no" className="hidden" onClick={() => setRecommend('no')} />
                                    <span className={`font-bold block text-lg ${recommend === 'no' ? 'text-red-700' : 'text-text-primary'}`}>No</span>
                                </label>
                            </div>
                        </div>

                        {/* Privacy Notice */}
                        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                            <Shield className="text-blue-600 shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Your review will be visible on <strong>{otherPartyName}'s</strong> profile.
                                Your full name will be displayed as <strong>Your Name (First Name Last Initial)</strong> to protect your privacy.
                            </p>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col gap-3 pt-4">
                            <Button variant="primary" size="lg" className="w-full justify-center text-lg py-4" disabled={!rating || review.length < 20 || !recommend}>
                                Submit Review
                            </Button>
                            <div className="text-center">
                                <button type="button" onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:underline">
                                    Skip for now
                                </button>
                            </div>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdoptionReviewPage;
