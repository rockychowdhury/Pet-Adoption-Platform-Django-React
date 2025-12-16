import { useMutation, useQueryClient } from '@tanstack/react-query';
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
                // The backend determines the recommendation (keep vs rehome)
                // The UI should adapt based on this.
            },
        });
    };

    const useGetActiveIntervention = () => {
        const { useQuery } = require('@tanstack/react-query'); // Importing inside to avoid top-level issues if any
        return useQuery({
            queryKey: ['activeIntervention'],
            queryFn: async () => {
                try {
                    const response = await api.get('/rehoming/intervention/active_intervention/');
                    return response.data;
                } catch (error) {
                    // 404 means no active intervention
                    if (error.response && error.response.status === 404) return null;
                    throw error;
                }
            },
            retry: false
        });
    };

    return {
        useSubmitIntervention,
        useGetActiveIntervention
    };
};

export default useRehoming;
