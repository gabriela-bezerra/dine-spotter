import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { showToast } from './Toast';
import ImgurUpload from './ImgurUpload';
import './AddNewRestaurant.css';

function AddNewRestaurant({ categories }) {
    const navigate = useNavigate();
    const [newRestaurant, setNewRestaurant] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        category: categories[0] || "",
        photo_url: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRestaurant(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/create-restaurant', {
                method: 'POST',
                body: JSON.stringify(newRestaurant),
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            if (response.ok) {
                showToast(result.message, 'success');
                setTimeout(() => navigate('/'), 2500);
            } else {
                throw new Error(result.message || 'Failed to create restaurant');
            }
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='add-restaurant-background'>
            <form className="add-restaurant-form" onSubmit={handleSubmit}>
                <h1>Add A New Restaurant</h1>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={newRestaurant.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={newRestaurant.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={newRestaurant.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input type="text" id="state" name="state" value={newRestaurant.state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="zipcode">Zipcode</label>
                    <input type="text" id="zipcode" name="zipcode" value={newRestaurant.zipcode} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" value={newRestaurant.category} onChange={handleChange} required>
                        {categories.map((category) => (
                            <option value={category} key={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Upload a photo</label>
                    <ImgurUpload
                        onUploadSuccess={(url) => setNewRestaurant(prev => ({ ...prev, photo_url: url }))}
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default AddNewRestaurant;