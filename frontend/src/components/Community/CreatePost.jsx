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
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                {user.first_name?.[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`What's on your mind, ${user.first_name}?`}
                            className="w-full resize-none outline-none text-gray-700 placeholder-gray-400 min-h-[80px]"
                        />

                        {showImageInput && (
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Paste image URL here..."
                                className="w-full mt-2 px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200 outline-none focus:border-action"
                            />
                        )}

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                            <button
                                type="button"
                                onClick={() => setShowImageInput(!showImageInput)}
                                className={`flex items-center gap-2 text-sm font-medium transition ${showImageInput ? 'text-action' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Image size={20} />
                                Photo
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !content.trim()}
                                className="px-6 py-2 bg-action text-white rounded-full font-bold text-sm hover:bg-action_dark transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send size={16} /> Post
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
