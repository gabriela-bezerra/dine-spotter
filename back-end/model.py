"""Models for restaurant ratings app."""

from platform import release
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func, insert, update, delete


db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(20), nullable=False)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    profile_photo = db.Column(db.Text, nullable=True)

    ratings = db.relationship("Rating", back_populates="user")
    reviews = db.relationship("Review", back_populates="user")
    photos = db.relationship("Photo", back_populates="user")
    favorites = db.relationship("Favorite", back_populates="user")

    def __repr__(self):
        return f'<User user_id={self.user_id}, name={self.fname} {self.lname}, email={self.email}, photo = {self.profile_photo}>'


class Restaurant(db.Model):
    """A restaurant."""

    __tablename__ = 'restaurants'

    restaurant_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(50))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    zipcode = db.Column(db.String(50))
    latitude = db.Column(db.String(50))
    longitude = db.Column(db.String(50))
    photo_cover = db.Column(db.Text, nullable=False)

    ratings = db.relationship("Rating", back_populates="restaurant")
    reviews = db.relationship("Review", back_populates="restaurant")
    photos = db.relationship("Photo", back_populates="restaurant")
    favorites = db.relationship("Favorite", back_populates="restaurant")

    categories = db.relationship(
        "Category", secondary="restaurantsCategories", back_populates="restaurants")

    def __repr__(self):
        return f'<Restaurant name={self.name}>'

    def to_dict(self):

        return {
            'restaurant_id': self.restaurant_id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipcode': self.zipcode,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'photo_cover': self.photo_cover}


class Category(db.Model):
    """A category."""

    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    restaurants = db.relationship(
        "Restaurant", secondary="restaurantsCategories", back_populates="categories")

    def __repr__(self):
        return f'<Category category_id={self.category_id} name={self.name}>'


class RestaurantCategory(db.Model):
    """A restaurant category."""

    __tablename__ = 'restaurantsCategories'

    restaurant_category_id = db.Column(
        db.Integer, autoincrement=True, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(
        "restaurants.restaurant_id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(
        "categories.category_id"), nullable=False)

    def __repr__(self):
        return f'<Restaurants Categories id={self.restaurant_category_id}, restaurant_id={self.restaurant_id}, category_id={self.category_id} >'


class Favorite(db.Model):
    """A favorite restaurant."""

    __tablename__ = 'favorites'

    favorite_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(
        "restaurants.restaurant_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.user_id"), nullable=False)

    restaurant = db.relationship("Restaurant", back_populates="favorites")
    user = db.relationship("User", back_populates="favorites")

    def __repr__(self):
        return f'<Favorites id={self.favorite_id}, restaurant_id={self.restaurant_id}, user_id={self.user_id} >'

    def to_dict(self):
        return {
            'favorite_id': self.favorite_id,
            'restaurant_id': self.restaurant_id,
            'user_id': self.user_id}


class Rating(db.Model):
    """A rating."""

    __tablename__ = 'ratings'

    rating_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.restaurant_id"))
    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.user_id"), nullable=True)
    score = db.Column(db.Float)

    restaurant = db.relationship("Restaurant", back_populates="ratings")
    user = db.relationship("User", back_populates="ratings")

    def __repr__(self):
        return f'<Rating rating_id={self.rating_id} restaurant_id={self.restaurant_id} score={self.score} user_id={self.user_id}>'

    def to_dict(self):

        return {
            'rating_id': self.rating_id,
            'restaurant_id': self.restaurant_id,
            'user_id': self.user_id,
            'score': self.score}


class Review(db.Model):
    """A review."""

    __tablename__ = 'reviews'

    review_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.restaurant_id"))
    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.user_id"), nullable=True)
    review = db.Column(db.Text)
    date = db.Column(db.String)

    restaurant = db.relationship("Restaurant", back_populates="reviews")
    user = db.relationship("User", back_populates="reviews")
    photos = db.relationship("Photo", back_populates="reviews")

    def __repr__(self):
        return f'<Reviews review_id={self.review_id} restaurant_id={self.restaurant_id} user_id={self.user_id}, review={self.review}>'

    def to_dict(self):

        return {
            'review_id': self.review_id,
            'restaurant_id': self.restaurant_id,
            'user_id': self.user_id,
            'user_name': f'{self.user.fname} {self.user.lname}',
            'review': self.review,
            'date': self.date,
            'photos': [photo.to_dict() for photo in self.photos]
        }


class Photo(db.Model):
    """A photo."""

    __tablename__ = 'photos'

    photo_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    photo_url = db.Column(db.Text)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.restaurant_id"))
    review_id = db.Column(db.Integer, db.ForeignKey(
        "reviews.review_id"))
    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.user_id"), nullable=True)

    restaurant = db.relationship("Restaurant", back_populates="photos")
    user = db.relationship("User", back_populates="photos")
    reviews = db.relationship("Review", back_populates="photos")

    def to_dict(self):

        return {
            'photo_id': self.photo_id,
            'photo_url': self.photo_url,
            'restaurant_id': self.restaurant_id,
            'review_id': self.review_id,
            'user_id': self.user_id,

        }

    def __repr__(self):
        return f'<Photo photo_id={self.photo_id} photo_url={self.photo_url}>'


def connect_to_db(flask_app, db_uri="postgresql:///restaurants", echo=False):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
