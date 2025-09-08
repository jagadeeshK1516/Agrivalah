# AgriValah Backend API

A comprehensive Node.js + Express + MongoDB backend for AgriValah - connecting farmers, customers, and the agricultural ecosystem.

## 🚀 Features

### Authentication & Users
- JWT-based authentication with access and refresh tokens
- Role-based access control (Customer, Mitra, Farmer, Reseller, Agritech Startup, Service Provider, Admin)
- OTP verification for signup and critical operations
- Secure password hashing with bcrypt

### Multi-type Seller Onboarding
- **Farmers**: Land details, soil type, crops, location-based farming
- **Resellers**: Business information, GST details, preferred categories
- **Agritech Startups**: Company details, nature of business, collaboration areas
- **Service Providers**: Equipment rental, storage services, farming services

### Product Management
- Complete product CRUD with image uploads
- Category-based organization (Vegetables, Fruits, Grains, etc.)
- Organic certification tracking
- Farmer traceability with QR codes
- Location-based product filtering

### Order Management
- Complete order lifecycle management
- Multiple payment methods (COD, Online)
- Order tracking and status updates
- Inventory management

### File Management
- AWS S3 integration for secure file uploads
- Signed URL generation for direct client uploads
- Support for images, documents, and videos

### Admin Dashboard
- Comprehensive analytics and statistics
- User and seller management
- KYC verification workflows
- Order management and oversight

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: AWS S3
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization
- **Validation**: Express-validator, Joi
- **Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston
- **Testing**: Jest + Supertest

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- MongoDB Atlas account (or local MongoDB)
- AWS S3 bucket for file storage
- Yarn package manager

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
yarn install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Required Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrivalah
DB_NAME=agrivalah

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Optional: OTP & Email
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 4. Database Setup

```bash
# Run migrations to create indexes
yarn migrate

# Seed database with sample data
yarn seed
```

### 5. Start the Server

```bash
# Development
yarn dev

# Production
yarn start
```

The API will be available at `http://localhost:8001`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8001/docs`
- **Health Check**: `http://localhost:8001/health`

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage

# Run specific test file
yarn test auth.test.js
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services (API + MongoDB + Redis)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Using Docker only

```bash
# Build image
docker build -t agrivalah-backend .

# Run container
docker run -d \
  --name agrivalah-backend \
  -p 8001:8001 \
  --env-file .env \
  agrivalah-backend
```

## 📊 Database Models

### User
- Authentication and profile information
- Role-based access control
- Mitra-specific details for investment tracking

### SellerProfile
- Polymorphic seller details based on type
- KYC status and verification
- Business metrics and ratings

### Product
- Complete product information
- Image management
- Farmer traceability
- Location and availability tracking

### Order
- Order lifecycle management
- Payment and delivery tracking
- Timeline and status updates

## 🔒 Security Features

- **Authentication**: JWT tokens with secure refresh mechanism
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **Data Sanitization**: Protection against NoSQL injection and XSS
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for production deployment

## 🚀 API Endpoints Overview

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/verify-otp` - OTP verification
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get profile
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/upload` - Upload profile media
- `GET /api/v1/users/:id/profile-qr` - Generate QR code

### Sellers
- `POST /api/v1/sellers/init` - Initialize seller registration
- `POST /api/v1/sellers/step/farmer` - Farmer details
- `POST /api/v1/sellers/step/reseller` - Reseller details
- `POST /api/v1/sellers/step/startup` - Startup details
- `POST /api/v1/sellers/step/service-provider` - Service provider details

### Products
- `GET /api/v1/products` - List products with filters
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/:id` - Get product details
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `POST /api/v1/products/:id/images` - Upload product images

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order details
- `GET /api/v1/orders/user` - Get user orders
- `PATCH /api/v1/orders/:id/status` - Update order status
- `POST /api/v1/orders/:id/cancel` - Cancel order

### Search
- `GET /api/v1/search` - Unified search
- `GET /api/v1/search/suggestions` - Search suggestions

### Admin
- `GET /api/v1/admin/stats` - Dashboard statistics
- `GET /api/v1/admin/users` - Manage users
- `GET /api/v1/admin/sellers` - Manage sellers
- `POST /api/v1/admin/verify-seller` - KYC verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/docs`

## 🔄 Changelog

### v1.0.0 (2024)
- Initial release
- Complete authentication system
- Multi-type seller onboarding
- Product and order management
- Admin dashboard
- File upload integration
- Search functionality