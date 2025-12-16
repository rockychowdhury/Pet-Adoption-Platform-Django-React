import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAPI from './useAPI';

const useReviews = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // Submit Adoption Review
    const useSubmitAdoptionReview = () => {
        return useMutation({
            mutationFn: async (reviewData) => {
                const response = await api.post('/reviews/', reviewData);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['adoptionReviews']);
                // Maybe invalidate application to update status if needed
            },
        });
    };

    // Submit Service Review
    const useSubmitServiceReview = () => {
        return useMutation({
            mutationFn: async (reviewData) => {
                const response = await api.post('/services/reviews/', reviewData);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['serviceReviews']);
                queryClient.invalidateQueries(['serviceProvider']); // to update avg rating
            },
        });
    };

    return {
        useSubmitAdoptionReview,
        useSubmitServiceReview
    };
};

export default useReviews;
