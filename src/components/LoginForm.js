import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from './Toast';
import './LoginForm.css';

function LoginForm({ user, setUser, setLoggedIn }) {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(result => result.json())
            .then(data => {
                if (data.status === '200') {
                    setErrorMessage("");
                    setLoggedIn(true);
                    showToast(data.message, 'success');
                    setTimeout(() => {
                        navigate('/user-profile');
                    }, 2500);
                } else {
                    setErrorMessage(data.message);
                    showToast(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('An error occurred. Please try again.', 'error');
            });
    };

    return (
        <div className="login-page">
            <div className="hero">
                <h1>Welcome Back</h1>
                <p>Log in to discover amazing restaurants</p>
            </div>
            <div className="login-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            value={user.email}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            value={user.password}
                            required
                        />
                    </div>
                    {errorMessage && <div className='error-message'>{errorMessage}</div>}
                    <button className="btn btn-primary btn-large" type="submit">Log In</button>
                </form>
                <div className="alt-login">
                    <p>Don't have an account? <Link to="/sign-up">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;