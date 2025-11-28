# 🚀 Quick Start Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Install MongoDB
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

### 3. Start MongoDB
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### 4. Seed Database (Optional)
```bash
npm run seed
```
This will create:
- Sample products
- Admin user: `admin@shop.com` / `admin123`
- Test user: `john@example.com` / `user123`

### 5. Start Backend Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd ..
npm install
```

### 2. Update API URL
The `.env` file is already configured to use local backend:
```
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start Frontend
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## ✅ Verification

1. Open browser: `http://localhost:5173`
2. Login with: `admin@shop.com` / `admin123`
3. Check products are loading
4. Test creating/editing products in dashboard

## 🔧 Troubleshooting

### MongoDB not starting
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: Start MongoDB service from Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port already in use
Change port in `backend/.env`:
```
PORT=5001
```

### CORS errors
Make sure backend is running and frontend .env points to correct URL

## 📁 Project Structure
```
shopping/
├── backend/              # Node.js + Express + MongoDB
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Main server file
│   ├── seed.js          # Sample data
│   └── .env             # Environment variables
│
├── src/                 # React frontend
│   ├── api/            # API configuration
│   ├── components/     # React components
│   ├── pages/          # Page components
│   └── App.jsx         # Main app
│
└── .env                # Frontend environment variables
```

## 🎯 Next Steps

1. ✅ Start MongoDB
2. ✅ Run `npm run seed` in backend
3. ✅ Run `npm run dev` in backend
4. ✅ Run `npm run dev` in frontend (root)
5. ✅ Login and test the application

Enjoy! 🎉
