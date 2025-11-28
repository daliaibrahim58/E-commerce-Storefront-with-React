const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

// Sample Products
const sampleProducts = [
    {
        name: "Eco Water Bottle",
        price: 25,
        originalPrice: 35,
        category: "Bottles",
        description: "Sustainable stainless steel water bottle",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        stock: 50,
        rating: 4.5,
        reviews: 120,
        tags: ["30% OFF", "Eco-Friendly"],
        features: ["Eco-Friendly", "Sustainable", "BPA-Free"],
        isEcoFriendly: true,
        isNew: false,
        isSale: true,
        inStock: true
    },
    {
        name: "Bamboo Toothbrush Set",
        price: 15,
        originalPrice: 15,
        category: "Personal Care",
        description: "Set of 4 biodegradable bamboo toothbrushes",
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400",
        stock: 100,
        rating: 4.8,
        reviews: 85,
        tags: ["New Arrival", "Eco-Friendly"],
        features: ["Eco-Friendly", "Biodegradable", "Vegan"],
        isEcoFriendly: true,
        isNew: true,
        isSale: false,
        inStock: true
    },
    {
        name: "Organic Cotton Tote Bag",
        price: 20,
        originalPrice: 30,
        category: "Bags",
        description: "Reusable organic cotton shopping bag",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
        stock: 75,
        rating: 4.3,
        reviews: 60,
        tags: ["33% OFF"],
        features: ["Eco-Friendly", "Organic", "Reusable"],
        isEcoFriendly: true,
        isNew: false,
        isSale: true,
        inStock: true
    },
    {
        name: "Solar Power Bank",
        price: 45,
        originalPrice: 45,
        category: "Electronics",
        description: "Portable solar-powered charger",
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
        stock: 30,
        rating: 4.6,
        reviews: 95,
        tags: ["New Arrival"],
        features: ["Solar Powered", "Portable", "Fast Charging"],
        isEcoFriendly: true,
        isNew: true,
        isSale: false,
        inStock: true
    },
    {
        name: "Reusable Food Wraps",
        price: 18,
        originalPrice: 25,
        category: "Kitchen",
        description: "Beeswax food wraps - pack of 5",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
        stock: 60,
        rating: 4.4,
        reviews: 70,
        tags: ["28% OFF", "Eco-Friendly"],
        features: ["Eco-Friendly", "Reusable", "Natural"],
        isEcoFriendly: true,
        isNew: false,
        isSale: true,
        inStock: true
    }
];

// Sample Users
const sampleUsers = [
    {
        userName: "Admin User",
        email: "admin@shop.com",
        password: "admin123",
        role: "admin",
        phone: "+1234567890"
    },
    {
        userName: "John Doe",
        email: "john@example.com",
        password: "user123",
        role: "user",
        phone: "+1234567891"
    },
    {
        userName: "Jane Smith",
        email: "jane@example.com",
        password: "user123",
        role: "user",
        phone: "+1234567892"
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        try {
            // Clear existing data
            await Product.deleteMany({});
            await User.deleteMany({});
            await Order.deleteMany({});
            console.log('🗑️  Cleared existing data');

            // Insert products
            await Product.insertMany(sampleProducts);
            console.log('✅ Added sample products');

            // Insert users with hashed passwords
            for (const user of sampleUsers) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.create({
                    ...user,
                    password: hashedPassword
                });
            }
            console.log('✅ Added sample users');

            console.log('\n🎉 Database seeded successfully!');
            console.log('\n📝 Login credentials:');
            console.log('Admin: admin@shop.com / admin123');
            console.log('User: john@example.com / user123');

            process.exit(0);
        } catch (error) {
            console.error('❌ Error seeding database:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
