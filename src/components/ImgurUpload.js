import React, { useState } from 'react';
import axios from 'axios';
import { showToast } from './Toast';
import './ImgurUpload.css';

function ImgurUpload({ onUploadSuccess }) {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setFileName(file.name);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('https://api.imgur.com/3/image', formData, {
                headers: {
                    Authorization: 'Client-ID YOUR_IMGUR_CLIENT_ID', // Replace with your Imgur Client ID
                },
            });

            if (response.data.success) {
                onUploadSuccess(response.data.data.link);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Failed to upload image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="imgur-upload">
            <input
                type="file"
                onChange={handleUpload}
                accept="image/*"
                id="imgur-upload-input"
                style={{ display: 'none' }}
            />
            <label htmlFor="imgur-upload-input" className="upload-button">
                {isUploading ? 'Uploading...' : fileName || 'Choose a file'}
            </label>
        </div>
    );
}

export default ImgurUpload;