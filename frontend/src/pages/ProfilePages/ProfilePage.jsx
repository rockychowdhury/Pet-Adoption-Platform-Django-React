import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useAPI from '../../hooks/useAPI';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const api = useAPI();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        bio: '',
        photoURL: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                bio: user.bio || '',
                photoURL: user.photoURL || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await api.patch('/user/update-profile/', formData);
            if (response.status === 200) {
                setUser(prev => ({ ...prev, ...response.data.data }));
                setIsEditing(false);
                setMessage('Profile updated successfully!');
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center py-20">Loading profile...</div>;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary h-48 relative">
                    <div className="absolute -bottom-16 left-10">
                        <img
                            src={formData.photoURL || "https://i.ibb.co.com/hWK4ZpT/petDP.jpg"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                        />
                    </div>
                </div>

                <div className="pt-20 px-10 pb-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-natural font-logo">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-gray-500 font-medium">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center px-4 py-2 rounded-xl transition ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-action text-white hover:bg-action_dark'}`}
                        >
                            {isEditing ? <><X size={18} className="mr-2" /> Cancel</> : <><Edit2 size={18} className="mr-2" /> Edit Profile</>}
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                                    <input
                                        type="text"
                                        name="photoURL"
                                        value={formData.photoURL}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-6 py-3 bg-action text-white rounded-xl font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl disabled:opacity-50"
                                >
                                    <Save size={20} className="mr-2" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Mail size={20} className="mr-3 text-action" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone size={20} className="mr-3 text-action" />
                                    <span>{user.phone_number || 'No phone number added'}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin size={20} className="mr-3 text-action" />
                                    <span>Location not set</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-natural mb-2">About Me</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {user.bio || 'No bio added yet. Click edit to tell us about yourself!'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;