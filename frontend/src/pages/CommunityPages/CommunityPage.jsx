import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAPI from '../../hooks/useAPI';
import PostCard from '../../components/Community/PostCard';
import CreatePost from '../../components/Community/CreatePost';

const CommunityPage = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['communityPosts'],
        queryFn: async () => {
            const res = await api.get('/community/posts/');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    const handlePostCreated = () => {
        queryClient.invalidateQueries(['communityPosts']);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Community Forum</h1>
                    <p className="text-gray-600">Connect with other pet lovers, share stories, and find advice.</p>
                </div>

                <CreatePost onPostCreated={handlePostCreated} />

                {isLoading ? (
                    <div className="text-center py-12">Loading posts...</div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} onUpdate={handlePostCreated} />
                        ))}
                        {posts.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No posts yet. Be the first to share something!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
