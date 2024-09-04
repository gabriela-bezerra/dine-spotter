import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SearchBar.css';

function SearchBar({ categories }) {
    const [selected, setSelected] = useState(categories[0] || '');
    const [zipcode, setZipcode] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const showToast = useCallback((message, type = 'info') => {
        toast[type](message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, []);

    const fetchRestaurants = async (url, body = null) => {
        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method: body ? 'POST' : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setRestaurants(data);
            showToast(`Found ${data.length} restaurants`, 'success');
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            showToast('Failed to fetch restaurants. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitCategory = (e) => {
        e.preventDefault();
        fetchRestaurants('/api/categories/results', selected);
    };

    const handleSubmitZipcode = (e) => {
        e.preventDefault();
        if (!zipcode.trim()) {
            showToast('Please enter a valid zipcode', 'warning');
            return;
        }
        fetchRestaurants('/api/restaurants/zipcode', zipcode);
    };

    const handleSubmitAll = (e) => {
        e.preventDefault();
        fetchRestaurants('/api/restaurants');
    };

    return (
        <section className="search-page">
            <ToastContainer />
            <div className="search-inputs">
                <div className="one">
                    <h1>Find your next favorite restaurant</h1>
                </div>
                <form className='search-form'>
                    <label className='categories-dropdown'>Search by category</label>
                    <div className='input-wrapper'>
                        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
                            <option value="" disabled>Categories</option>
                            {categories.map((category) => (
                                <option value={category} key={category}>{category}</option>
                            ))}
                        </select>
                        <button type='button' className='myButton' onClick={handleSubmitCategory} disabled={isLoading}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                    <label className='categories-city'>Search by zipcode</label>
                    <div className='input-wrapper'>
                        <input
                            type="text"
                            className='categories-city'
                            placeholder='98055'
                            value={zipcode}
                            onChange={(e) => setZipcode(e.target.value)}
                        />
                        <button type='button' className='myButton' onClick={handleSubmitZipcode} disabled={isLoading}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                    <div>
                        <button type='button' className='myButton all-rest-btn' onClick={handleSubmitAll} disabled={isLoading}>
                            All Restaurants
                        </button>
                    </div>
                </form>
            </div>
            {isLoading && <div className="loading">Loading...</div>}
            {restaurants.length > 0 && (
                <div className="dataResult">
                    {restaurants.map((restaurant) => (
                        <ul key={restaurant.restaurant_id}>
                            <li>
                                <img className="restaurant-photo" src={restaurant.photo_cover} alt={restaurant.name} />
                                <Link className='results-link' to={`/restaurant-details/${restaurant.restaurant_id}`}>{restaurant.name}</Link>
                            </li>
                        </ul>
                    ))}
                </div>
            )}
        </section>
    );
}

export default SearchBar;