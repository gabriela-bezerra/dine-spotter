import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from './Toast';
import logo from '../assets/logo.png'; // Update this path as necessary
import './Navbar.css'; // Make sure this import is present

function Navbar({ loggedIn, setLoggedIn, user, setUser }) {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => setMenuVisible(!menuVisible);

    const handleLogout = (e) => {
        e.preventDefault();
        fetch('/api/logout', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(result => result.json())
            .then(data => {
                if (data.status === '200') {
                    setUser("");
                    setLoggedIn(false);
                    showToast(data.message, 'success');
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }
            });
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">
                    <img src={logo} className="logo" alt="logo" />
                </Link>
            </div>
            <div className="navbar-center">
                <span className="navbar-title">Dine Spotter</span>
            </div>
            <div className="navbar-right">
                <button className='toggle-button' onClick={toggleMenu}>
                    <span className='bar'></span>
                    <span className='bar'></span>
                    <span className='bar'></span>
                </button>
                <div className={`nav-items ${menuVisible ? 'active' : ''}`}>
                    <Link to="/" className="nav-link">Home</Link>
                    {loggedIn ? (
                        <>
                            <Link to="/add-restaurant" className="nav-link">Add Restaurant</Link>
                            <Link to="/user-profile" className="nav-link">Profile</Link>
                            <button className='logout' type='button' onClick={handleLogout}>Log Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/sign-up" className="nav-link">Sign up</Link>
                            <Link to="/login" className="nav-link">Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;