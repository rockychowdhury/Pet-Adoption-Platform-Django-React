import React, { useState } from 'react';
import { X, Upload, Dog, Cat, Heart } from 'lucide-react';
import Modal from '../common/Modal';
import useAPI from '../../hooks/useAPI';
import { toast } from 'react-toastify';

const CreatePetModal = ({ isOpen, onClose, onSuccess, petToEdit = null }) => {
    const api = useAPI();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'male',
        size: 'Medium',
        color: '',
        description: '',
        photo_url: '',
        weight: '',
        is_vaccinated: false,
    });

    React.useEffect(() => {
        if (petToEdit) {
            setFormData({
                name: petToEdit.name || '',
                species: petToEdit.species || 'Dog',
                breed: petToEdit.breed || '',
                age: petToEdit.age || '',
                gender: petToEdit.gender || 'male',
                size: petToEdit.size || 'Medium',
                color: petToEdit.color || '',
                description: petToEdit.description || '',
                photo_url: petToEdit.photo_url || '',
                weight: petToEdit.weight || '',
                is_vaccinated: petToEdit.is_vaccinated || false,
            });
        } else {
            setFormData({
                name: '',
                species: 'Dog',
                breed: '',
                age: '',
                gender: 'male',
                size: 'Medium',
                color: '',
                description: '',
                photo_url: '',
                weight: '',
                is_vaccinated: false,
            });
        }
    }, [petToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (petToEdit) {
                response = await api.patch(`/pets/${petToEdit.id}/`, formData);
            } else {
                response = await api.post('/pets/', formData);
            }

            if (response.status === 201 || response.status === 200) {
                toast.success(petToEdit ? 'Pet updated successfully!' : 'Pet listed successfully!');
                if (onSuccess) onSuccess();
                onClose();
                setFormData({
                    name: '',
                    species: 'Dog',
                    breed: '',
                    age: '',
                    gender: 'male',
                    size: 'Medium',
                    color: '',
                    description: '',
                    photo_url: '',
                    weight: '',
                    is_vaccinated: false,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error(petToEdit ? 'Failed to update pet.' : 'Failed to list pet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={petToEdit ? "Edit Pet" : "List a New Pet"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Pet Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder="e.g. Max"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Species</label>
                        <select
                            name="species"
                            value={formData.species}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                        >
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Breed</label>
                        <input
                            type="text"
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder="e.g. Golden Retriever"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Age (Months)</label>
                        <input
                            type="number"
                            name="age"
                            required
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder="e.g. 12"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            step="0.1"
                            required
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder="e.g. 5.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Color</label>
                        <input
                            type="text"
                            name="color"
                            required
                            value={formData.color}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder="e.g. Brown"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Photo URL</label>
                    <input
                        type="url"
                        name="photo_url"
                        required
                        value={formData.photo_url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                        placeholder="Tell us about the pet..."
                    ></textarea>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_vaccinated"
                        id="is_vaccinated"
                        checked={formData.is_vaccinated}
                        onChange={handleChange}
                        className="w-4 h-4 text-action border-border rounded focus:ring-action"
                    />
                    <label htmlFor="is_vaccinated" className="text-sm text-text-primary">Vaccinated</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-action text-white rounded-xl font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (petToEdit ? 'Updating Pet...' : 'Listing Pet...') : (petToEdit ? 'Update Pet' : 'List Pet')}
                </button>
            </form>
        </Modal>
    );
};

export default CreatePetModal;
