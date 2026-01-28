import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAPI from './useAPI';

const useAdmin = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // Role Requests
    const useGetRoleRequests = (filters = {}) => {
        return useQuery({
            queryKey: ['admin', 'role-requests', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.status) params.append('status', filters.status);
                if (filters.requested_role) params.append('requested_role', filters.requested_role);

                const res = await api.get(`/user/role-requests/?${params.toString()}`);
                return res.data;
            },
        });
    };

    const useApproveRoleRequest = () => {
        return useMutation({
            mutationFn: async ({ id, admin_notes }) => {
                const res = await api.post(`/user/role-requests/${id}/approve/`, { admin_notes });
                return res.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['admin', 'role-requests']);
            },
        });
    };

    const useRejectRoleRequest = () => {
        return useMutation({
            mutationFn: async ({ id, admin_notes }) => {
                const res = await api.post(`/user/role-requests/${id}/reject/`, { admin_notes });
                return res.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['admin', 'role-requests']);
            },
        });
    };

    // Providers
    const useGetProviders = (filters = {}) => {
        return useQuery({
            queryKey: ['admin', 'providers', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (filters.search) params.append('search', filters.search);
                if (filters.status) params.append('verification_status', filters.status); // Not standard filter, might need backend tweak?
                // Actually the ServiceProviderViewSet filterset uses 'verification_status' implicitly if we add it to the FilterSet or if ModelViewSet standard filtering works.
                // Let's check FilterSet in views.py. It doesn't explicitly list `verification_status`.
                // But ModelViewSet with DjangoFilterBackend usually allows filtering by fields if `filterset_fields` is set.
                // In views.py, `filterset_class` is used. We should check if `verification_status` is there.
                // It is NOT in `ServiceProviderFilter.Meta.fields`.
                // So we need to add it to ServiceProviderFilter in views.py to allow filtering by status.

                const res = await api.get(`/services/providers/?${params.toString()}`);
                return res.data;
            },
        });
    };

    const useUpdateProviderStatus = () => {
        return useMutation({
            mutationFn: async ({ id, status }) => {
                const res = await api.post(`/services/providers/${id}/update_status/`, { status });
                return res.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['admin', 'providers']);
            },
        });
    };

    return {
        useGetRoleRequests,
        useApproveRoleRequest,
        useRejectRoleRequest,
        useGetProviders,
        useUpdateProviderStatus,
    };
};

export default useAdmin;
