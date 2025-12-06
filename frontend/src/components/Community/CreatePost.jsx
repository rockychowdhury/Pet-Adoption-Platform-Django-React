import React, { useState } from 'react';
import { Image, Send } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuth();
    const api = useAPI();
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await api.post('/community/posts/', { content, image: imageUrl || null });
            setContent('');
            setImageUrl('');
            setShowImageInput(false);
            toast.success("Post created!");
            onPostCreated();
        } catch (error) {
            toast.error("Failed to create post.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-8">
            <p className="text-gray-600">Please <span className="font-bold text-action">login</span> to share your story!</p>
        </div>
    );

    return (
        <div className="bg-bg-surface p-5 rounded-[24px] shadow-soft border border-white/20 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-primary overflow-hidden flex-shrink-0 border border-white/20">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-secondary font-bold text-base">
                                {user.first_name?.[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Share an adoption story, ask for advice, or celebrate your furry friend...`}
                            className="w-full resize-none outline-none bg-bg-primary rounded-2xl p-4 text-text-primary placeholder:text-text-secondary/50 min-h-[80px] border-none focus:ring-0 text-base"
                        />

                        {showImageInput && (
                            <div className="mt-3 bg-bg-primary rounded-xl p-3">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5 block">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/my-pup-at-the-park.jpg"
                                    className="w-full px-3 py-2 bg-white rounded-lg text-xs border-none outline-none focus:ring-2 focus:ring-brand-secondary/20 text-text-primary placeholder:text-text-secondary/30"
                                />
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <button
                                type="button"
                                onClick={() => setShowImageInput(!showImageInput)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${showImageInput ? 'bg-brand-secondary/10 text-brand-secondary' : 'bg-bg-primary text-text-secondary hover:bg-bg-secondary'}`}
                            >
                                <Image size={16} />
                                Photo
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !content.trim()}
                                className="px-6 py-2 bg-text-primary text-bg-primary rounded-full font-bold text-xs hover:opacity-90 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
