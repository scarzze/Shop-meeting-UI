# Shop Meeting UI

A modern e-commerce platform with real-time features, personalized recommendations, and a seamless shopping experience.

![Shop Meeting UI](https://i.imgur.com/YourImageHere.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Backend Deployment (Render)](#backend-deployment-render)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

Shop Meeting UI is a full-stack e-commerce application that provides users with a modern shopping experience. The platform includes user authentication, product browsing, cart management, wishlists, personalized recommendations, and a secure checkout process.

## Features

- **User Authentication**: Secure login, registration, and profile management
- **Product Catalog**: Browse products with filtering and sorting options
- **Shopping Cart**: Add, update, and remove items from your cart
- **Wishlist**: Save favorite products for future reference
- **Personalized Recommendations**: Get product suggestions based on browsing history and favorites
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Socket.IO integration for live notifications and chat support
- **Secure Checkout**: Multiple payment options and address management
- **Order Tracking**: View and manage orders

## Tech Stack

### Frontend
- React.js
- Context API for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Socket.IO client for real-time features

### Backend
- Flask (Python)
- SQLAlchemy ORM
- Flask-JWT-Extended for authentication
- Flask-SocketIO for real-time communication
- PostgreSQL database (production)
- SQLite (development)

## Project Structure

```
Shop-meeting-UI/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   ├── .env.sample         # Sample environment variables
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend Flask application
│   ├── migrations/         # Database migrations
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   ├── models.py           # Database models
│   ├── requirements.txt    # Backend dependencies
│   └── Procfile            # Deployment configuration
│
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL (for production) or SQLite (for development)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/Shop-meeting-UI.git
cd Shop-meeting-UI
```

2. **Set up the backend**

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Create a .env file in the server directory**

```
DATABASE_URL=sqlite:///shopmeeting.db
SECRET_KEY=your_secret_key_here
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=your_cloudinary_url
```

4. **Initialize the database**

```bash
flask db init
flask db migrate
flask db upgrade
```

5. **Set up the frontend**

```bash
cd ../client
npm install
```

6. **Create a .env file in the client directory**

```
VITE_API_URL=http://localhost:5000
```

### Running Locally

1. **Start the backend server**

```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

2. **Start the frontend development server**

```bash
cd client
npm run dev
```

3. **Access the application**

Open your browser and navigate to `http://localhost:5173`

## Deployment

### Frontend Deployment (Vercel)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI**

```bash
npm install -g vercel
```

3. **Deploy the frontend**

```bash
cd client
vercel
```

4. **Set environment variables in Vercel**

- `VITE_API_URL`: Your backend API URL (e.g., https://shop-meeting-api.onrender.com)

### Backend Deployment (Render)

1. **Create a Render account** at [render.com](https://render.com)

2. **Set up a PostgreSQL database**

- Go to the Render Dashboard
- Click "New" > "PostgreSQL"
- Fill in the database name and other details
- Create the database and note the connection details

3. **Deploy the backend**

- Go to the Render Dashboard
- Click "New" > "Web Service"
- Connect your GitHub repository
- Configure the service:
  - **Name**: shop-meeting-api
  - **Runtime**: Python 3
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `gunicorn --worker-class eventlet -w 1 app:app`
  - **Root Directory**: `server`

4. **Set environment variables in Render**

- `DATABASE_URL`: Your PostgreSQL connection string
- `SECRET_KEY`: A secure random string for JWT encryption
- `FRONTEND_URL`: Your Vercel frontend URL
- `FLASK_ENV`: Set to `production`
- `CLOUD_NAME`: Your Cloudinary cloud name
- `API_KEY`: Your Cloudinary API key
- `API_SECRET`: Your Cloudinary API secret
- `CLOUDINARY_URL`: Your Cloudinary URL

5. **Run database migrations**

- Connect to your Render service shell
- Run the following commands:
  ```
  flask db init
  flask db migrate
  flask db upgrade
  ```

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
SECRET_KEY=your_secret_key_here
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=your_cloudinary_url
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

## API Documentation

### Authentication Endpoints

- `POST /register`: Register a new user
- `POST /login`: Authenticate a user
- `POST /logout`: Log out a user
- `POST /refresh`: Refresh JWT token

### User Endpoints

- `GET /profile`: Get user profile
- `PUT /profile`: Update user profile
- `GET /address-book`: Get user address book
- `PUT /address-book`: Update user address book
- `GET /payment-options`: Get user payment options
- `POST /payment-options`: Add a payment option
- `DELETE /payment-options/<id>`: Delete a payment option

### Product Endpoints

- `GET /products`: Get all products
- `GET /products/<category>`: Get products by category
- `GET /products/<id>`: Get product by ID

### Cart Endpoints

- `GET /cart`: Get cart items
- `POST /cart`: Add item to cart
- `PUT /cart/<item_id>`: Update cart item quantity
- `DELETE /cart/<item_id>`: Remove item from cart

### Wishlist Endpoints

- `GET /wishlist`: Get wishlist items
- `POST /wishlist`: Add item to wishlist
- `DELETE /wishlist/<product_id>`: Remove item from wishlist

### Order Endpoints

- `POST /checkout`: Create a new order
- `GET /orders`: Get user orders

### Review Endpoints

- `POST /products/<product_id>/reviews`: Add a product review
- `GET /products/<product_id>/reviews`: Get product reviews

### Recommendation Endpoint

- `GET /recommendations`: Get personalized product recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
