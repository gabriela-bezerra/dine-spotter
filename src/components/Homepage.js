import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Edit } from 'lucide-react';
import './Homepage.css';

function Homepage() {
    return (
        <div className="homepage">
            <header className="hero">
                <h1>Welcome to Dine Spotter</h1>
                <p>Discover the best dining experiences in your area</p>
                <Link to="/search" className="btn btn-primary">Start Exploring</Link>
            </header>

            <section className="features">
                <div className="feature">
                    <Search size={48} color="#F1C40F" />
                    <h2>Search Restaurants</h2>
                    <p>Find restaurants by cuisine, location, or rating</p>
                    <Link to="/search" className="btn btn-secondary">Start Searching</Link>
                </div>
                <div className="feature">
                    <Star size={48} color="#F1C40F" />
                    <h2>Read Reviews</h2>
                    <p>Get insights from other diners</p>
                    <Link to="/top-rated" className="btn btn-secondary">See Top Rated</Link>
                </div>
                <div className="feature">
                    <Edit size={48} color="#F1C40F" />
                    <h2>Add Reviews</h2>
                    <p>Share your own dining experiences</p>
                    <Link to="/login" className="btn btn-secondary">Login to Review</Link>
                </div>
            </section>

            <section className="cta">
                <h2>Ready to find your next favorite restaurant?</h2>
                <Link to="/sign-up" className="btn btn-large">Sign Up Now</Link>
            </section>
        </div>
    );
}

export default Homepage;