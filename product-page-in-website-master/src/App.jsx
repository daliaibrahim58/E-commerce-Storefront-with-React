import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import DetailsProductsPage from "./pages/DetailsProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

const mockProducts = [
  {
    "id": "1",
    "name": "Bamboo Toothbrush Set (4 Pack)",
    "category": "Personal Care",
    "rating": 4,
    "reviews": 128,
    "tags": ["-24%", "Eco-Friendly"],
    "originalPrice": 16.99,
    "price": 12.99,
    "salePrice": 12.99,
    "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    "description": "Sustainable bamboo toothbrush set with soft bristles. Perfect for eco-conscious oral care routine. Made from 100% biodegradable materials.",
    "features": ["100% Biodegradable", "Soft Bristles", "4-Pack Set", "Eco-Friendly Packaging"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "2",
    "name": "Organic Lavender Body Cream",
    "category": "Personal Care",
    "rating": 4,
    "reviews": 94,
    "tags": ["Featured", "Eco-Friendly"],
    "originalPrice": 24.99,
    "price": 19.99,
    "salePrice": 19.99,
    "image": "https://images.unsplash.com/photo-1629196870122-58e74a7b163f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "description": "Nourishing organic body cream with lavender essential oil. Hydrates and relaxes your skin naturally without harmful chemicals.",
    "features": ["100% Organic", "Lavender Scent", "Cruelty-Free", "Vegan Formula"],
    "isEcoFriendly": true,
    "inStock": true,
    "isNew": true
  },
  {
    "id": "3",
    "name": "Sustainable Cotton T-Shirt",
    "category": "Fashion",
    "rating": 4,
    "reviews": 76,
    "tags": ["-23%", "Eco-Friendly"],
    "originalPrice": 38.99,
    "price": 29.99,
    "salePrice": 29.99,
    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    "description": "100% organic cotton t-shirt made with sustainable practices. Comfortable, durable, and environmentally friendly.",
    "features": ["100% Organic Cotton", "Fair Trade", "Machine Washable", "Multiple Colors"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "4",
    "name": "Zero Waste Starter Kit",
    "category": "Lifestyle",
    "rating": 4,
    "reviews": 203,
    "tags": ["Eco-Friendly"],
    "originalPrice": 54.99,
    "price": 49.99,
    "salePrice": 49.99,
    "image": "https://media.istockphoto.com/id/1326315145/photo/zero-waste-self-care-kit.jpg?s=1024x1024&w=is&k=20&c=RWURrgm8vUUwI5IJT_DDOrLmTmxY056rRIUpYJzqMLM=",
    "description": "Complete kit to start your zero waste journey. Includes reusable items for everyday use to reduce plastic waste.",
    "features": ["8 Essential Items", "Reusable Materials", "Starter Guide", "Eco-Friendly"],
    "isEcoFriendly": true,
    "inStock": true,
    "isNew": true
  },
  {
    "id": "5",
    "name": "Reusable Coffee Cup",
    "category": "Lifestyle",
    "rating": 5,
    "reviews": 156,
    "tags": ["-15%", "Best Seller"],
    "originalPrice": 22.99,
    "price": 18.99,
    "salePrice": 18.99,
    "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
    "description": "Insulated reusable coffee cup made from sustainable materials. Keep your drinks hot or cold for hours.",
    "features": ["Heat Insulated", "Leak-Proof", "Eco-Friendly", "Multiple Sizes"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "6",
    "name": "Bamboo Cutting Board",
    "category": "Kitchen",
    "rating": 4,
    "reviews": 89,
    "tags": ["New", "Eco-Friendly"],
    "originalPrice": 39.99,
    "price": 34.99,
    "salePrice": 34.99,
    "image": "https://images.unsplash.com/photo-1587302108992-20648821725d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "description": "Durable bamboo cutting board with natural antimicrobial properties. Perfect for food preparation.",
    "features": ["Natural Antimicrobial", "Durable", "Easy to Clean", "Eco-Friendly"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "7",
    "name": "Organic Face Serum",
    "category": "Skincare",
    "rating": 4,
    "reviews": 203,
    "tags": ["-30%", "Featured"],
    "originalPrice": 39.99,
    "price": 27.99,
    "salePrice": 27.99,
    "image": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop",
    "description": "Organic face serum with natural ingredients. Rejuvenates and hydrates your skin effectively.",
    "features": ["100% Natural", "Hydrating", "Anti-Aging", "Vegan Formula"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "8",
    "name": "Hemp Shopping Bag",
    "category": "Fashion",
    "rating": 4,
    "reviews": 67,
    "tags": ["Eco-Friendly"],
    "originalPrice": 17.99,
    "price": 14.99,
    "salePrice": 14.99,
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    "description": "Durable hemp shopping bag with ample space. Strong, reusable, and environmentally friendly.",
    "features": ["Durable Hemp", "Large Capacity", "Washable", "Eco-Friendly"],
    "isEcoFriendly": true,
    "inStock": true
  },
  {
    "id": "9",
    "name": "Natural Shampoo Bar",
    "category": "Personal Care",
    "rating": 5,
    "reviews": 89,
    "tags": ["-15%", "Eco-Friendly"],
    "originalPrice": 14.99,
    "price": 12.74,
    "salePrice": 12.74,
    "image": "https://media.istockphoto.com/id/1400644287/photo/set-of-dispenser-bottles-for-soap-and-shampoo-shampoo-bottle-without-logo.jpg?s=1024x1024&w=is&k=20&c=bQgdKS0QyFqo2sq7mw1g1C_XJBVLY9xoRgtv8OM3PGo=",
    "description": "Natural shampoo bar with essential oils for healthy hair.",
    "features": ["100% Natural", "Zero Waste", "For All Hair Types"],
    "isEcoFriendly": true,
    "inStock": true
  },
  {
    "id": "10",
    "name": "Canvas Backpack",
    "category": "Fashion",
    "rating": 4,
    "reviews": 203,
    "tags": ["New", "Eco-Friendly"],
    "originalPrice": 45.99,
    "price": 39.99,
    "salePrice": 39.99,
    "image": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "description": "Durable canvas backpack with multiple compartments.",
    "features": ["Water Resistant", "Laptop Sleeve", "Multiple Pockets"],
    "isEcoFriendly": true,
    "inStock": true
  },
  {
    "id": "11",
    "name": "Ceramic Cookware Set",
    "category": "Kitchen",
    "rating": 5,
    "reviews": 156,
    "tags": ["-30%", "Featured"],
    "originalPrice": 89.99,
    "price": 62.99,
    "salePrice": 62.99,
    "image": "https://media.istockphoto.com/id/1467775459/photo/blank-empty-space-on-modern-beige-kitchen-countertop-with-luxury-ceramic-kitchenware-and.jpg?s=1024x1024&w=is&k=20&c=QCWWI9S_5R-2I33QLOnt7CXvlI-uBB891ib8LvEUkck=",
    "description": "Non-toxic ceramic cookware set for healthy cooking.",
    "features": ["Non-Toxic", "Easy to Clean", "5-Piece Set"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "12",
    "name": "Bamboo Straw Set",
    "category": "Lifestyle",
    "rating": 4,
    "reviews": 178,
    "tags": ["-20%", "Eco-Friendly"],
    "originalPrice": 12.99,
    "price": 10.39,
    "salePrice": 10.39,
    "image": "https://plus.unsplash.com/premium_photo-1736505437580-7d2dfc89994e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "description": "Reusable bamboo straws with cleaning brush.",
    "features": ["Reusable", "Natural Material", "Cleaning Brush Included"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "13",
    "name": "Organic Lip Balm",
    "category": "Skincare",
    "rating": 5,
    "reviews": 234,
    "tags": ["Best Seller", "Eco-Friendly"],
    "originalPrice": 8.99,
    "price": 7.99,
    "salePrice": 7.99,
    "image": "https://images.unsplash.com/photo-1604954617254-b5c78a97f01d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "description": "Organic lip balm with shea butter and coconut oil.",
    "features": ["100% Organic", "Moisturizing", "Vegan Formula"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "14",
    "name": "Wooden Phone Case",
    "category": "Lifestyle",
    "rating": 4,
    "reviews": 95,
    "tags": ["New", "Eco-Friendly"],
    "originalPrice": 29.99,
    "price": 24.99,
    "salePrice": 24.99,
    "image": "https://images.unsplash.com/photo-1678276295898-a4b21faf43cd?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "description": "Sustainable wooden phone case with natural finish.",
    "features": ["Eco-Friendly Wood", "Protective", "Lightweight"],
    "isEcoFriendly": true,
    "inStock": true,
    "isNew": true
  },
  {
    "id": "15",
    "name": "Herbal Tea Collection",
    "category": "Lifestyle",
    "rating": 5,
    "reviews": 167,
    "tags": ["-25%", "Featured"],
    "originalPrice": 34.99,
    "price": 26.24,
    "salePrice": 26.24,
    "image": "https://images.unsplash.com/photo-1727291609993-9bae34fd6f36?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "description": "Organic herbal tea collection in biodegradable packaging.",
    "features": ["100% Organic", "6 Flavors", "Biodegradable Packaging"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
  {
    "id": "16",
    "name": "Cork Yoga Mat",
    "category": "Lifestyle",
    "rating": 5,
    "reviews": 142,
    "tags": ["-10%", "Eco-Friendly"],
    "originalPrice": 49.99,
    "price": 44.99,
    "salePrice": 44.99,
    "image": "https://media.istockphoto.com/id/1197151982/photo/healthy-and-muscular-young-man-in-a-public-park.jpg?s=1024x1024&w=is&k=20&c=IJfrm-QxutyaLxpQEJcKKCHJK_gWzJpkAP7CD6N7l6M=",
    "description": "Natural cork yoga mat with excellent grip.",
    "features": ["Natural Cork", "Non-Slip", "Easy to Clean"],
    "isEcoFriendly": true,
    "inStock": true,
    "isSale": true
  },
];


const App = () => {
  // const [cartItems, setCartItems] = useState([]);
  // const [isCartOpen, setIsCartOpen] = useState(false);
  const onViewDetails =(product) =>{
    alert(`Viewing details for ${product.name}`)
  }
  const addToCart = (product) => {
    // setCartItems(prev => {
    //   const existingItem = prev.find(item => item.id === product.id);
    //   if (existingItem) {
    //     return prev.map(item =>
    //       item.id === product.id
    //         ? { ...item, quantity: item.quantity + 1 }
    //         : item
    //     );
    //   }
    //   return [...prev, { ...product, quantity: 1 }];
    // });
    alert(`Added ${product.name} to cart`);
  };

  //   const updateQuantity = (id, quantity) => {
  //   if (quantity === 0) {
  //     removeFromCart(id);
  //     return;
  //   }
  //   setCartItems(prev =>
  //     prev.map(item =>
  //       item.id === id ? { ...item, quantity } : item
  //     )
  //   );
  // };

  // const removeFromCart = (id) => {
  //   setCartItems(prev => prev.filter(item => item.id !== id));
  // };

  // const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={<ProductsPage products={mockProducts} onAddToCart={addToCart} onViewDetails={onViewDetails} />}
        />
        <Route path="/Details" element={<DetailsProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
            {/* <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      /> */}
    </>
  );
};

export default App;
