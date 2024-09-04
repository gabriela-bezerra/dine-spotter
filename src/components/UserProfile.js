import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from './ProfilePhoto';
import './UserProfile.css'; // We'll create this file for styling

function UserProfile({ user, userInfo, setUserInfo }) {
    const [favorites, setFavorites] = useState([]);
    const [initials, setInitials] = useState('');

    useEffect(() => {
        if (userInfo && !userInfo.profile_photo) {
            const firstInitial = userInfo.fname[0];
            const lastInitial = userInfo.lname[0];
            setInitials(`${firstInitial}${lastInitial}`);
        }
    }, [userInfo]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch('/api/user/details', {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [user, setUserInfo]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch('/api/user/favorites', {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                setFavorites(data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, [user]);

    if (!userInfo) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className='container-user-profile'>
            <div className='user-details'>
                <div className='user-info'>
                    <h1>Welcome {userInfo.fname}!</h1>
                    <div className='input-wrapper-user'>
                        <div className='profile-photo'>
                            {userInfo.profile_photo ? (
                                <img
                                    className='profile-img'
                                    src={userInfo.profile_photo}
                                    alt={`${userInfo.fname}'s profile`}
                                />
                            ) : (
                                <div className="initials-placeholder">{initials}</div>
                            )}
                            <ProfilePhoto userInfo={userInfo} setUserInfo={setUserInfo} />
                        </div>
                        <div className="personal-info">
                            <h3>Personal Info</h3>
                            <p className='user-name'>User name: {userInfo.fname} {userInfo.lname}</p>
                            <p className='user-email'>Email: {userInfo.email}</p>
                        </div>
                    </div>
                    <div className="fav-list">
                        <h3>Favorite Restaurants</h3>
                        <div className="favList">
                            {favorites.length > 0 ? (
                                <ul>
                                    {favorites.map((restaurant) => (
                                        <li key={restaurant.restaurant_id}>
                                            <img
                                                className="restaurant-photo"
                                                src={restaurant.photo_cover}
                                                alt={restaurant.name}
                                            />
                                            <Link
                                                className='results-link'
                                                to={`/restaurant-details/${restaurant.restaurant_id}`}
                                            >
                                                {restaurant.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No favorites added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;