import React, { useState } from 'react';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import RestaurantPhotos from './ImgurUpload';
import { showToast } from './Toast';
import './ReviewModal.css';

// Set the app element for react-modal
Modal.setAppElement('#root');

function ReviewModal({ photos, setPhotos, restaurant, setRestaurant, reviews, setReviews }) {
    const { restaurant_id } = useParams();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [addReview, setAddReview] = useState({ rating_score: 0, review: '' });

    const ratingChanged = (newRating) => {
        setAddReview(prev => ({ ...prev, rating_score: newRating }));
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/add-reviews', {
                method: 'POST',
                body: JSON.stringify([addReview, restaurant_id]),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setReviews(data);
            showToast('Review added successfully', 'success');
            setModalIsOpen(false);
            // Instead of reloading the page, update the state
            setAddReview({ rating_score: 0, review: '' });
        } catch (error) {
            console.error('Error adding review:', error);
            showToast('Failed to add review', 'error');
        }
    };

    return (
        <>
            <button className='review-btn' type='button' onClick={() => setModalIsOpen(true)}>
                Add A Review
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Add Review Modal"
                className="review-modal"
                overlayClassName="review-modal-overlay"
            >
                <h2>Add Review</h2>
                <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    isHalf={true}
                    value={addReview.rating_score}
                    activeColor="#ffd700"
                />
                <form onSubmit={handleAddReview}>
                    <div className="form-group">
                        <label htmlFor="review">Write a review...</label>
                        <textarea
                            id="review"
                            rows="3"
                            value={addReview.review}
                            onChange={(e) => setAddReview(prev => ({ ...prev, review: e.target.value }))}
                            required
                        />
                    </div>
                    <RestaurantPhotos addReview={addReview} setAddReview={setAddReview} />
                    <div className="modal-actions">
                        <button type="button" onClick={() => setModalIsOpen(false)}>Close</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default ReviewModal;