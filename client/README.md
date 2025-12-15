# E-commerce Storefront with React.js

This is a **full-stack e-commerce project** built with **React.js** for the frontend and **Node.js + Express + MongoDB** for the backend.  
The application allows users to register, login, browse products, manage orders, and for admins to manage products and users.

---

## Features

### User (Client)
- Register and login
- View all products and product details
- Add products to cart
- Place orders
- Rate orders
- View order history

### Admin
- Register and login
- Access admin dashboard
- Create, update, and delete products
- Manage orders (update status, delete orders)
- View and manage users

---

## Backend Routes

### Product Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET    | `/api/products` | Public | Get all products |
| GET    | `/api/products/:id` | Public | Get single product by ID |
| POST   | `/api/products` | Admin | Create new product |
| PUT    | `/api/products/:id` | Admin | Update existing product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Order Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST   | `/api/orders` | Client | Create a new order |
| GET    | `/api/orders` | Authenticated | Admin sees all, Client sees own orders |
| GET    | `/api/orders/:id` | Authenticated | Get order by ID |
| PUT    | `/api/orders/:id/status` | Admin | Update order status |
| DELETE | `/api/orders/:id` | Admin / Owner | Delete or cancel an order |
| POST   | `/api/orders/:id/rate` | Client | Rate an order |

### User Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET    | `/api/users/me` | Authenticated | Get current user profile |
| GET    | `/api/users` | Admin | Get all users |
| GET    | `/api/users/:id` | Authenticated | Get user by ID |
| PUT    | `/api/users/:id` | Authenticated | Update user info |
| DELETE | `/api/users/:id` | Admin | Delete user |

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST   | `/api/auth/register` | Public | Register as client |
| POST   | `/api/auth/register-admin` | Public | Register as admin (initial setup) |
| POST   | `/api/auth/login` | Public | Login as client or admin |

---

## Frontend
- Built with **React.js**
- Users can browse products, add to cart, and place orders
- Admin dashboard to manage products, orders, and users
- Responsive design

---

## Technologies Used
- Frontend: React.js, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Validation: express-validator
- Version Control: Git & GitHub

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/daliaibrahim58/E-commerce-Storefront-with-React.git
cd E-commerce-Storefront-with-React
