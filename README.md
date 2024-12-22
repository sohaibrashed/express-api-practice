# Express E-commerce API

A robust RESTful API built using Express.js and MongoDB, featuring comprehensive authentication, authorization, media handling, notifications, and e-commerce functionalities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Features

- **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (User, Admin, Owner)
  - Password reset functionality
  - OTP verification
  - Phone number verification via Twilio

- **User Management**

  - User registration and profile management
  - Multiple address management
  - Email verification
  - Phone verification
  - Password reset via email/phone

- **Product Management**

  - Category and subcategory organization
  - Brand management
  - Product variants (size, color, stock)
  - Image management with Cloudinary
  - Product reviews and ratings

- **Order System**

  - Shopping cart functionality
  - Order processing and tracking
  - Multiple payment methods
  - Order status updates
  - Shipping address management

- **Additional Features**
  - Favorite products
  - Product reviews and ratings
  - Image upload and management
  - Email notifications
  - WhatsApp notifications via Twilio
  - Rate limiting and API security

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Cloudinary for image management
- Twilio for WhatsApp/SMS
- Nodemailer for emails
- Jest for testing

## Requirements

- Node.js (v14+)
- MongoDB (v4.4+)
- NPM or Yarn
- Cloudinary account
- Twilio account
- SMTP server access

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sohaibrashed/express-api-practice.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your MongoDB instance (local or cloud)

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Environment
NODE_ENV=development # Options: development, production, test
PORT=3000
LIMIT=10 # API rate limiting
FRONTEND_URL=http://localhost:3000

# Database
DB_USER_NAME=your_db_username
DB_PASSWORD=your_db_password
MONGODB_URI=your_production_mongodb_uri
MONGODB_URI_TEST=your_test_mongodb_uri

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Token Expiration
PASSWORD_RESET_TOKEN_EXP=3600000 # 1 hour in milliseconds
OTP_RESET_TOKEN_EXP=300000 # 5 minutes in milliseconds

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=your_whatsapp_number

# SMTP Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

## Running the Application

Development mode:

```bash
npm run server
```

Production mode:

```bash
npm run server
```

Testing mode:

```bash
npm run test
```

## API Documentation

API documentation is available at `/api-docs` when running the server locally.

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/        # Custom middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
├── tests/             # Test files
├── uploads/           # Temporary file uploads
└── validations/       # Request validation schemas
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
