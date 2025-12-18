import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

/**
 * Uploads an image file to ImgBB and returns the direct image URL.
 * @param {File} imageFile - The file object to upload.
 * @returns {Promise<string>} - The direct URL of the uploaded image.
 */
export const uploadToImgBB = async (imageFile) => {
    if (!IMGBB_API_KEY) {
        throw new Error("ImgBB API Key is missing. Check your .env file.");
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.success) {
            return response.data.data.url;
        } else {
            throw new Error("ImgBB upload failed: " + (response.data?.error?.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error uploading to ImgBB:", error);
        throw error;
    }
};
