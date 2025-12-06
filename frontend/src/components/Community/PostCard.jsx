import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const api = useAPI();
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (!user) return toast.error("Please login to react.");
        try {
            await api.post(`/community/posts/${post.id}/react/`, { reaction_type: 'like' });
            onUpdate(); // Refresh feed
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setLoading(true);
        try {
            await api.post(`/community/posts/${post.id}/comment/`, { content: commentText });
            setCommentText('');
            setIsCommenting(false);
            onUpdate();
        } catch (error) {
            toast.error("Failed to post comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-bg-surface rounded-[24px] shadow-soft border border-white/20 overflow-hidden mb-6">
            <div className="p-5 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-primary overflow-hidden border border-white/20">
                        {post.user.photoURL ? (
                            <img src={post.user.photoURL} alt={post.user.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-secondary font-bold text-base">
                                {post.user.first_name?.[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-text-primary text-base">{post.user.first_name} {post.user.last_name}</h3>
                            {/* Mock Role */}
                            <span className="text-[10px] font-bold text-text-secondary bg-bg-primary px-2 py-0.5 rounded-full">Adopter</span>
                        </div>
                        <p className="text-[10px] text-text-secondary font-medium mt-0.5">
                            Adopted 2 weeks ago • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <button className="text-text-secondary hover:text-text-primary transition">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="px-5 pb-3">
                <p className="text-text-primary text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {post.image && (
                <div className="w-full h-64 sm:h-80 bg-bg-secondary mt-2">
                    <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="px-5 py-4 flex items-center justify-between text-text-secondary">
                <div className="flex gap-5">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 transition group ${post.is_liked ? 'text-red-500' : 'hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={post.is_liked ? "currentColor" : "none"} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">{post.reaction_count}</span>
                    </button>
                    <button
                        onClick={() => setIsCommenting(!isCommenting)}
                        className="flex items-center gap-1.5 hover:text-brand-secondary transition group"
                    >
                        <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">{post.comments.length}</span>
                    </button>
                </div>
                <button className="hover:text-brand-secondary transition transform hover:scale-110">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Comments Section */}
            {(isCommenting || post.comments.length > 0) && (
                <div className="bg-[#FAF7F5] p-5 border-t border-white/10">
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 mb-4 last:mb-2">
                            <div className="w-8 h-8 rounded-full bg-bg-surface overflow-hidden flex-shrink-0 border border-white/20 mt-1">
                                {comment.user.photoURL ? (
                                    <img src={comment.user.photoURL} alt={comment.user.first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs font-bold">
                                        {comment.user.first_name?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-black/5">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <p className="text-xs font-bold text-text-primary">{comment.user.first_name} {comment.user.last_name}</p>
                                    <span className="text-[10px] text-text-secondary font-medium">(Shelter volunteer)</span>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))}

                    {user && (
                        <form onSubmit={handleComment} className="flex gap-3 mt-6 items-center">
                            <div className="w-8 h-8 rounded-full bg-bg-surface overflow-hidden flex-shrink-0 border border-white/20">
                                <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs font-bold">
                                    {user.first_name?.[0]}
                                </div>
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a supportive comment..."
                                    className="w-full pl-5 pr-24 py-3 rounded-full bg-white border-none outline-none text-sm text-text-primary placeholder:text-text-secondary/50 shadow-sm focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !commentText.trim()}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#2D2D2D] text-white rounded-full font-bold text-xs hover:opacity-90 transition disabled:opacity-50"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
