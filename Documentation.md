# ShopPlusPlus E-commerce Platform

ShopPlusPlus is a full-stack e-commerce platform built with React, Node.js Express, and MongoDB. It features a complete shopping experience with user authentication, product management, cart functionality, and order processing.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

## Features

### User Features

- User registration and authentication
- Product browsing and searching
- Product filtering by category and brand
- Product sorting (price, name)
- Shopping cart management
- Wishlist functionality
- Order placement and tracking
- Product reviews and ratings
- Address management
- PayPal payment integration

### Admin Features

- Product management (CRUD operations)
- Order management
- Order status updates
- Product inventory tracking
- Image upload functionality
- Dashboard analytics

## Technology Stack

### Frontend

- React.js with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Shadcn UI components
- Axios for API calls

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- PayPal SDK for payments

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- PayPal Developer Account
- Cloudinary Account

###Project Structure

ShopPlusPlus/
├── backend/
│ ├── controllers/
│ │ ├── admin/
│ │ │ ├── order-controller.js
│ │ │ └── products-controller.js
│ │ ├── auth/
│ │ │ └── auth-controller.js
│ │ └── shop/
│ │ ├── address-controller.js
│ │ ├── cart-controller.js
│ │ ├── order-controller.js
│ │ ├── product-review-controller.js
│ │ ├── products-controller.js
│ │ ├── search-controller.js
│ │ └── wishlist-controller.js
│ ├── models/
│ │ ├── Address.js
│ │ ├── Cart.js
│ │ ├── Features.js
│ │ ├── Order.js
│ │ ├── Product.js
│ │ ├── Review.js
│ │ ├── User.js
│ │ └── Wishlist.js
│ ├── routes/
│ │ ├── admin/
│ │ ├── auth/
│ │ └── shop/
│ ├── helpers/
│ │ ├── cloudinary.js
│ │ └── paypal.js
│ └── server.js
└── frontend/
├── src/
│ ├── components/
│ │ ├── admin-view/
│ │ ├── auth/
│ │ ├── common/
│ │ ├── shopping-view/
│ │ └── ui/
│ ├── pages/
│ │ ├── admin-view/
│ │ ├── auth/
│ │ └── shopping-view/
│ ├── store/
│ │ ├── admin/
│ │ ├── auth/
│ │ └── shop/
│ ├── config/
│ ├── lib/
│ └── assets/
└── package.json

### Installation

#Install backend dependencies:
cd backend
npm install

##Install frontend dependencies:
cd frontend
npm install
please install shadcn package:-
npx shadcn@latest init


## Core Features Implementation

### Authentication System

- JWT-based auth
- Role-based access (Admin/User)
- Session management
- Password encryption

### Product Management

- CRUD operations
- Image upload with Cloudinary
- Category/Brand filtering
- Search functionality
- Sorting options

### Shopping Features

- Cart management
- Wishlist functionality
- Order processing
- Address management
- PayPal integration
