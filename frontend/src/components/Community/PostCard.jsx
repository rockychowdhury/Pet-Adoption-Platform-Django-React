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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-4 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {post.user.photoURL ? (
                            <img src={post.user.photoURL} alt={post.user.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                {post.user.first_name?.[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{post.user.first_name} {post.user.last_name}</h3>
                        <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="px-4 pb-2">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>

            {post.image && (
                <div className="w-full h-64 sm:h-80 bg-gray-100 mt-2">
                    <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-4 border-t border-gray-50 flex items-center justify-between text-gray-500">
                <div className="flex gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 transition ${post.is_liked ? 'text-red-500' : 'hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={post.is_liked ? "currentColor" : "none"} />
                        <span className="text-sm font-medium">{post.reaction_count}</span>
                    </button>
                    <button
                        onClick={() => setIsCommenting(!isCommenting)}
                        className="flex items-center gap-1.5 hover:text-blue-500 transition"
                    >
                        <MessageCircle size={20} />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                    </button>
                </div>
                <button className="hover:text-action transition">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Comments Section */}
            {(isCommenting || post.comments.length > 0) && (
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 mb-4 last:mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                {comment.user.photoURL ? (
                                    <img src={comment.user.photoURL} alt={comment.user.first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                                        {comment.user.first_name?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">
                                <p className="text-xs font-bold text-gray-800 mb-0.5">{comment.user.first_name} {comment.user.last_name}</p>
                                <p className="text-sm text-gray-600">{comment.content}</p>
                            </div>
                        </div>
                    ))}

                    {user && (
                        <form onSubmit={handleComment} className="flex gap-3 mt-4">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                {/* Current user avatar placeholder */}
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                                    {user.first_name?.[0]}
                                </div>
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:border-action focus:ring-1 focus:ring-action outline-none text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !commentText.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-action font-bold text-xs disabled:opacity-50"
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
