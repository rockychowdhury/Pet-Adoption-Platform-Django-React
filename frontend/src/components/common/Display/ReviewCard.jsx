import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';
import Rating from './Rating';
import { ThumbsUp } from 'lucide-react';

const ReviewCard = ({
    author,
    avatar,
    date,
    rating,
    content,
    helpfulCount,
    onHelpful,
    className = '',
}) => {
    return (
        <div className={`bg-bg-surface p-6 rounded-2xl border border-border shadow-sm ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Avatar src={avatar} alt={author} size="md" />
                    <div>
                        <h4 className="font-bold text-text-primary text-sm">{author}</h4>
                        <p className="text-xs text-text-tertiary">{date}</p>
                    </div>
                </div>
                <Rating value={rating} readOnly size="sm" />
            </div>

            <div className="text-text-secondary text-sm leading-relaxed mb-4">
                {content}
            </div>

            {helpfulCount !== undefined && (
                <div className="flex items-center gap-4 border-t border-border pt-4">
                    <button
                        onClick={onHelpful}
                        className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors"
                    >
                        <ThumbsUp size={14} />
                        Helpful ({helpfulCount})
                    </button>
                    <button className="text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors">
                        Report
                    </button>
                </div>
            )}
        </div>
    );
};

ReviewCard.propTypes = {
    author: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    date: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    helpfulCount: PropTypes.number,
    onHelpful: PropTypes.func,
    className: PropTypes.string,
};

export default ReviewCard;
