import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import ReviewModal from './ReviewModal';
import { showToast } from './Toast';
import './RestaurantDetails.css';

function RestaurantDetails({ photos, setPhotos, reviews, setReviews, restaurant, setRestaurant }) {
    const { restaurant_id } = useParams();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRestaurantDetails = useCallback(async () => {
        try {
            const response = await fetch('/api/restaurant/details', {
                method: 'POST',
                body: JSON.stringify(restaurant_id),
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch restaurant details');
            const data = await response.json();
            setRestaurant(data);
        } catch (err) {
            setError('Failed to load restaurant details. Please try again later.');
            showToast('Error loading restaurant details', 'error');
        }
    }, [restaurant_id, setRestaurant]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch('/api/show-reviews', {
                method: 'POST',
                body: JSON.stringify(restaurant_id),
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            setError('Failed to load reviews. Please try again later.');
            showToast('Error loading reviews', 'error');
        } finally {
            setLoading(false);
        }
    }, [restaurant_id, setReviews]);

    useEffect(() => {
        fetchRestaurantDetails();
        fetchReviews();
    }, [fetchRestaurantDetails, fetchReviews]);

    const handleFavorites = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                body: JSON.stringify(restaurant_id),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            showToast(data.message, data.type);
        } catch (err) {
            showToast('Failed to add to favorites', 'error');
        }
    };

    const getStarIcons = (rating) => {
        const icons = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            icons.push(<FontAwesomeIcon key={i} icon={faStar} className="yellow-star" />);
        }
        if (rating % 1 !== 0) {
            icons.push(<FontAwesomeIcon key={rating} icon={faStarHalf} className="yellow-star" />);
        }
        return icons;
    };

    const openModal = (index) => {
        setModalIsOpen(true);
        setCurrentImageIndex(index);
    };

    const closeModal = () => setModalIsOpen(false);
    const previousImage = () => setCurrentImageIndex(prev => Math.max(0, prev - 1));
    const nextImage = () => setCurrentImageIndex(prev => Math.min(photos.length - 1, prev + 1));

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!restaurant || !reviews) return <div>No data available</div>;

    return (
        <div className='container-rest-dtls'>
            <div className='restaurant-details'>
                <h1 className='rest-dtls-title'>{restaurant.name}</h1>
                <img className='rest-dtls-cover' src={restaurant.photo_cover} alt={restaurant.name} width="300" height="300" />
                <p className='rest-dtls-address'>{restaurant.address} {restaurant.city} {restaurant.zipcode}</p>
                <p className='rest-dtls-ratings'>Overall rating: {getStarIcons(restaurant.rating)}</p>
                <button className='fav-btn' type='button' onClick={handleFavorites}>Add to Your Favorites</button>

                <div className='rest-dtls-reviews'>
                    <h3 className='rest-dtls-rev-title'>Reviews:</h3>
                    <div className='rest-dtls-rev-lst'>
                        {reviews.length > 0 ? reviews.map(({ photos, date, review, review_id, user_name }) => (
                            <div key={review_id} className='rest-dtls-rev-itm'>
                                <p className='rest-dtls-rev-info'>User: {user_name} | Date posted: {date}</p>
                                <p>{review}</p>
                                {photos && photos.length > 0 && photos.map(({ photo_id, photo_url }, index) => (
                                    <img
                                        key={photo_id}
                                        className='rest-dtls-rev-img'
                                        src={photo_url}
                                        alt={`Review ${review_id} photo ${photo_id}`}
                                        onClick={() => openModal(index)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                                <hr />
                            </div>
                        )) : <p>There are no reviews for this restaurant yet.</p>}
                    </div>
                    <ReviewModal
                        restaurant={restaurant}
                        setRestaurant={setRestaurant}
                        reviews={reviews}
                        setReviews={setReviews}
                        photos={photos}
                        setPhotos={setPhotos}
                    />
                </div>
            </div>

            <Modal className='rest-dtls-modal' isOpen={modalIsOpen} onRequestClose={closeModal}>
                {photos && photos.length > 0 && (
                    <>
                        <img src={photos[currentImageIndex].photo_url} alt="Expanded" className="modal-image" />
                        <button className='modal-btn' onClick={previousImage} disabled={currentImageIndex === 0}>Previous</button>
                        <button className='modal-btn' onClick={nextImage} disabled={currentImageIndex === photos.length - 1}>Next</button>
                        <button className='modal-btn' onClick={closeModal}>Close</button>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default RestaurantDetails;