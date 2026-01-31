import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentReviewsList = ({ reviews }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Recent Reviews</h3>
                <Link to="/provider/reviews" className="text-sm font-medium text-gray-500 hover:text-brand-primary">
                    View All
                </Link>
            </div>
            <div className="p-0">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-900">{review.reviewer?.first_name || 'Anonymous'}</span>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={i < review.rating_overall ? "text-yellow-400 fill-current" : "text-gray-200"} />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">"{review.review_text}"</p>
                            <button className="text-xs text-brand-primary font-medium mt-3 hover:underline">Reply</button>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-400 text-sm">
                        No reviews received yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentReviewsList;
