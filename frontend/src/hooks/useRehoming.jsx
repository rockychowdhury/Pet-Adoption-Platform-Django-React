import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import useAPI from './useAPI';

const useRehoming = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // --- Rehoming Requests (Owner Flow) ---
    const useCreateRehomingRequest = () => {
        return useMutation({
            mutationFn: async (data) => {
                const response = await api.post('/rehoming/requests/', data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['myRehomingRequests']);
            }
        });
    };

    const useGetRehomingRequests = () => {
        return useQuery({
            queryKey: ['myRehomingRequests'],
            queryFn: async () => {
                const response = await api.get('/rehoming/requests/');
                return response.data;
            }
        });
    };

    const useUpdateRehomingRequest = () => {
        return useMutation({
            mutationFn: async ({ id, data }) => {
                const response = await api.patch(`/rehoming/requests/${id}/`, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['myRehomingRequests']);
            }
        });
    };

    const useCancelRehomingRequest = () => {
        return useMutation({
            mutationFn: async (id) => {
                const response = await api.post(`/rehoming/requests/${id}/cancel/`);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['myRehomingRequests']);
            }
        });
    };

    const useConfirmRehomingRequest = () => {
        return useMutation({
            mutationFn: async (id) => {
                const response = await api.post(`/rehoming/requests/${id}/confirm/`);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['myRehomingRequests']);
            }
        });
    };

    const useGetListings = (filters = {}) => {
        return useQuery({
            queryKey: ['rehomingListings', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                let endpoint = '/rehoming/listings/';

                // If owner is 'me', use the dedicated endpoint and remove the param
                if (filters.owner === 'me') {
                    endpoint = '/rehoming/my-listings/';
                    // Don't append owner=me to params
                }

                Object.keys(filters).forEach(key => {
                    if (key === 'owner' && filters[key] === 'me') return; // Skip owner param
                    if (filters[key]) params.append(key, filters[key]);
                });

                const queryString = params.toString();
                const url = queryString ? `${endpoint}?${queryString}` : endpoint;

                const response = await api.get(url);
                return response.data;
            },
        });
    };

    const useCreateListing = () => {
        return useMutation({
            mutationFn: async (data) => {
                const response = await api.post('/rehoming/listings/', data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['rehomingListings']);
                queryClient.invalidateQueries(['myListings']);
            }
        });
    };

    const useUpdateListing = () => {
        return useMutation({
            mutationFn: async ({ id, data }) => {
                const response = await api.patch(`/rehoming/listings/${id}/`, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['rehomingListings']);
                queryClient.invalidateQueries(['myListings']);
            }
        });
    };

    const useGetListingDetail = (id) => {
        return useQuery({
            queryKey: ['rehomingListing', id],
            queryFn: async () => {
                const response = await api.get(`/rehoming/listings/${id}/`);
                return response.data;
            },
            enabled: !!id
        });
    };

    const useDeleteListing = () => {
        return useMutation({
            mutationFn: async (id) => {
                await api.delete(`/rehoming/listings/${id}/`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['rehomingListings']);
                queryClient.invalidateQueries(['myListings']);
            }
        });
    };

    return {
        useCreateRehomingRequest,
        useGetRehomingRequests,
        useUpdateRehomingRequest,
        useCancelRehomingRequest,
        useConfirmRehomingRequest,
        useGetListings,
        useGetListingDetail,
        useCreateListing,
        useUpdateListing,
        useDeleteListing
    };
};

export default useRehoming;
