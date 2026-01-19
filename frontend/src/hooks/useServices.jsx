import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAPI from './useAPI';

const useServices = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // --- Metadata Queries ---
    const useGetCategories = () => useQuery({
        queryKey: ['serviceCategories'],
        queryFn: async () => (await api.get('/services/categories/')).data
    });

    const useGetSpecies = () => useQuery({
        queryKey: ['species'],
        queryFn: async () => (await api.get('/services/species/')).data
    });

    const useGetServiceOptions = () => useQuery({
        queryKey: ['serviceOptions'],
        queryFn: async () => (await api.get('/services/options/')).data
    });

    // --- Provider Queries ---
    const useGetProviders = (filters) => {
        return useQuery({
            queryKey: ['serviceProviders', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.providerType) params.append('category', filters.providerType); // Slug
                if (filters.location) params.append('location_city', filters.location);
                if (filters.search) params.append('search', filters.search);
                if (filters.radius) params.append('radius', filters.radius); // Backend needs to handle this if implemented, else client side filter

                // Array params
                if (filters.species && filters.species.length > 0) params.append('species', filters.species.join(','));

                if (filters.minPrice) params.append('min_price', filters.minPrice);
                if (filters.maxPrice) params.append('max_price', filters.maxPrice);
                if (filters.availability === 'Available') params.append('availability', 'available');
                if (filters.services && filters.services.length > 0) params.append('services', filters.services.join(','));

                if (filters.sort) params.append('ordering', filters.sort); // Use ordering for sort

                const response = await api.get(`/services/providers/?${params.toString()}`);
                return response.data;
            }
        });
    };

    const useGetProvider = (id) => {
        return useQuery({
            queryKey: ['serviceProvider', id],
            queryFn: async () => {
                const response = await api.get(`/services/providers/${id}/`);
                return response.data;
            },
            enabled: !!id
        });
    };

    const useCreateProviderProfile = () => {
        return useMutation({
            mutationFn: async (data) => await api.post('/services/providers/', data),
            onSuccess: () => {
                queryClient.invalidateQueries(['serviceProviders']);
                queryClient.invalidateQueries(['userProfile']); // To update role status in UI if needed
            }
        });
    };

    const useUpdateProviderProfile = () => {
        return useMutation({
            mutationFn: async ({ id, data }) => await api.patch(`/services/providers/${id}/`, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(['serviceProvider', variables.id]);
            }
        });
    };

    // --- Booking Queries ---
    const useCreateBooking = () => {
        return useMutation({
            mutationFn: async (data) => await api.post('/services/bookings/', data),
            onSuccess: () => {
                queryClient.invalidateQueries(['myBookings']);
            }
        });
    };

    const useGetMyBookings = () => useQuery({
        queryKey: ['myBookings'],
        queryFn: async () => (await api.get('/services/bookings/')).data
    });

    const useBookingAction = () => {
        return useMutation({
            mutationFn: async ({ id, action, data }) => await api.post(`/services/bookings/${id}/${action}/`, data),
            onSuccess: () => {
                queryClient.invalidateQueries(['myBookings']);
            }
        });
    };

    // --- Role Requests ---
    const useCreateRoleRequest = () => {
        return useMutation({
            mutationFn: async (data) => await api.post('/user/role-requests/', data),
            onSuccess: () => {
                queryClient.invalidateQueries(['myRoleRequests']);
            }
        });
    };

    const useGetMyRoleRequests = () => useQuery({
        queryKey: ['myRoleRequests'],
        queryFn: async () => (await api.get('/user/role-requests/')).data
    });

    return {
        useGetCategories,
        useGetSpecies,
        useGetServiceOptions,
        useGetProviders,
        useGetProvider,
        useCreateProviderProfile,
        useUpdateProviderProfile,
        useCreateBooking,
        useGetMyBookings,
        useBookingAction,
        useCreateRoleRequest,
        useGetMyRoleRequests
    };
};

export default useServices;
