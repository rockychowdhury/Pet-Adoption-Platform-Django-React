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

    return {
        useGetRoleRequests,
        useApproveRoleRequest,
        useRejectRoleRequest,
    };
};

export default useAdmin;
