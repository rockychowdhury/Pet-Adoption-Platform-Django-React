import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import useAPI from './useAPI';

const useRehoming = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // Submit Rehoming Intervention
    const useSubmitIntervention = () => {
        return useMutation({
            mutationFn: async (data) => {
                const response = await api.post('/rehoming/intervention/', data);
                return response.data;
            },
            onSuccess: (data) => {
                // Determine recommendation from data if possible, or just log
            },
        });
    };

    const useGetActiveIntervention = () => {
        return useQuery({
            queryKey: ['activeIntervention'],
            queryFn: async () => {
                try {
                    const response = await api.get('/rehoming/intervention/active_intervention/');
                    return response.data;
                } catch (error) {
                    if (error.response && error.response.status === 404) return null;
                    throw error;
                }
            },
            retry: false
        });
    };

    const useGetListings = (filters = {}) => {
        return useQuery({
            queryKey: ['rehomingListings', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key]) params.append(key, filters[key]);
                });
                const response = await api.get(`/rehoming/listings/?${params.toString()}`);
                return response.data;
            },
        });
    };

    return {
        useSubmitIntervention,
        useGetActiveIntervention,
        useGetListings
    };
};

export default useRehoming;
