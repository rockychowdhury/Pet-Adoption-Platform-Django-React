import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationList from '../../components/Messaging/ConversationList';
import ConversationView from '../../components/Messaging/ConversationView';
import NewMessageModal from '../../components/Messaging/NewMessageModal';
import { MessageSquare } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useMessaging from '../../hooks/useMessaging';

const MessagesPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { useGetConversations, useGetMessages, useSendMessage } = useMessaging();

    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    // Fetch lists
    const { data: conversationsData, isLoading: isListLoading } = useGetConversations();

    // Fetch messages for active conversation
    const activeId = id ? parseInt(id) : null;
    const { data: messagesData, isLoading: isMessagesLoading } = useGetMessages(activeId);

    const { mutate: sendMessage } = useSendMessage();

    // Transform conversations for List Component
    const formattedConversations = useMemo(() => {
        const conversationsList = Array.isArray(conversationsData) ? conversationsData : (conversationsData?.results || []);
        if (conversationsList.length === 0 || !user) return [];

        return conversationsList.map(c => {
            // Filter by ID instead of email because PublicUserSerializer doesn't expose email
            const otherParticipant = c.participants?.find(p => p.id !== user.id) || c.participants?.[0] || { first_name: 'Unknown' };
            const lastMsg = c.last_message;

            return {
                id: c.id,
                participant: {
                    name: `${otherParticipant.first_name} ${otherParticipant.last_name || ''}`.trim(),
                    // PublicUserSerializer uses 'photoURL', not 'photo_url'
                    image: otherParticipant.photoURL || null,
                    isOnline: false // Not implemented yet
                },
                lastMessage: {
                    text: lastMsg?.text || 'No messages yet',
                    time: lastMsg ? new Date(lastMsg.created_at).toLocaleDateString() : '',
                    sender: lastMsg?.sender?.email === user.email ? 'You' : 'Them'
                },
                unreadCount: c.unread_count || 0,
                about: '', // Not implemented
                isArchived: c.is_archived || false
            };
        });
    }, [conversationsData, user]);

    // Active Conversation Data for View Component
    const activeConversationProp = useMemo(() => {
        if (!activeId || !formattedConversations) return null;
        const convMeta = formattedConversations.find(c => c.id === activeId);
        if (!convMeta) return null;

        const messagesList = Array.isArray(messagesData) ? messagesData : (messagesData?.results || []);

        const formattedMessages = messagesList.map(msg => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender.email === user.email ? 'You' : 'Them', // Check email or ID
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: msg.is_read ? 'Seen' : 'Sent', // API field check
            type: msg.message_type || 'text'
        })) || [];

        return {
            ...convMeta,
            messages: formattedMessages
        };
    }, [activeId, formattedConversations, messagesData, user]);


    const handleSendMessage = (text) => {
        if (!activeId) return;
        sendMessage({ conversationId: activeId, text });
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-bg-primary overflow-hidden">
            {/* Sidebar (List) */}
            <div className={`${id ? 'hidden md:flex' : 'flex'} w-full md:w-auto h-full border-r border-border`}>
                <ConversationList
                    conversations={formattedConversations}
                    activeId={id}
                    onNewMessage={() => setIsNewModalOpen(true)}
                />
            </div>

            {/* Conversation View */}
            <div className={`${!id ? 'hidden md:flex' : 'flex'} flex-1 h-full`}>
                {activeConversationProp ? (
                    <ConversationView
                        conversation={activeConversationProp}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary bg-bg-primary">
                        <div className="w-32 h-32 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 text-brand-primary animate-pulse-slow">
                            <MessageSquare size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-2 font-merriweather">Your Messages</h2>
                        <p className="max-w-md text-center text-text-secondary">
                            Select a conversation from the left to start chatting, or start a new message to connect with pet owners and adopters.
                        </p>
                    </div>
                )}
            </div>

            <NewMessageModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
            />
        </div>
    );
};

export default MessagesPage;
