import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAPI from './useAPI';

const usePets = () => {
    const api = useAPI();
    const queryClient = useQueryClient();

    // Fetch Pets with Filters
    const useGetPets = (filters) => {
        return useQuery({
            queryKey: ['pets', filters],
            queryFn: async () => {
                const params = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key]) params.append(key, filters[key]);
                });
                const response = await api.get(`/pets/profiles/?${params.toString()}`);
                return response.data;
            },
        });
    };

    // Fetch Single Pet
    const useGetPet = (id) => {
        return useQuery({
            queryKey: ['pet', id],
            queryFn: async () => {
                const response = await api.get(`/pets/profiles/${id}/`);
                return response.data;
            },
            enabled: !!id,
        });
    };

    // Create Pet
    const useCreatePet = () => {
        return useMutation({
            mutationFn: async (petData) => {
                const response = await api.post('/pets/profiles/', petData); // Ensure correct endpoint
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['myPets']);
            },
        });
    };

    // Update Pet (e.g. for status toggle) - with Optimistic Update
    const useUpdatePet = () => {
        return useMutation({
            mutationFn: async ({ id, data }) => {
                const response = await api.patch(`/pets/profiles/${id}/`, data);
                return response.data;
            },
            onMutate: async ({ id, data }) => {
                await queryClient.cancelQueries({ queryKey: ['myPets'] });
                const previousPets = queryClient.getQueryData(['myPets']);

                queryClient.setQueryData(['myPets'], (old) => {
                    if (!old) return old;

                    const updatePetInList = (list) => list.map(pet =>
                        pet.id === id ? { ...pet, ...data } : pet
                    );

                    if (Array.isArray(old)) {
                        return updatePetInList(old);
                    } else if (old.results && Array.isArray(old.results)) {
                        return { ...old, results: updatePetInList(old.results) };
                    }
                    return old;
                });

                return { previousPets };
            },
            onError: (err, newPet, context) => {
                queryClient.setQueryData(['myPets'], context.previousPets);
                console.error("Optimistic update failed:", err);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['myPets'] });
            },
        });
    };

    // Delete Pet - with Optimistic Update
    const useDeletePet = () => {
        return useMutation({
            mutationFn: async (id) => {
                await api.delete(`/pets/profiles/${id}/`);
            },
            onMutate: async (id) => {
                await queryClient.cancelQueries({ queryKey: ['myPets'] });
                const previousPets = queryClient.getQueryData(['myPets']);

                queryClient.setQueryData(['myPets'], (old) => {
                    if (!old) return old;

                    const removePetFromList = (list) => list.filter(pet => pet.id !== id);

                    if (Array.isArray(old)) {
                        return removePetFromList(old);
                    } else if (old.results && Array.isArray(old.results)) {
                        return { ...old, results: removePetFromList(old.results) };
                    }
                    return old;
                });

                return { previousPets };
            },
            onError: (err, id, context) => {
                queryClient.setQueryData(['myPets'], context.previousPets);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['myPets'] });
            },
        });
    };

    // Fetch My Pets (User's Listings)
    const useGetUserPets = () => {
        return useQuery({
            queryKey: ['myPets'],
            queryFn: async () => {
                const response = await api.get('/pets/profiles/');
                return response.data;
            },
        });
    };

    return {
        useGetPets,
        useGetPet,
        useCreatePet,
        useUpdatePet,
        useDeletePet,
        useGetUserPets
    };
};

export default usePets;
