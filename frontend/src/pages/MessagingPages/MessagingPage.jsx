import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import { Send, Image, Plus, MoreVertical, Phone, Video, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const MessagingPage = () => {
    const { id: activeId } = useParams();
    const navigate = useNavigate();
    const api = useAPI();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [msgContent, setMsgContent] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch Conversations
    const { data: conversations = [], isLoading: loadingConvos } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const res = await api.get('/messaging/conversations/');
            return res.data;
        },
        refetchInterval: 10000, // Poll every 10s
    });

    // Active Conversation
    const activeConversation = conversations.find(c => c.id === parseInt(activeId));

    // Fetch Messages for Active Conversation
    const { data: messages = [], isLoading: loadingMessages } = useQuery({
        queryKey: ['messages', activeId],
        queryFn: async () => {
            if (!activeId) return [];
            const res = await api.get(`/messaging/conversations/${activeId}/messages/`);
            return res.data;
        },
        enabled: !!activeId,
        refetchInterval: 5000, // Poll active chat every 5s
    });

    // Send Message Mutation
    const sendMessageMutation = useMutation({
        mutationFn: async (content) => {
            return await api.post(`/messaging/conversations/${activeId}/send_message/`, { content });
        },
        onSuccess: () => {
            setMsgContent('');
            queryClient.invalidateQueries(['messages', activeId]);
            queryClient.invalidateQueries(['conversations']);
        }
    });

    const handleSend = (e) => {
        e.preventDefault();
        if (!msgContent.trim()) return;
        sendMessageMutation.mutate(msgContent);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Helpers
    const getConversationName = (c) => {
        if (c.is_group) return c.name;
        // Find other participant
        const other = c.participants.find(p => p.id !== user?.id);
        return other ? `${other.first_name} ${other.last_name}` : 'Unknown';
    };

    const getConversationImage = (c) => {
        if (c.is_group) return c.group_image;
        const other = c.participants.find(p => p.id !== user?.id);
        return other?.photoURL;
    };

    return (
        <div className="h-screen bg-bg-primary pt-20 pb-4 px-4 font-inter flex gap-4">
            {/* Sidebar List */}
            <div className={`w-full md:w-80 lg:w-96 bg-bg-surface rounded-3xl border border-white/20 shadow-soft flex flex-col overflow-hidden ${activeId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-5 border-b border-border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-text-primary">Messages</h2>
                        <button className="w-8 h-8 rounded-full bg-brand-secondary/10 text-brand-secondary flex items-center justify-center hover:bg-brand-secondary hover:text-text-inverted transition">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input type="text" placeholder="Search chats..." className="w-full bg-bg-primary pl-9 pr-4 py-2 rounded-xl text-sm border-none focus:ring-0" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {loadingConvos ? <div className="text-center p-4">Loading...</div> : conversations.map(c => (
                        <div
                            key={c.id}
                            onClick={() => navigate(`/messages/${c.id}`)}
                            className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition ${parseInt(activeId) === c.id ? 'bg-brand-primary/10' : 'hover:bg-bg-primary'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {getConversationImage(c) ? (
                                    <img src={getConversationImage(c)} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                        {getConversationName(c)[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="font-bold text-text-primary text-sm truncate">{getConversationName(c)}</h4>
                                    <span className="text-[10px] text-text-secondary">{new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-xs text-text-secondary truncate">
                                    {c.last_message ? c.last_message.content : 'No messages yet'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 bg-bg-surface rounded-3xl border border-border shadow-soft flex flex-col overflow-hidden ${!activeId ? 'hidden md:flex' : 'flex'}`}>
                {activeId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-border flex justify-between items-center bg-bg-surface/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <button className="md:hidden" onClick={() => navigate('/messages')}>
                                    ←
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    {activeConversation && (
                                        getConversationImage(activeConversation) ?
                                            <img src={getConversationImage(activeConversation)} className="w-full h-full object-cover" /> :
                                            <div className="w-full h-full flex items-center justify-center font-bold">A</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">{activeConversation ? getConversationName(activeConversation) : 'Loading...'}</h3>
                                    <p className="text-xs text-brand-secondary font-medium">Active now</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-brand-primary">
                                <button className="p-2 hover:bg-bg-primary rounded-full transition"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-bg-primary rounded-full transition"><Video size={20} /></button>
                                <button className="p-2 hover:bg-bg-primary rounded-full transition"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-secondary">
                            {messages.map(m => {
                                const isMe = m.sender.id === user?.id;
                                return (
                                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-brand-secondary text-text-inverted rounded-br-none' : 'bg-bg-surface text-text-primary rounded-bl-none shadow-sm'}`}>
                                            {!isMe && <p className="text-[10px] font-bold opacity-60 mb-1">{m.sender.first_name}</p>}
                                            <p className="text-sm">{m.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-text-inverted/70' : 'text-text-tertiary'}`}>
                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-bg-surface border-t border-border">
                            <form onSubmit={handleSend} className="flex gap-2 items-center bg-bg-primary p-1.5 pr-2 rounded-full">
                                <button type="button" className="p-2 rounded-full text-text-secondary hover:bg-bg-secondary hover:text-brand-primary transition">
                                    <Image size={20} />
                                </button>
                                <input
                                    value={msgContent}
                                    onChange={e => setMsgContent(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-text-secondary/50"
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    disabled={!msgContent.trim()}
                                    className="p-2 rounded-full bg-brand-secondary text-text-inverted hover:opacity-90 transition disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                        <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center mb-4 text-3xl">This is a placeholder image</div>
                        <h3 className="font-bold text-lg mb-2">Your Messages</h3>
                        <p className="max-w-xs text-center text-sm">Select a conversation to start chatting with shelters or other pet lovers.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagingPage;
