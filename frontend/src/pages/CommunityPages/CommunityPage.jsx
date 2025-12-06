import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAPI from '../../hooks/useAPI';
import PostCard from '../../components/Community/PostCard';
import CreatePost from '../../components/Community/CreatePost';
import { Heart, Users, Star, MessageSquare, Bookmark, MapPin, User, ShieldCheck, AlertCircle, Flag, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen bg-bg-primary pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-inter">
            <div className="max-w-[1100px] mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-text-primary font-logo mb-3">Community Forum</h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">Connect with other pet lovers, share your stories, and get advice from adopters and shelters.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Feed */}
                    <div className="lg:col-span-2">
                        <CreatePost onPostCreated={handlePostCreated} />

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary mx-auto mb-4"></div>
                                <p className="text-text-secondary font-bold text-sm">Loading community...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} onUpdate={handlePostCreated} />
                                ))}
                                {posts.length === 0 && (
                                    <div className="bg-bg-surface rounded-[24px] p-10 text-center shadow-soft border border-white/20">
                                        <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                            💬
                                        </div>
                                        <h3 className="text-xl font-bold text-text-primary mb-2">No posts yet</h3>
                                        <p className="text-text-secondary text-sm">Be the first to share an adoption story, ask for tips, or celebrate a furry friend.</p>
                                        <button className="mt-6 px-6 py-2.5 bg-text-primary text-bg-primary rounded-full font-bold hover:opacity-90 transition text-sm">
                                            Start a conversation
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Community Highlights */}
                        <div className="bg-bg-surface rounded-[24px] p-6 shadow-soft border border-white/20">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-bold text-text-primary">Community Highlights</h3>
                                <span className="px-2.5 py-1 bg-bg-primary rounded-full text-[10px] font-bold text-text-secondary uppercase tracking-wider">Today</span>
                            </div>
                            <p className="text-xs text-text-secondary mb-5">See what's happening across FurEver Home at a glance.</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                        <Heart size={14} fill="currentColor" />
                                    </div>
                                    <span className="text-xs font-bold text-text-primary">6 pets were adopted in the last 24 hours</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                        <Users size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-text-primary">23 new members joined the community</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                        <Star size={14} fill="currentColor" />
                                    </div>
                                    <span className="text-xs font-bold text-text-primary">4 new success stories shared today</span>
                                </div>
                            </div>
                        </div>

                        {/* Popular Topics */}
                        <div className="bg-bg-surface rounded-[24px] p-6 shadow-soft border border-white/20">
                            <h3 className="text-base font-bold text-text-primary mb-4">Popular Topics</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['#firstnightathome', '#seniorpets', '#trainingtips', '#introducingtonewpets', '#health&care', '#happyendings'].map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-bg-primary rounded-xl text-[10px] font-bold text-text-secondary hover:text-brand-secondary cursor-pointer transition">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <button className="text-[10px] font-bold text-text-secondary hover:text-brand-secondary flex items-center gap-1">
                                Browse all topics <ArrowRight size={10} />
                            </button>
                        </div>

                        {/* Your Activity */}
                        <div className="bg-bg-surface rounded-[24px] p-6 shadow-soft border border-white/20">
                            <h3 className="text-base font-bold text-text-primary mb-4">Your Activity</h3>
                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2 text-text-secondary font-medium">
                                        <MessageSquare size={14} /> Discussions you're following
                                    </div>
                                    <span className="font-bold text-text-primary">3</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2 text-text-secondary font-medium">
                                        <Bookmark size={14} /> Saved threads
                                    </div>
                                    <span className="font-bold text-text-primary">7</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2 text-text-secondary font-medium">
                                        <MapPin size={14} /> Your adoption journey
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md">In progress</span>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-bg-primary rounded-xl text-xs font-bold text-text-primary hover:bg-bg-secondary transition flex items-center justify-center gap-2">
                                <User size={14} /> View profile
                            </button>
                        </div>

                        {/* Safety & Guidelines */}
                        <div className="bg-bg-surface rounded-[24px] p-6 shadow-soft border border-white/20">
                            <h3 className="text-base font-bold text-text-primary mb-4">Safety & Guidelines</h3>
                            <ul className="space-y-2.5 mb-4">
                                <li className="flex gap-2.5 text-xs text-text-secondary">
                                    <ShieldCheck size={14} className="text-brand-secondary flex-shrink-0 mt-0.5" />
                                    <span>Be kind, respectful, and supportive</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-text-secondary">
                                    <AlertCircle size={14} className="text-brand-secondary flex-shrink-0 mt-0.5" />
                                    <span>Never share sensitive personal details</span>
                                </li>
                                <li className="flex gap-2.5 text-xs text-text-secondary">
                                    <Flag size={14} className="text-brand-secondary flex-shrink-0 mt-0.5" />
                                    <span>Report suspicious activity to our team</span>
                                </li>
                            </ul>
                            <button className="text-[10px] font-bold text-text-secondary hover:text-brand-secondary flex items-center gap-1">
                                Read full community guidelines <ArrowRight size={10} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
