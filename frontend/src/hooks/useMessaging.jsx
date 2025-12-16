import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAPI from './useAPI';

const useMessaging = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // Fetch All Conversations
    const useGetConversations = () => {
        return useQuery({
            queryKey: ['conversations'],
            queryFn: async () => {
                const response = await api.get('/messaging/conversations/');
                return response.data;
            },
            refetchInterval: 10000, // Poll every 10s for MVP since no websockets
        });
    };

    // Fetch Messages for a Conversation
    const useGetMessages = (conversationId) => {
        return useQuery({
            queryKey: ['messages', conversationId],
            queryFn: async () => {
                const response = await api.get(`/messaging/conversations/${conversationId}/messages/`);
                return response.data;
            },
            enabled: !!conversationId,
            refetchInterval: 5000, // Poll faster for active chat
        });
    };

    // Send Message
    const useSendMessage = () => {
        return useMutation({
            mutationFn: async ({ conversationId, text, media_url }) => {
                const response = await api.post(`/messaging/conversations/${conversationId}/send_message/`, {
                    text,
                    media_url
                });
                return response.data;
            },
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries(['messages', variables.conversationId]);
                queryClient.invalidateQueries(['conversations']); // To update last message
            },
        });
    };

    // Start Conversation
    const useStartConversation = () => {
        return useMutation({
            mutationFn: async ({ recipient_id }) => {
                const response = await api.post('/messaging/conversations/start/', {
                    recipient_id
                });
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['conversations']);
            },
        });
    };

    return {
        useGetConversations,
        useGetMessages,
        useSendMessage,
        useStartConversation
    };
};

export default useMessaging;
