import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import Button from '../../common/Buttons/Button';
import useImgBB from '../../../hooks/useImgBB';
import { toast } from 'react-toastify';

const MediaGalleryEditor = ({ customMedia = [], onSave, isLoading }) => {
    const { uploadImage, uploading } = useImgBB();
    const [mediaList, setMediaList] = useState(customMedia || []);
    const [newFiles, setNewFiles] = useState([]);

    // Update local state if props change (and we haven't modified local yet? tough to sync)
    // Generally prefer internal state initialized from props
    // We'll rely on parent refresh to update `customMedia` after save.

    // Actually, simple solution: Local state for UI, separate list for "to remove" and "to add"?
    // Or just one list and we differentiate.
    // The model expects a list of objects or logic to create/delete.
    // The backend serializer for `media` is read-only usually on the main `update`.
    // We might need a separate endpoint for media management OR the `update` needs to handle it smarter.
    // Plan: The parent `ProviderProfileEditor` will handle the logic. 
    // Here we just prepare the list of URLs.

    // BUT: uploading to ImgBB happens here.

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const uploadedUrls = [];
            for (const file of files) {
                const result = await uploadImage(file);
                if (result && result.success) {
                    uploadedUrls.push({
                        file_url: result.url,
                        thumbnail_url: result.thumbnail,
                        is_new: true
                    });
                }
            }
            setMediaList(prev => [...prev, ...uploadedUrls]);
            toast.success("Images uploaded successfully!");
            // Auto-trigger save? Or wait for manual save. Manual is safer.
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image.");
        }
    };

    const handleRemove = (index) => {
        setMediaList(prev => prev.filter((_, i) => i !== index));
    };

    const handleMakePrimary = (index) => {
        setMediaList(prev => prev.map((item, i) => ({
            ...item,
            is_primary: i === index
        })));
    };

    const handleSave = () => {
        onSave(mediaList);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-text-primary">Media Gallery</h3>
                    <p className="text-sm text-text-secondary">Showcase your facility and services.</p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isLoading || uploading}
                >
                    {isLoading ? 'Saving...' : 'Save Gallery'}
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Upload Button */}
                <label className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-brand-primary hover:bg-blue-50 transition-colors h-48">
                    {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    ) : (
                        <>
                            <Upload className="text-brand-primary mb-2" size={24} />
                            <span className="text-sm font-medium text-text-secondary">Upload Photos</span>
                        </>
                    )}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                </label>

                {/* Image Grid */}
                {mediaList.map((item, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border border-border h-48 bg-gray-100">
                        <img
                            src={item.file_url}
                            alt="Service Media"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex justify-center">
                                {item.is_primary ? (
                                    <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-black">Primary Phone</span>
                                ) : (
                                    <button
                                        onClick={() => handleMakePrimary(index)}
                                        className="text-white text-xs hover:underline"
                                    >
                                        Set as Primary
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaGalleryEditor;
