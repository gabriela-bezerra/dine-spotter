import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { showToast } from './Toast';

function ProfilePhoto({ userInfo, setUserInfo }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('https://api.imgur.com/3/image', formData, {
                headers: {
                    'Authorization': 'Client-ID YOUR_IMGUR_CLIENT_ID'  // Replace with your Imgur client ID
                }
            });

            if (response.data.success) {
                const imageUrl = response.data.data.link;
                await updateProfilePicture(imageUrl);
                showToast('Image uploaded successfully', 'success');
            } else {
                throw new Error('Imgur upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Failed to upload image. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const updateProfilePicture = async (url) => {
        try {
            const response = await fetch('/api/profile-photo', {
                method: 'POST',
                body: JSON.stringify({ profile_picture: url }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update profile picture');
            }

            const responseJson = await response.json();
            setUserInfo({ ...userInfo, profile_photo: responseJson.photo_url });
            showToast('Profile picture updated successfully', 'success');
        } catch (error) {
            console.error('Error updating profile picture:', error);
            showToast('Failed to update profile picture. Please try again.', 'error');
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                id="imgurImageUpload"
                style={{ display: 'none' }}
                disabled={isUploading}
            />
            <label htmlFor="imgurImageUpload" style={{
                color: 'white',
                backgroundColor: isUploading ? '#cccccc' : '#b84d00',
                borderRadius: '50%',
                padding: '8px 10px',
                cursor: isUploading ? 'not-allowed' : 'pointer'
            }}>
                {isUploading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                    <FontAwesomeIcon icon={faCamera} />
                )}
            </label>
            {isUploading && <span style={{ marginLeft: '10px' }}>Uploading...</span>}
        </div>
    );
}

export default ProfilePhoto;