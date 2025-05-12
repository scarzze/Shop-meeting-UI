from flask import Flask, request, jsonify, url_for, render_template
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_jwt_extended import set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import timedelta
import os

from config import Config
from models import db, bcrypt, User, Product, Cart, CartItem, Order, OrderItem, Payment, Review, Favorite, SupportTicket, PaymentMethod

app = Flask(__name__)
app.config.from_object(Config)

# Set token expiration times
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'

db.init_app(app)
bcrypt.init_app(app)
Migrate(app, db)
jwt = JWTManager(app)

# Configure CORS with specific settings
# Get frontend URL from environment variable or use a default list of allowed origins
frontend_url = os.getenv('FRONTEND_URL')

# Remove trailing slash if present in the frontend URL
if frontend_url and frontend_url.endswith('/'):
    frontend_url = frontend_url[:-1]

allowed_origins = ["http://127.0.0.1:5173", "http://localhost:5173", "http://localhost:3000"]

# Add frontend URL if it exists
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

CORS(app, 
     resources={r"/*": {
         "origins": allowed_origins,
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Added all common methods
         "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
         "supports_credentials": True,
         "expose_headers": ["Authorization"]
     }},
     supports_credentials=True,
     allow_credentials=True
)

# Initialize Socket.IO with the same allowed origins as CORS
# Use '*' for development to avoid CORS issues with Socket.IO
if os.getenv('FLASK_ENV') == 'production':
    socketio = SocketIO(app, cors_allowed_origins=allowed_origins, supports_credentials=True)
else:
    socketio = SocketIO(app, cors_allowed_origins="*", supports_credentials=True)

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_chat')
def handle_join_chat(data):
    user_id = data.get('user_id')
    ticket_id = data.get('ticket_id')
    if user_id and ticket_id:
        join_room(ticket_id)
        emit('new_message', {'user_id': 'system', 'message': f'User {user_id} joined the chat'}, room=ticket_id)

@socketio.on('leave_chat')
def handle_leave_chat(data):
    ticket_id = data.get('ticket_id')
    if ticket_id:
        leave_room(ticket_id)

@socketio.on('chat_message')
def handle_chat_message(data):
    user_id = data.get('user_id')
    ticket_id = data.get('ticket_id')
    message = data.get('message')
    if user_id and ticket_id and message:
        emit('new_message', {'user_id': user_id, 'message': message}, room=ticket_id)

@socketio.on('contact_form')
def handle_contact_form(data):
    try:
        # Create a new support ticket from contact form
        ticket = SupportTicket(
            user_id=data.get('user_id', 'anonymous'),
            subject=data.get('subject', 'Contact Form'),
            message=data.get('message', '')
        )
        db.session.add(ticket)
        db.session.commit()
        emit('contact_form_status', {'success': True})
    except Exception as e:
        emit('contact_form_status', {'success': False, 'error': str(e)})

# Error handling
@app.errorhandler(NoAuthorizationError)
def handle_no_auth_error(e):
    return jsonify({'error': 'Authorization token is missing or invalid'}), 401

@app.before_request
def log_request_info():
    if request.endpoint == 'add_to_cart':
        print('Headers:', request.headers)
        print('Authorization Header:', request.headers.get('Authorization'))

@app.route('/')
def index():
    return {'message': 'Welcome to Shop Meeting API'}


# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'Username or email already exists'}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User registered successfully. You can now log in.',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Create access token and refresh token
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    # Set JWT cookies and also include token in response body
    response = jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    })
    
    # Set cookies
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    
    return response, 200

# Email verification endpoints removed

# User Logout
@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(response)
    return response, 200

# Token Refresh
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    response = jsonify({
        'message': 'Token refreshed',
        'access_token': access_token
    })
    set_access_cookies(response, access_token)
    return response, 200

# Get current user profile
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    # Get payment methods
    payment_methods = [{
        'id': pm.id,
        'card_type': pm.card_type,
        'last_four': pm.last_four,
        'cardholder_name': pm.cardholder_name,
        'expiry_date': pm.expiry_date,
        'is_default': pm.is_default
    } for pm in PaymentMethod.query.filter_by(user_id=user.id).all()]
    
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'address': {
            'address_line1': user.address_line1,
            'address_line2': user.address_line2,
            'city': user.city,
            'state': user.state,
            'postal_code': user.postal_code,
            'country': user.country
        },
        'payment_methods': payment_methods,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }

# Update profile
@app.route('/profile', methods=['POST'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.json or {}

    # Basic info
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data and data['password']:
        user.set_password(data['password'])
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'phone' in data:
        user.phone = data['phone']
    
    # Address fields
    address = data.get('address', {})
    if address:
        if 'address_line1' in address:
            user.address_line1 = address['address_line1']
        if 'address_line2' in address:
            user.address_line2 = address['address_line2']
        if 'city' in address:
            user.city = address['city']
        if 'state' in address:
            user.state = address['state']
        if 'postal_code' in address:
            user.postal_code = address['postal_code']
        if 'country' in address:
            user.country = address['country']

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})


# Address Book
@app.route('/address-book', methods=['GET'])
@jwt_required()
def get_address_book():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    return {
        'address': {
            'address_line1': user.address_line1,
            'address_line2': user.address_line2,
            'city': user.city,
            'state': user.state,
            'postal_code': user.postal_code,
            'country': user.country
        }
    }

@app.route('/address-book', methods=['POST'])
@jwt_required()
def update_address_book():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.json or {}
    
    if 'address_line1' in data:
        user.address_line1 = data['address_line1']
    if 'address_line2' in data:
        user.address_line2 = data['address_line2']
    if 'city' in data:
        user.city = data['city']
    if 'state' in data:
        user.state = data['state']
    if 'postal_code' in data:
        user.postal_code = data['postal_code']
    if 'country' in data:
        user.country = data['country']
    
    db.session.commit()
    return jsonify({'message': 'Address updated successfully'})


# Payment Options
@app.route('/payment-options', methods=['GET'])
@jwt_required()
def get_payment_options():
    user_id = get_jwt_identity()
    payment_methods = PaymentMethod.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'payment_methods': [{
            'id': pm.id,
            'card_type': pm.card_type,
            'last_four': pm.last_four,
            'cardholder_name': pm.cardholder_name,
            'expiry_date': pm.expiry_date,
            'is_default': pm.is_default
        } for pm in payment_methods]
    })

@app.route('/payment-options', methods=['POST'])
@jwt_required()
def add_payment_option():
    user_id = get_jwt_identity()
    data = request.json or {}
    
    # Check if this is the first payment method (make it default)
    is_default = False
    if PaymentMethod.query.filter_by(user_id=user_id).count() == 0:
        is_default = True
    
    # Create new payment method
    payment_method = PaymentMethod(
        user_id=user_id,
        card_type=data.get('card_type'),
        last_four=data.get('last_four'),
        cardholder_name=data.get('cardholder_name'),
        expiry_date=data.get('expiry_date'),
        is_default=data.get('is_default', is_default)
    )
    
    # If this is set as default, unset other defaults
    if payment_method.is_default:
        PaymentMethod.query.filter_by(user_id=user_id, is_default=True).update({PaymentMethod.is_default: False})
    
    db.session.add(payment_method)
    db.session.commit()
    
    return jsonify({
        'message': 'Payment method added successfully',
        'payment_method': {
            'id': payment_method.id,
            'card_type': payment_method.card_type,
            'last_four': payment_method.last_four,
            'cardholder_name': payment_method.cardholder_name,
            'expiry_date': payment_method.expiry_date,
            'is_default': payment_method.is_default
        }
    }), 201

@app.route('/payment-options/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment_option(payment_id):
    user_id = get_jwt_identity()
    payment_method = PaymentMethod.query.filter_by(id=payment_id, user_id=user_id).first_or_404()
    
    was_default = payment_method.is_default
    db.session.delete(payment_method)
    
    # If deleted method was default, set a new default if any methods remain
    if was_default:
        remaining = PaymentMethod.query.filter_by(user_id=user_id).first()
        if remaining:
            remaining.is_default = True
    
    db.session.commit()
    return jsonify({'message': 'Payment method deleted successfully'})


# My Orders
@app.route('/my-orders', methods=['GET'])
@jwt_required()
def get_my_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'orders': [{
            'id': order.id,
            'created_at': order.created_at.isoformat(),
            'status': order.status,
            'shipping_address': order.shipping_address,
            'items': [{
                'id': item.id,
                'product_id': item.product_id,
                'product_name': item.product.name if item.product else 'Unknown Product',
                'quantity': item.quantity,
                'price': item.price_at_purchase
            } for item in order.items],
            'payment': {
                'amount': order.payment.amount,
                'status': order.payment.status,
                'payment_method': order.payment.payment_method
            } if order.payment else None
        } for order in orders]
    })


# My Returns
@app.route('/my-returns', methods=['GET'])
@jwt_required()
def get_my_returns():
    user_id = get_jwt_identity()
    # Filter orders with status 'Returned' or 'Return Requested'
    returns = Order.query.filter(Order.user_id == user_id, 
                                Order.status.in_(['Returned', 'Return Requested']))\
                         .order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'returns': [{
            'id': order.id,
            'created_at': order.created_at.isoformat(),
            'status': order.status,
            'items': [{
                'id': item.id,
                'product_name': item.product.name if item.product else 'Unknown Product',
                'quantity': item.quantity,
                'price': item.price_at_purchase
            } for item in order.items]
        } for order in returns]
    })


# My Cancellations
@app.route('/my-cancellations', methods=['GET'])
@jwt_required()
def get_my_cancellations():
    user_id = get_jwt_identity()
    # Filter orders with status 'Cancelled'
    cancellations = Order.query.filter_by(user_id=user_id, status='Cancelled')\
                              .order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'cancellations': [{
            'id': order.id,
            'created_at': order.created_at.isoformat(),
            'status': order.status,
            'items': [{
                'id': item.id,
                'product_name': item.product.name if item.product else 'Unknown Product',
                'quantity': item.quantity,
                'price': item.price_at_purchase
            } for item in order.items]
        } for order in cancellations]
    })


# Get All Products
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'oldPrice': p.oldPrice,
        'stock': p.stock,
        'image_url': p.image_url,
        'category': p.category  # Include category in the response
    } for p in products])

# Get Products by Category
@app.route('/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    # URL decode the category name to handle spaces and special characters
    from urllib.parse import unquote
    category = unquote(category)
    
    products = Product.query.filter_by(category=category).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'oldPrice': p.oldPrice,
        'stock': p.stock,
        'image_url': p.image_url,
        'category': p.category
    } for p in products])

# Get Product by ID
@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'oldPrice': product.oldPrice,
        'stock': product.stock,
        'image_url': product.image_url
    }

# Helper: get or create cart
def get_or_create_cart(user_id):
    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()
    return cart

# Get Cart Items
@app.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = get_or_create_cart(user_id)
    return jsonify([{
        'item_id': item.id,
        'product_id': item.product_id,
        'name': item.product.name,
        'price': float(item.product.price),  # Ensure price is a float
        'quantity': item.quantity,
        'image_url': item.product.image_url,
        'stock': item.product.stock
    } for item in cart.items])

# Add or Update Cart Item
@app.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.json
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))  # Ensure quantity is an integer

    if not product_id or quantity < 1:
        return jsonify({'error': 'Invalid product or quantity'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    if quantity > product.stock:
        return jsonify({'error': f'Only {product.stock} items available'}), 400

    cart = get_or_create_cart(user_id)
    item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()

    if item:
        new_quantity = item.quantity + quantity
        if new_quantity > product.stock:
            return jsonify({'error': f'Cannot add {quantity} more items. Only {product.stock - item.quantity} available'}), 400
        item.quantity = new_quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.session.add(item)

    try:
        db.session.commit()
        return jsonify({
            'message': 'Item added to cart',
            'item': {
                'item_id': item.id,
                'product_id': item.product_id,
                'name': product.name,
                'price': float(product.price),
                'quantity': item.quantity,
                'image_url': product.image_url,
                'stock': product.stock
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add item to cart'}), 500

# Update Cart Item Quantity
@app.route('/cart/<int:item_id>', methods=['POST'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    data = request.json
    quantity = int(data.get('quantity', 1))

    if quantity < 1:
        return jsonify({'error': 'Invalid quantity'}), 400

    cart = get_or_create_cart(user_id)
    item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first_or_404()
    
    # Check product stock
    if quantity > item.product.stock:
        return jsonify({'error': f'Only {item.product.stock} items available'}), 400

    item.quantity = quantity
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Quantity updated',
            'item': {
                'item_id': item.id,
                'product_id': item.product_id,
                'name': item.product.name,
                'price': float(item.product.price),
                'quantity': item.quantity,
                'image_url': item.product.image_url,
                'stock': item.product.stock
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update quantity'}), 500

# Remove Item from Cart
@app.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    user_id = get_jwt_identity()
    cart = get_or_create_cart(user_id)
    item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first_or_404()
    
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item removed'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to remove item'}), 500

# Get wishlist
@app.route('/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'product_id': fav.product.id,
        'name': fav.product.name,
        'price': fav.product.price,
        'image_url': fav.product.image_url
    } for fav in favorites])

# Add to wishlist
@app.route('/wishlist', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    user_id = get_jwt_identity()
    data = request.json or {}
    product_id = data.get('product_id')

    if not Product.query.get(product_id):
        return jsonify({'error': 'Product not found'}), 404

    if Favorite.query.filter_by(user_id=user_id, product_id=product_id).first():
        return jsonify({'message': 'Already in wishlist'}), 200

    fav = Favorite(user_id=user_id, product_id=product_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({'message': 'Added to wishlist'}), 201

# Remove from wishlist
@app.route('/wishlist/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    user_id = get_jwt_identity()
    fav = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first_or_404()
    db.session.delete(fav)
    db.session.commit()
    return jsonify({'message': 'Removed from wishlist'})


# Checkout and Create Order
@app.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = get_jwt_identity()
    data = request.json or {}
    payment_method = data.get('payment_method', 'card')

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart or not cart.items:
        return jsonify({'error': 'Cart is empty'}), 400

    # Create order
    order = Order(user_id=user_id)
    db.session.add(order)
    db.session.flush()  # Get order.id without committing yet

    total_amount = 0
    for item in cart.items:
        product = Product.query.get(item.product_id)
        if product.stock < item.quantity:
            return jsonify({'error': f"Insufficient stock for product {product.name}"}), 400

        product.stock -= item.quantity
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price_at_purchase=product.price
        )
        total_amount += product.price * item.quantity
        db.session.add(order_item)

    # Simulate payment record
    payment = Payment(
        order_id=order.id,
        payment_method=payment_method,
        amount=total_amount,
        status='Paid'
    )
    db.session.add(payment)

    # Clear cart
    CartItem.query.filter_by(cart_id=cart.id).delete()

    db.session.commit()
    return jsonify({'message': 'Order placed successfully', 'order_id': order.id})

# Get User Orders
@app.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()

    result = []
    for order in orders:
        result.append({
            'order_id': order.id,
            'created_at': order.created_at.isoformat(),
            'status': order.status,
            'items': [{
                'product_id': item.product_id,
                'name': item.product.name,
                'quantity': item.quantity,
                'price': item.price_at_purchase
            } for item in order.items],
            'payment': {
                'method': order.payment.payment_method,
                'amount': order.payment.amount,
                'status': order.payment.status
            }
        })

    return jsonify(result)

# Add Review
@app.route('/products/<int:product_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(product_id):
    user_id = get_jwt_identity()
    data = request.json or {}

    rating = data.get('rating')
    review_text = data.get('review', '')

    if not rating or not (1 <= rating <= 5):
        return jsonify({'error': 'Rating must be 1-5'}), 400

    # Check if user purchased this product
    purchased = db.session.query(OrderItem).join(Order).filter(
        Order.user_id == user_id,
        OrderItem.product_id == product_id
    ).first()

    if not purchased:
        return jsonify({'error': 'You can only review products you purchased'}), 403

    review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=rating,
        review_text=review_text
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review submitted successfully'}), 201

# List Product Reviews
@app.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    return jsonify([{
        'username': r.user.username,
        'rating': r.rating,
        'review': r.review_text,
        'date': r.created_at.isoformat()
    } for r in reviews])


# Get personalized recommendations
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    # Make JWT optional manually since @jwt_required(optional=True) might be causing issues
    current_user_id = None
    try:
        current_user_id = get_jwt_identity()
    except Exception:
        # If no valid token, proceed as unauthenticated user
        pass
    limit = request.args.get('limit', 8, type=int)
    
    # If user is logged in, provide personalized recommendations
    if current_user_id:
        # Get user's favorite categories based on their favorites
        user_favorites = Favorite.query.filter_by(user_id=current_user_id).all()
        
        if user_favorites:
            # Extract product IDs from favorites
            favorite_product_ids = [fav.product_id for fav in user_favorites]
            
            # Get categories of favorite products
            favorite_products = Product.query.filter(Product.id.in_(favorite_product_ids)).all()
            favorite_categories = set(product.category for product in favorite_products)
            
            # Get products from the same categories, excluding already favorited ones
            recommended_products = Product.query.filter(
                Product.category.in_(favorite_categories),
                ~Product.id.in_(favorite_product_ids)
            ).order_by(db.func.random()).limit(limit).all()
            
            # If we don't have enough recommendations, add some random products
            if len(recommended_products) < limit:
                additional_count = limit - len(recommended_products)
                additional_products = Product.query.filter(
                    ~Product.id.in_(favorite_product_ids),
                    ~Product.id.in_([p.id for p in recommended_products])
                ).order_by(db.func.random()).limit(additional_count).all()
                
                recommended_products.extend(additional_products)
        else:
            # If user has no favorites yet, return trending products (most ordered)
            recommended_products = db.session.query(Product, db.func.count(OrderItem.id).label('order_count'))\
                .join(OrderItem, Product.id == OrderItem.product_id)\
                .group_by(Product.id)\
                .order_by(db.desc('order_count'))\
                .limit(limit)\
                .all()
            recommended_products = [p[0] for p in recommended_products]
    else:
        # For non-logged in users, return trending products
        recommended_products = db.session.query(Product, db.func.count(OrderItem.id).label('order_count'))\
            .join(OrderItem, Product.id == OrderItem.product_id)\
            .group_by(Product.id)\
            .order_by(db.desc('order_count'))\
            .limit(limit)\
            .all()
        recommended_products = [p[0] for p in recommended_products]
    
    # Add some visual indicators like discount or "new" tag to make it more interesting
    enhanced_products = []
    for i, product in enumerate(recommended_products):
        product_dict = {
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'description': product.description,
            'category': product.category,
            'image_url': product.image_url,
            'rating': product.rating
        }
        
        # Add random discount to some products
        if i % 3 == 0:
            discount_percent = 10 + (i % 4) * 5  # Discounts of 10%, 15%, 20%, 25%
            product_dict['discount'] = f'-{discount_percent}%'
            product_dict['oldPrice'] = round(product.price * (1 + discount_percent/100), 2)
        
        # Add "new" tag to some products
        if i % 4 == 2:
            product_dict['isNew'] = True
            
        enhanced_products.append(product_dict)
    
    return jsonify(enhanced_products)

# Submit support ticket
@app.route('/support', methods=['POST'])
@jwt_required()
def submit_ticket():
    user_id = get_jwt_identity()
    data = request.json or {}
    subject = data.get('subject')
    message = data.get('message')

    if not subject or not message:
        return jsonify({'error': 'Subject and message required'}), 400

    ticket = SupportTicket(user_id=user_id, subject=subject, message=message)
    db.session.add(ticket)
    db.session.commit()
    return jsonify({'message': 'Support request submitted'}), 201

# View user tickets
@app.route('/support', methods=['GET'])
@jwt_required()
def get_tickets():
    user_id = get_jwt_identity()
    tickets = SupportTicket.query.filter_by(user_id=user_id).order_by(SupportTicket.created_at.desc()).all()
    return jsonify([{
        'id': t.id,
        'subject': t.subject,
        'message': t.message,
        'status': t.status,
        'created_at': t.created_at.isoformat()
    } for t in tickets])


if __name__ == '__main__':
    # Use production settings when deployed, development settings locally
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    socketio.run(app, debug=debug_mode)