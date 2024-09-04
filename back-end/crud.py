"""CRUD operations."""

from model import db, Favorite, User, Restaurant, Category, RestaurantCategory, Rating, Review, Photo, connect_to_db
from sqlalchemy.sql import func, insert, update


# Users ------------

def create_new_user(email, password, fname, lname, profile_photo=None):
    """Creates and returns a new user."""

    return User(email=email, password=password, fname=fname, lname=lname, profile_photo=profile_photo)


def get_all_users():
    """Retrieves all users from the database."""

    return User.query.all()


def get_user_by_id(user_id):
    """Retrieves a user by their ID."""

    return User.query.filter(User.user_id == user_id).first()


def get_user_by_email(email):
    """Retrieves a user by their email address."""

    return User.query.filter(User.email == email).first()


def get_user_password_and_user_id(email):
    """Retrieves the password and user ID of a user by their email address."""

    user = User.query.filter(User.email == email).first()

    if user:
        return [user.password, user.user_id]
    else:
        return [None, None]


def get_random_user_from_db():
    """Retrieves a random user from the database."""

    return User.query.order_by(func.random()).first()


def add_profile_photo(user_id, photo_url):
    """Adds a profile photo to a user."""

    user = User.query.get(user_id)

    user.profile_photo = photo_url

    db.session.flush()
    db.session.commit()

# Restaurants ------------


def create_new_restaurant(name, address, city, state, zipcode, photo_cover, latitude=None, longitude=None):
    """Creates and returns a new restaurant."""

    return Restaurant(name=name, address=address, city=city, state=state, zipcode=zipcode, photo_cover=photo_cover, latitude=latitude, longitude=longitude)


def get_all_restaurants():
    """ Retrieves all restaurants from the database."""

    return Restaurant.query.all()


def get_restaurant_by_id(restaurant_id):
    """Retrieves a restaurant by its ID."""

    return Restaurant.query.filter(Restaurant.restaurant_id == restaurant_id).first()


def get_restaurant_by_name(restaurant_name):
    """Retrieves a restaurant by its name"""

    return Restaurant.query.filter(Restaurant.name == restaurant_name).first()


def get_restaurant_by_zipcode(restaurant_zipcode):
    """Retrieves restaurants by their zip code."""

    return Restaurant.query.filter(Restaurant.zipcode == restaurant_zipcode).all()


def get_random_restaurant_from_db():
    """Retrieves a random restaurant from the database."""

    return Restaurant.query.order_by(func.random()).first()


# Categories ------------

def create_a_category(name):
    """Creates and returns a new category."""

    checking_categories = Category.query.filter(Category.name == name).first()

    if checking_categories:
        return checking_categories
    else:
        return Category(name=name)


def get_all_categories():
    """Retrieves all categories from the database."""

    return Category.query.all()


def get_categoryId_by_name(name):
    """Retrieves categories by their name"""

    return Category.query.filter(Category.name == name).all()


def get_random_category_from_db():
    """Retrieves a random category from the database."""

    return Category.query.order_by(func.random()).first()


def get_restaurants_by_category(category_name):
    """Retrieves all restaurants in a given category.."""

    get_category = Category.query.filter(
        Category.name == category_name).all()

    for categories in get_category:
        return categories.restaurants


# Restaurants categories ------------

def add_a_restaurant_to_a_category(restaurant_id, category_id):
    """Creates a relationship between a restaurant and a category."""

    return RestaurantCategory(restaurant_id=restaurant_id, category_id=category_id)


# Ratings ------------

def create_rating(restaurant_id, user_id, score):
    """Creates a rating for a restaurant by a user."""

    return Rating(restaurant_id=restaurant_id, user_id=user_id, score=score)


def get_ratings_by_user(user_id):
    """Retrieves all ratings made by a specific user."""

    return Rating.query.filter(Rating.user_id == user_id).first()


def get_ratings_by_restaurant(restaurant_id):
    """Retrieves the average rating of a specific restaurant."""

    return Rating.query.with_entities(func.avg(Rating.score)).filter(Rating.restaurant_id == restaurant_id).all()


# Favorites ------------

def add_a_restaurant_to_favorites(restaurant_id, user_id):
    """Adds a restaurant to a user's favorites."""

    return Favorite(restaurant_id=restaurant_id, user_id=user_id)


def filter_favorites_by_user(user_id):
    """ Retrieves all restaurants in a user's favorites."""

    return Favorite.query.filter(Favorite.user_id == user_id).all()


def check_restaurant_in_favorites(restaurant_id, user_id):
    """Checks if a restaurant is in a user's favorites."""

    return Favorite.query.filter((Favorite.restaurant_id == restaurant_id) & (Favorite.user_id == user_id)).first()


# Reviews ------------

def create_review(restaurant_id, user_id, review, date):
    """Creates a review for a restaurant by a user."""

    return Review(restaurant_id=restaurant_id, user_id=user_id, review=review, date=date)


def get_reviews_by_user(user_id):
    """Retrieves all reviews made by a specific user."""

    return Review.query.filter(Review.user_id == user_id).all()


def get_reviews_by_restaurant(restaurant_id):
    """Retrieves all reviews for a specific restaurant."""

    return Review.query.filter(
        Review.restaurant_id == restaurant_id).all()


def get_review_photos(review_id):
    """Retrieves all photos related to a review"""

    photos = []

    query = (
        db.session.query(Photo, Review)
        .join(Review, Review.review_id == Photo.review_id)
        .filter(Review.review_id == review_id)
    )
    results = query.all()

    for photo, review in results:
        photos.append({'Photo_id': photo.photo_id,
                      'Photo_url': photo.photo_url})

    return photos


# Photos ------------


def add_restaurant_photo(photo_url, restaurant_id, user_id, review_id):
    """Adds a photo to a restaurant."""

    return Photo(photo_url=photo_url, restaurant_id=restaurant_id, user_id=user_id, review_id=review_id)


def filter_photos_by_user(user_id):
    """Retrieves all photos added by a specific user."""

    return Photo.query.filter(Photo.user_id == user_id)


def filter_photos_by_restaurant(restaurant_id):
    """Retrieves all photos by a specific restaurant."""

    return Photo.query.filter(Photo.restaurant_id == restaurant_id).all()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
