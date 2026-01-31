import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import Card from '../../../common/Layout/Card';

const ReviewsTab = ({ provider }) => {
    // Helper to render rating bars
    const renderRatingBar = (label, score) => (
        <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-text-secondary w-32">{label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-brand-secondary-light rounded-full"
                    style={{ width: `${(score / 5) * 100}%` }}
                />
            </div>
            <span className="text-sm font-bold text-text-primary w-8 text-right">{score ? score.toFixed(1) : '-'}</span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters Section (Mock) */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl border border-border">
                <h3 className="font-bold text-lg mb-4 md:mb-0">Reviews ({provider.reviews_count})</h3>
                <div className="flex gap-4">
                    <select className="p-2 border border-border rounded-lg text-sm bg-gray-50">
                        <option>Most Recent</option>
                        <option>Highest Rated</option>
                        <option>Lowest Rated</option>
                    </select>
                    <select className="p-2 border border-border rounded-lg text-sm bg-gray-50">
                        <option>All Stars</option>
                        <option>5 Stars</option>
                        <option>4 Stars</option>
                        <option>3 Stars</option>
                    </select>
                </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Overall Column */}
                <div className="col-span-1 text-center md:text-left flex flex-col justify-center">
                    <div className="text-5xl font-bold text-text-primary mb-2 font-merriweather">{provider.avg_rating || '0.0'}</div>
                    <div className="flex justify-center md:justify-start gap-1 text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={24} fill={i < Math.round(provider.avg_rating || 0) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <p className="text-text-secondary font-medium">{provider.reviews_count} Reviews</p>
                </div>

                {/* Breakdown Column */}
                <div className="col-span-2 bg-gray-50 rounded-2xl p-6 border border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                        <div>
                            {renderRatingBar('Communication', provider.avg_communication)}
                            {renderRatingBar('Cleanliness', provider.avg_cleanliness)}
                        </div>
                        <div>
                            {renderRatingBar('Quality of Care', provider.avg_quality)}
                            {renderRatingBar('Value', provider.avg_value)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {provider.reviews?.map((review) => (
                    <Card key={review.id} className="p-6 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {review.reviewer?.first_name?.[0] || 'U'}
                                </div>
                                <div>
                                    <div className="font-bold text-text-primary">{review.reviewer?.first_name || 'Anonymous User'}</div>
                                    <div className="text-xs text-text-tertiary">{new Date(review.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                            </div>
                        </div>

                        <p className="text-text-secondary leading-relaxed mb-4">{review.comment}</p>

                        {review.verified_client && (
                            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                                <Shield size={12} fill="currentColor" /> Verified Stay
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReviewsTab;
