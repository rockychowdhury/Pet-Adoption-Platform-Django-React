import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAPI from './useAPI';

const useAdoption = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // Get My Adoption Profile
    const useGetAdoptionProfile = () => {
        return useQuery({
            queryKey: ['adoptionProfile'],
            queryFn: async () => {
                const response = await api.get('/user/adopter-profiles/me/');
                return response.data;
            },
        });
    };

    // Create/Update Adoption Profile
    const useUpdateAdoptionProfile = () => {
        return useMutation({
            mutationFn: async ({ id, data }) => {
                // If ID exists, PATCH. If not, POST.
                // However, since 1:1, usually we check if exists.
                // If we don't have ID, we can try POST, if 400, maybe we need to fetch first.
                // But let's assume the UI fetches profile first so we have ID if it exists.
                if (id) {
                    const response = await api.patch(`/user/adopter-profiles/${id}/`, data);
                    return response.data;
                } else {
                    const response = await api.post('/user/adopter-profiles/', data);
                    return response.data;
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['adoptionProfile']);
            },
        });
    };

    // Submit Application
    const useSubmitApplication = () => {
        return useMutation({
            mutationFn: async (applicationData) => {
                const response = await api.post('/rehoming/applications/', applicationData);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['applications']);
            },
        });
    };

    // Get Applications (As Adopter)
    const useGetHasApplied = (petId) => {
        return useQuery({
            queryKey: ['hasApplied', petId],
            queryFn: async () => {
                const response = await api.get(`/rehoming/applications/?pet=${petId}`);
                // If list is not empty, we have applied.
                return response.data.length > 0;
            },
            enabled: !!petId,
        });
    };

    const useGetMyApplications = () => {
        return useQuery({
            queryKey: ['myApplications'],
            queryFn: async () => {
                const response = await api.get(`/rehoming/applications/`);
                return response.data;
            },
        });
    };

    // Get Applications (As Owner - Received)
    // The backend endpoint /adoption/applications/ filters by owner OR adopter depending on user?
    // Review said: "AdoptionApplicationViewSet.get_queryset was using pet__owner... fixed to pet__pet_owner".
    // It seems the SAME endpoint returns applications WHERE user is adopter OR user is owner of pet.
    // So useGetMyApplications might return both. Ideally we filter in UI or have separate params.
    // For now, let's stick to simple get.

    return {
        useGetAdoptionProfile,
        useUpdateAdoptionProfile,
        useSubmitApplication,
        useGetHasApplied,
        useGetMyApplications
    };
};

export default useAdoption;
