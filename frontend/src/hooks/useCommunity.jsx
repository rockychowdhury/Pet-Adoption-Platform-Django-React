import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAPI from './useAPI';

const useCommunity = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // --- Groups ---
    const useGetGroups = (search) => {
        return useQuery({
            queryKey: ['groups', search],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                const response = await api.get(`/community/groups/?${params.toString()}`);
                return response.data;
            },
        });
    };

    const useGetGroup = (id) => {
        return useQuery({
            queryKey: ['group', id],
            queryFn: async () => {
                const response = await api.get(`/community/groups/${id}/`);
                return response.data;
            },
            enabled: !!id,
        });
    };

    const useCreateGroup = () => {
        return useMutation({
            mutationFn: async (data) => {
                const response = await api.post('/community/groups/', data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['groups']);
            },
        });
    };

    // --- Posts ---
    const useGetPosts = () => {
        return useQuery({
            queryKey: ['posts'],
            queryFn: async () => {
                const response = await api.get('/community/posts/');
                return response.data;
            },
        });
    };

    const useCreatePost = () => {
        return useMutation({
            mutationFn: async (data) => {
                // Determine which endpoint or params?
                // ViewSet handles it. data should contain group, content, etc.
                const response = await api.post('/community/posts/', data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['posts']);
            },
        });
    };

    const useAddComment = () => {
        return useMutation({
            mutationFn: async ({ postId, content }) => {
                const response = await api.post(`/community/posts/${postId}/comment/`, { content });
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['posts']);
            },
        });
    };

    // --- Events ---
    const useGetEvents = () => {
        return useQuery({
            queryKey: ['events'],
            queryFn: async () => {
                const response = await api.get('/community/events/');
                return response.data;
            },
        });
    };

    return {
        useGetGroups,
        useGetGroup,
        useCreateGroup,
        useGetPosts,
        useCreatePost,
        useAddComment,
        useGetEvents
    };
};

export default useCommunity;
