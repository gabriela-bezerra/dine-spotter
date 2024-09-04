import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from './Toast';
import './SignUpForm.css';

function SignUpForm({ setLoggedIn, user, setUser }) {
    const [statusMessage, setStatusMessage] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [id]: value
        }));
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        fetch('/api/create-account', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === '200') {
                    setLoggedIn(true);
                    setStatusMessage("");
                    showToast(result.message, 'success');
                    setTimeout(() => {
                        navigate('/user-profile');
                    }, 2000);
                } else {
                    setStatusMessage(result.message);
                    showToast(result.message, 'error');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                showToast('An error occurred. Please try again.', 'error');
            });
    };

    return (
        <div className="signup-page">
            <div className="hero">
                <h1>Create An Account</h1>
                <p>Join our community and start discovering amazing restaurants</p>
            </div>
            <div className="signup-form-container">
                <form className="signup-form" onSubmit={handleCreateSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" onChange={handleInputChange} value={user.firstName || ''} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" onChange={handleInputChange} value={user.lastName || ''} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" onChange={handleInputChange} value={user.email || ''} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' onChange={handleInputChange} value={user.password || ''} required />
                    </div>
                    {statusMessage && <div className='error-message'>{statusMessage}</div>}
                    <button className="btn btn-primary btn-large" type="submit">Create Account</button>
                </form>
            </div>
        </div>
    );
}

export default SignUpForm;