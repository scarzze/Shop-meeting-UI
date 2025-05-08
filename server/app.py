from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

from config import Config
from models import db, bcrypt, User, Product, Cart, CartItem, Order, OrderItem, Payment, Review, Favorite, SupportTicket

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
Migrate(app, db)
jwt = JWTManager(app)

# Configure CORS with specific settings
CORS(app, resources={
    r"/*": {
        "origins": ["http://127.0.0.1:5173", "http://localhost:5173"],  # Frontend development server
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Authorization"]
    }
})

# Initialize Socket.IO
socketio = SocketIO(app, cors_allowed_origins=["http://127.0.0.1:5173", "http://localhost:5173"])

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

    return jsonify({'message': 'User registered successfully'}), 201

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

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

# Get current user profile
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email
    }

# Update profile
@app.route('/profile', methods=['POST'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.json or {}

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if username:
        user.username = username
    if email:
        user.email = email
    if password:
        user.set_password(password)

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})


# Get All Products
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'stock': p.stock,
        'image_url': p.image_url,
        'category': p.category  # Include category in the response
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
@app.route('/cart/<int:item_id>', methods=['PUT'])
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
    socketio.run(app, debug=True)