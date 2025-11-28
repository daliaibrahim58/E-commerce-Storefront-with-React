# Shopping Backend API

Backend server for Shopping Application built with Node.js, Express, and MongoDB.

## 🚀 Features

- RESTful API for Products, Users, and Orders
- MongoDB database with Mongoose ODM
- User authentication with bcrypt
- CORS enabled for frontend integration
- Environment variables configuration
- Complete CRUD operations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend folder with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping-db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start MongoDB (if using local):
```bash
mongod
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Products (`/items`)
- `GET /items` - Get all products
- `GET /items/:id` - Get single product
- `POST /items` - Create new product
- `PUT /items/:id` - Update product
- `DELETE /items/:id` - Delete product

### Users (`/users`)
- `GET /users` - Get all users
- `GET /users/:id` - Get single user
- `POST /users` - Create new user (signup)
- `POST /users/login` - User login
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Orders (`/orders`)
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get single order
- `GET /orders/customer/:customerName` - Get orders by customer
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

## 🗂️ Project Structure

```
backend/
├── models/
│   ├── Product.js
│   ├── User.js
│   └── Order.js
├── routes/
│   ├── products.js
│   ├── users.js
│   └── orders.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## 🔧 Configuration

Update the frontend API URL in:
`frontend/src/api/config.js`

```javascript
const BASE_URL = "http://localhost:5000";
```

## 📝 Example Requests

### Create Product
```json
POST /items
{
  "name": "Eco Water Bottle",
  "price": 25,
  "category": "Bottles",
  "description": "Sustainable water bottle",
  "image": "https://example.com/image.jpg",
  "stock": 50,
  "isEcoFriendly": true,
  "inStock": true
}
```

### Create Order
```json
POST /orders
{
  "customer": "John Doe",
  "items": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 25,
      "quantity": 2
    }
  ],
  "total": 50,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  }
}
```

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Make sure MongoDB is running
- **Port already in use**: Change PORT in `.env` file
- **CORS Error**: Check CORS configuration in `server.js`

## 📄 License

ISC
