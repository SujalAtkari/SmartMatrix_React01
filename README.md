# E-Commerce Platform

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Features include user authentication, product management, shopping cart, checkout with PayPal integration, and an admin dashboard.

## 🚀 Features

### User Features
- ✅ User Registration & Login
- ✅ Product Browsing with Filters (Size, Color, Gender, Price, Category)
- ✅ Product Search
- ✅ Shopping Cart (Guest & Authenticated Users)
- ✅ Checkout with PayPal Payment
- ✅ Order History & Order Details
- ✅ User Profile Management

### Admin Features
- ✅ Admin Dashboard with Statistics
- ✅ User Management (Create, Read, Update, Delete)
- ✅ Product Management (Create, Read, Update, Delete)
- ✅ Product Image Upload (Cloudinary)
- ✅ Order Management (View & Update Order Status)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "react website"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows: copy .env.example .env
# Linux/Mac: cp .env.example .env

# Edit .env file with your configuration:
# - MONGO_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - CLOUDINARY credentials (for image uploads)

# Seed the database with sample data
npm run seed

# Start the backend server
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend2

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows: copy .env.example .env
# Linux/Mac: cp .env.example .env

# Edit .env file:
# - VITE_BACKEND_URL: http://localhost:5000
# - VITE_PAYPAL_CLIENT_ID: Your PayPal Client ID

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 🔐 Default Admin Credentials

After running the seeder, you can login with:

- **Email:** `admin@example.com`
- **Password:** `123456`

## 📁 Project Structure

```
react website/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── data/
│   │   └── products.js           # Sample products data
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Checkout.js
│   │   └── Subscriber.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── checkoutRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── productAdminRoutes.js
│   │   ├── adminOrderRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── subscribeRoute.js
│   ├── server.js                 # Express server
│   ├── seeder.js                 # Database seeder
│   └── package.json
│
└── frontend2/
    ├── src/
    │   ├── components/
    │   │   ├── Admin/            # Admin components
    │   │   ├── Cart/              # Cart & Checkout
    │   │   ├── Common/             # Header, Footer, Navbar
    │   │   ├── Layout/            # Layout components
    │   │   └── Products/          # Product components
    │   ├── pages/                 # Page components
    │   ├── redux/
    │   │   ├── slices/            # Redux slices
    │   │   └── store.js           # Redux store
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🔧 Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## 🎯 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/similar/:id` - Get similar products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/best-seller` - Get best seller products

### Cart
- `GET /api/cart` - Get cart (query: userId or guestId)
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart
- `POST /api/cart/merge` - Merge guest cart to user cart (Protected)

### Checkout & Orders
- `POST /api/checkout` - Create checkout (Protected)
- `PUT /api/checkout/:id/pay` - Mark checkout as paid (Protected)
- `POST /api/checkout/:id/finalize` - Finalize checkout (Protected)
- `GET /api/orders/my-orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `POST /api/admin/users` - Create user (Admin)
- `PUT /api/admin/users/:id` - Update user (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/products` - Get all products (Admin)
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)
- `DELETE /api/admin/products/:id` - Delete product (Admin)
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/admin/orders/:id` - Update order status (Admin)
- `DELETE /api/admin/orders/:id` - Delete order (Admin)

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## 🛒 Shopping Flow

1. **Browse Products** - Users can browse products with filters
2. **Add to Cart** - Add products to cart (works for guests too)
3. **Checkout** - Fill shipping address
4. **Payment** - Pay with PayPal
5. **Order Confirmation** - View order confirmation
6. **Order History** - View all past orders

## 👨‍💼 Admin Flow

1. **Login as Admin** - Use admin credentials
2. **Dashboard** - View statistics
3. **Manage Users** - Create, edit, delete users
4. **Manage Products** - Create, edit, delete products
5. **Manage Orders** - View and update order status

## 🧪 Testing

### Test User Flow
1. Register a new user
2. Browse products
3. Add items to cart
4. Proceed to checkout
5. Complete payment
6. View order confirmation

### Test Admin Flow
1. Login as admin (`admin@example.com` / `123456`)
2. Navigate to `/admin`
3. Test user management
4. Test product management
5. Test order management

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Check your MONGO_URI in .env
- **Port Already in Use**: Change PORT in .env or kill the process using port 5000
- **JWT Error**: Make sure JWT_SECRET is set in .env

### Frontend Issues
- **API Connection Error**: Check VITE_BACKEND_URL in .env matches backend URL
- **PayPal Not Loading**: Check VITE_PAYPAL_CLIENT_ID is set correctly
- **CORS Error**: Make sure backend CORS is configured (already done in server.js)

### Common Issues
- **Module Not Found**: Run `npm install` in both backend and frontend
- **Environment Variables Not Loading**: Restart the server after changing .env
- **Images Not Uploading**: Check Cloudinary credentials in backend .env

## 📦 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- Cloudinary
- Multer

### Frontend
- React 19
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- PayPal React SDK
- Axios
- Sonner (Toast notifications)

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.

---

**Happy Coding! 🚀**


