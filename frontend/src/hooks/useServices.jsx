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

    const useGetSpecializations = () => useQuery({
        queryKey: ['specializations'],
        queryFn: async () => (await api.get('/services/specializations/')).data
    });

    // --- Provider Queries ---
    const useGetProviders = (filters) => {
        return useQuery({
            queryKey: ['serviceProviders', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.providerType) params.append('category', filters.providerType); // This should be handled by ServiceSearchPage mapping to 'category'
                if (filters.category) params.append('category', filters.category);

                if (filters.location) params.append('location_city', filters.location);
                if (filters.search) params.append('search', filters.search);
                if (filters.radius) params.append('radius', filters.radius);

                // Handling for filters passed from ServiceFilterSidebar (min_price, max_price, species, services)
                if (filters.species) params.append('species', filters.species);
                if (filters.min_price) params.append('min_price', filters.min_price);
                if (filters.max_price) params.append('max_price', filters.max_price);
                if (filters.availability) params.append('availability', filters.availability);
                if (filters.services) params.append('services', filters.services);

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

    const useGetMyProviderProfile = () => {
        return useQuery({
            queryKey: ['myServiceProvider'],
            queryFn: async () => {
                const response = await api.get('/services/providers/me/');
                return response.data;
            },
            retry: false // Don't retry if 404
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
                queryClient.invalidateQueries(['myServiceProvider']);
            }
        });
    };

    const useUpdateProviderHours = () => {
        return useMutation({
            mutationFn: async ({ id, data }) => await api.post(`/services/providers/${id}/update_hours/`, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(['serviceProvider', variables.id]);
                queryClient.invalidateQueries(['myServiceProvider']);
            }
        });
    };

    const useUpdateProviderMedia = () => {
        return useMutation({
            mutationFn: async ({ id, data }) => await api.post(`/services/providers/${id}/update_media/`, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(['serviceProvider', variables.id]);
                queryClient.invalidateQueries(['myServiceProvider']);
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
        useGetSpecializations,
        useGetProviders,
        useGetProvider,
        useGetMyProviderProfile,
        useCreateProviderProfile,
        useUpdateProviderProfile,
        useUpdateProviderHours,
        useUpdateProviderMedia,
        useCreateBooking,
        useGetMyBookings,
        useBookingAction,
        useCreateRoleRequest,
        useGetMyRoleRequests
    };
};

export default useServices;
