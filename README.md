# ShopPlusPlus E-commerce Platform

A full-stack e-commerce platform built with React, Node.js, Express, and MongoDB. Features a complete shopping experience with user authentication, product management, cart functionality, and order processing.

Deployed Link-https://shopplusplus-2-xelc.onrender.com

## Features

### User Features

- 🔐 User registration and authentication
- 🔍 Product browsing and searching
- 🏷️ Product filtering by category and brand
- ↕️ Product sorting (price, name)
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- 📦 Order placement and tracking
- ⭐ Product reviews and ratings
- 📍 Address management
- 💳 PayPal payment integration

### Admin Features

- 📝 Product management (CRUD operations)
- 📊 Order management
- 🔄 Order status updates
- 📦 Product inventory tracking
- 🖼️ Image upload functionality with Cloudinary
- 📈 Dashboard analytics (Coming Soon)

## Technology Stack

### Frontend

- React.js with Vite
- Redux Toolkit for state management
- Tailwind CSS + Shadcn UI
- Axios for API calls

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary Integration
- PayPal SDK

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- PayPal Developer Account
- Cloudinary Account

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ratan1221/ShopPlusPlus.git
cd shopplusplus
```

#Install backend dependencies:

cd backend
npm install

##Install frontend dependencies:
cd frontend
npm install

``please install shadcn package:-``
npx shadcn@latest init

##Configuration

**Backend Configuration (.env)**
``PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_BASE_URL=`http://localhost:5173``

**Frontend Configuration (.env)**
`VITE_API_BASE_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id`

**Running the Application
**
1. ``Start the backend server:``
   cd backend
   npm run dev

2. ``Start the frontend development server:``
   cd frontend
   npm run dev

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-auth` - Check authentication status

### Products

- `GET /api/shop/products/get` - Get filtered products
- `GET /api/shop/products/get/:id` - Get product details
- `POST /api/admin/products/add` - Create product (Admin)
- `PUT /api/admin/products/edit/:id` - Update product (Admin)
- `DELETE /api/admin/products/delete/:id` - Delete product (Admin)
- `POST /api/admin/products/upload-image` - Upload product image (Admin)

### Cart

- `POST /api/shop/cart/add` - Add to cart
- `GET /api/shop/cart/get/:userId` - Get user's cart
- `PUT /api/shop/cart/update-cart` - Update cart item quantity
- `DELETE /api/shop/cart/:userId/:productId` - Remove item from cart

### Orders

- `POST /api/shop/order/create` - Create new order
- `POST /api/shop/order/capture` - Capture PayPal payment
- `GET /api/shop/order/list/:userId` - Get user's orders
- `GET /api/shop/order/details/:id` - Get order details
- `GET /api/admin/orders/get` - Get all orders (Admin)
- `GET /api/admin/orders/details/:id` - Get order details (Admin)
- `PUT /api/admin/orders/update/:id` - Update order status (Admin)

### Address

- `POST /api/shop/address/add` - Add new address
- `GET /api/shop/address/get/:userId` - Get user's addresses
- `PUT /api/shop/address/update/:userId/:addressId` - Update address
- `DELETE /api/shop/address/delete/:userId/:addressId` - Delete address

### Reviews

- `POST /api/shop/review/add` - Add product review
- `GET /api/shop/review/:productId` - Get product reviews

### Wishlist

- `POST /api/shop/wishlist/add` - Add to wishlist
- `GET /api/shop/wishlist/:userId` - Get user's wishlist
- `POST /api/shop/wishlist/merge` - Merge guest wishlist with user wishlist
- `DELETE /api/shop/wishlist/:userId/:productId` - Remove from wishlist

### Search

- `GET /api/shop/search/:keyword` - Search products

### Features (Admin)

- `POST /api/common/feature/add` - Add feature image
- `GET /api/common/feature/get` - Get all feature images

#### Testing 
###### For PayPal payment use below Email and Password (Dummy)

``Email: sb-wp96q34470267@personal.example.com``
``Password: pV&@sjg3``

###### Demo Accounts for ShopPlusPlus:
**Admin :-**
``Email-ratanyadav1400@gmail.com``
``Password -Piku@1221``

**Please Note:-I have not implemented Admin registration flow yet but i will do it in upcoming versions.
I manually create the Admin registration.**
