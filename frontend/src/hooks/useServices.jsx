import { useQuery } from '@tanstack/react-query';
import useAPI from './useAPI';

const useServices = () => {
    const api = useAPI();

    // Fetch Providers with Filters
    const useGetProviders = (filters) => {
        return useQuery({
            queryKey: ['serviceProviders', filters],
            queryFn: async () => {
                // Construct query string
                const params = new URLSearchParams();
                if (filters.providerType) params.append('provider_type', filters.providerType);
                if (filters.location) params.append('location_city', filters.location); // Rough city match
                if (filters.species && filters.species.length > 0) params.append('species', filters.species.join(',')); // Or iterate
                if (filters.minPrice) params.append('min_price', filters.minPrice);
                if (filters.maxPrice) params.append('max_price', filters.maxPrice);
                if (filters.availability === 'Available') params.append('availability', 'available');
                if (filters.services && filters.services.length > 0) params.append('services', filters.services.join(','));

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

    return {
        useGetProviders,
        useGetProvider
    };
};

export default useServices;
