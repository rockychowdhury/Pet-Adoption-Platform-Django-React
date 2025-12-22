import { useState } from 'react';
import { toast } from 'react-toastify';

const useImgBB = () => {
    const [uploading, setUploading] = useState(false);

    // In a real app, this should be in .env (e.g., import.meta.env.VITE_IMGBB_API_KEY)
    // For now, I'll use a placeholder or check if user provided one. 
    // If you have a key, replace it here or add VITE_IMGBB_API_KEY in .env
    const API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY';

    const uploadImage = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                return {
                    url: data.data.url,
                    thumbnail: data.data.thumb.url,
                    delete_url: data.data.delete_url,
                    success: true
                };
            } else {
                throw new Error(data.error?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('ImgBB Upload Error:', error);
            toast.error(`Failed to upload image: ${error.message}`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading };
};

export default useImgBB;
