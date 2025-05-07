from app import db, app
from dotenv import load_dotenv
from models import User, Product, Review
from werkzeug.security import generate_password_hash
import random
import cloudinary
import cloudinary.uploader
import os

# Load environment variables from .env file
load_dotenv()

# Configure Cloudinary using environment variables
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

# Correct the key to retrieve the uploaded image URL
def upload_image_to_cloudinary(image_path):
    response = cloudinary.uploader.upload(image_path)
    return response['secure_url']  # Return the URL of the uploaded image

with app.app_context(): 
    db.drop_all()
    db.create_all()

    # Create users
    user1 = User(username='alice', email='alice@example.com', password_hash=generate_password_hash('test123'))
    user2 = User(username='bob', email='bob@example.com', password_hash=generate_password_hash('test123'))
    db.session.add_all([user1, user2])
    db.session.commit()

    # Create products from flashSales, bestSelling, exploreProducts, and newArrivals sections
    products = [
        Product(name='HAVIT HV-G92 Gamepad', description='High-quality gamepad for gaming enthusiasts.', price=1200, stock=50, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569547/HAVIT_HV-G92_Gamepad_ry0siv.jpg', category='Flash Sales'),
        Product(name='AK-900 Wired Keyboard', description='Durable wired keyboard for everyday use.', price=960, stock=75, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569547/AK-900_Wired_Keyboard_wyzsqw.jpg', category='Flash Sales'),
        Product(name='IPS LCD Gaming Monitor', description='High-resolution gaming monitor.', price=28000, stock=30, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569546/IPS_LCD_Gaming_Monitor_ehbcvd.jpg', category='Flash Sales'),
        Product(name='S-Series Comfort Chair', description='Ergonomic chair for comfort.', price=3750, stock=40, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569546/S-Series_Comfort_Chair_vxy9fm.jpg', category='Flash Sales'),
        Product(name='The north coat', description='Stylish and warm coat.', price=2600, stock=20, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569540/The_north_coat_jvrm3j.jpg', category='Best Selling'),
        Product(name='Gucci duffle bag', description='Luxury duffle bag.', price=9600, stock=15, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569539/Gucci_duffle_bag_mnxckr.jpg', category='Best Selling'),
        Product(name='RGB liquid CPU Cooler', description='Efficient CPU cooling solution.', price=1600, stock=25, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569539/RGB_liquid_CPU_Cooler_fkvlyj.jpg', category='Best Selling'),
        Product(name='Small BookShelf', description='Compact bookshelf for small spaces.', price=3600, stock=10, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569539/Small_BookShelf_gnmuyx.jpg', category='Best Selling'),
        Product(name='Breed Dry Dog Food', description='Nutritious dry dog food.', price=1000, stock=100, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569538/Breed_Dry_Dog_Food_xwdpz9.jpg', category='Explore Products'),
        Product(name='CANON EOS DSLR Camera', description='High-quality DSLR camera.', price=3600, stock=20, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569531/CANON_EOS_DSLR_Camera_op1fa8.jpg', category='Explore Products'),
        Product(name='ASUS F10 Gaming Laptop', description='Powerful gaming laptop.', price=7000, stock=10, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569531/ASUS_F10_Gaming_Laptop_trfaau.jpg', category='Explore Products'),
        Product(name='Curology Product Set', description='Complete skincare product set.', price=5000, stock=30, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569530/Curology_Product_Set_ujfhwx.avif', category='Explore Products'),
        Product(name='Kids Electric Car', description='Fun electric car for kids.', price=9600, stock=5, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569531/Kids_Electric_Car_td4hss.webp', category='Explore Products'),
        Product(name='Jr. Zoom Soccer Cleats', description='High-performance soccer cleats.', price=11600, stock=8, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569530/Jr._Zoom_Soccer_Cleats_gyera1.jpg', category='Explore Products'),
        Product(name='GP11 Shooter USB Gamepad', description='USB gamepad for gaming.', price=6600, stock=20, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569529/GP11_Shooter_USB_Gamepad_doahfk.jpg', category='Explore Products'),
        Product(name='Quilted Satin Jacket', description='Elegant satin jacket.', price=6600, stock=12, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569530/Quilted_Satin_Jacket_svyu2c.jpg', category='Explore Products'),
        Product(name='PlayStation 5', description='Next-gen gaming console.', price=50000, stock=10, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569529/ps5_cordbj.jpg', category='New Arrivals'),
        Product(name="Women's Collections", description='Exclusive women fashion collections.', price=15000, stock=20, image_url='https://res.cloudinary.com/dyzqn2sju/image/upload/v1746569530/womencollection_jiqros.webp', category='New Arrivals'),
    ]

    db.session.add_all(products)
    db.session.commit()

    # Add reviews
    for i in range(5):
        review = Review(
            user_id=random.choice([user1.id, user2.id]),
            product_id=random.choice(products).id,
            rating=random.randint(3, 5),
            review_text="Great product!"
        )
        db.session.add(review)

    db.session.commit()
    print("Database seeded successfully.")
