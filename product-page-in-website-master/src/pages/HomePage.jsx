import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
const HeroSection = () => {
  return (
    <div className="relative flex items-center justify-start min-h-screen bg-[#F0FAF0] p-4 sm:p-10 lg:p-20 overflow-hidden">
      
      <div className="max-w-xl z-10 relative">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-tight">
          <span className="text-black">Sustainable </span>
          <br />
          <span className="text-[#55A069]">Living Made </span>
          <br />
          <span className="text-black">Simple</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-md">
          Discover eco-friendly products that make a difference. From bamboo
          essentials to organic skincare, shop mindfully and reduce your
          environmental footprint.
        </p>

        <div className="mt-10 flex space-x-4">
          
          <Link 
            to="/products" 
            className="bg-[#55A069] hover:bg-[#438053] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 text-lg"
          >
            Shop Now
          </Link>
          
          <Link 
            to="/about" 
            className="border-2 border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-lg transition duration-300 text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="absolute inset-y-0 right-0 w-2/5 flex items-center justify-end z-0">
          <img
              src="https://images.unsplash.com/photo-1589365354848-78104c17f92d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRlySUyMHN1c3RhaW5hYmxlJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU5NzcwMzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Eco-friendly sustainable products"
              className="object-cover w-full h-full object-right-bottom"
          />
      </div>
    </div>
  );
};
const categories = [
  { name: 'Personal Care', productsCount: 24 },
  { name: 'Sustainable Fashion', productsCount: 18 },
  { name: 'Zero Waste Living', productsCount: 32 },
];

const CategoryCard = ({ name, productsCount }) => ( 
  <div 
    className="bg-gray-900 text-white p-8 flex flex-col justify-center items-center h-48 sm:h-64 rounded-xl transition duration-300 hover:bg-gray-700 shadow-xl cursor-default"
    onClick={(e) => {
    }}
  >
    <h3 className="text-2xl font-bold mb-2">{name}</h3>
    <p className="text-gray-400">{productsCount} products</p>
  </div>
);

const CategoriesSection = () => {
  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Shop by Category</h2>
      <p className="text-lg text-gray-600 mb-12">
        Find eco-friendly products for every aspect of your life
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
          <CategoryCard key={index} {...cat} />
        ))}
      </div>
    </section>
  );
};


const featured = [
  { 
    id: 1, 
    name: 'Bamboo Toothbrush Set (4 Pack)', 
    category: 'Personal Care', 
    price: 12.99, 
    oldPrice: 16.99, 
    discount: '24%', 
    rating: 4.5, 
    img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop", 
    description: "Sustainable bamboo toothbrush set with soft bristles."
  },
  { 
    id: 2, 
    name: 'Organic Lavender Body Cream', 
    category: 'Skincare', 
    price: 18.99, 
    oldPrice: 24.99, 
    discount: '24%', 
    isNew: true, 
    rating: 5, 
    img: "https://images.unsplash.com/photo-1629196870122-58e74a7b163f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Rich organic cream infused with natural lavender oil for deep skin hydration."
  },
  { 
    id: 3, 
    name: 'Sustainable Cotton T-Shirt', 
    category: 'Fashion', 
    price: 29.99, 
    oldPrice: 39.99, 
    discount: '25%', 
    rating: 4, 
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", 
    description: "Soft, durable T-shirt made from 100% organic cotton."
  },
  { 
    id: 4, 
    name: 'Zero Waste Starter Kit', 
    category: 'Lifestyle', 
    price: 39.99, 
    oldPrice: 49.99, 
    discount: '20%', 
    rating: 4.5, 
    img: "https://media.istockphoto.com/id/1326315145/photo/zero-waste-self-care-kit.jpg?s=1024x1024&w=is&k=20&c=RWURrgm8vUUwI5IJT_DDOrLmTmxY056rRIUpYJzqMLM=", 
    description: "A complete kit to kickstart your zero-waste journey."
  },
  { 
    id: 5, 
    name: 'Natural Plant-Based Soap', 
    category: 'Personal Care', 
    price: 6.99, 
    oldPrice: 8.99, 
    discount: '22%', 
    rating: 4.5, 
    img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop", 
    description: "Gentle plant-based soap bar, free from harsh chemicals and palm oil."
  },
  { 
    id: 6, 
    name: 'Reusable Water Bottle', 
    category: 'Home & Garden', 
    price: 19.99, 
    oldPrice: 24.99, 
    discount: '20%', 
    rating: 4.5, 
    img: "https://images.unsplash.com/photo-1587302108992-20648821725d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    description: "Durable stainless steel bottle keeps drinks cold for 24 hours."
  },
  { 
    id: 7, 
    name: 'Organic Hemp Backpack', 
    category: 'Fashion', 
    price: 64.99, 
    oldPrice: 79.99, 
    discount: '19%', 
    isNew: true, 
    rating: 4.5, 
    img: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop", 
    description: "Stylish and robust backpack made from 100% sustainable hemp fabric."
  },
  { 
    id: 8, 
    name: 'Beeswax Food Wraps Set', 
    category: 'Kitchen', 
    price: 13.99, 
    oldPrice: 16.99, 
    discount: '18%', 
    rating: 4.5, 
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", 
    description: "Natural alternative to plastic wrap. Keeps food fresh and is reusable and biodegradable."
  },
];


const ProductCard = ({ name, category, price, oldPrice, discount, rating, img, isNew, id, onAddToCart }) => { 
    const isEcoFriendly = discount || isNew || category.includes('Sustainable') || name.includes('Organic') || name.includes('Plant-Based') || name.includes('Zero Waste') || name.includes('Bamboo') || name.includes('Reusable'); 

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-shadow duration-300 hover:shadow-xl group"> 
        <div className="relative">
          <img src={img} alt={name} className="w-full h-72 object-cover" />
          
          {}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {isEcoFriendly && (
              <span className="bg-[#55A069] text-white text-xs font-medium px-3 py-1 rounded-full">Eco-Friendly</span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">-{discount}</span>
            )}
            {isNew && (
              <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">New</span>
            )}
          </div>
          
          {/* زر Add to Cart كـ Overlay يظهر عند الـ Hover */}
          <button 
              onClick={() => onAddToCart(id)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 
                         text-white text-lg font-bold
                         opacity-0 invisible transition-all duration-300 
                         group-hover:opacity-100 group-hover:visible"
          >
            <ShoppingCart size={24} className="mr-2"/>
            Add to Cart
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < rating ? '#F59E0B' : 'none'} stroke="#F59E0B" className="mr-0.5"/>
            ))}
            <span className="text-xs text-gray-500 ml-1">({rating * 20})</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 truncate" title={name}>{name}</h3>
          <p className="text-sm text-gray-500 mb-3">{category}</p>

          <div className="flex justify-between items-center">
            {/* عرض السعر */}
            <div className="text-lg font-semibold text-gray-900">
              ${price.toFixed(2)}
              {oldPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">${oldPrice.toFixed(2)}</span>
              )}
            </div>
            
            {/* زر السلة الثابت في الأسفل */}
            <button 
              onClick={() => onAddToCart(id)}
              className="bg-[#55A069] text-white p-2 rounded-full hover:bg-[#438053] transition duration-200 shadow-md"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    );
};

// ==========================================================
// 5. مكون FeaturedProducts
// (بدون تغيير)
// ==========================================================
const FeaturedProducts = ({ onAddToCart }) => {
  const discountedProducts = featured.filter(product => product.discount);
  const productsToShow = discountedProducts.slice(0, 8);

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 text-center bg-gray-50">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Flash Sale Deals</h2>
      <p className="text-lg text-gray-600 mb-12">
        Don't miss our limited-time discounts on our top sustainable picks.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {productsToShow.map((product) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>
    </section>
  );
};


const HomePage = () => {
  // حالة عربة التسوق (محتفظ بها بالرغم من عدم عرضها)
  const [cartCount, setCartCount] = useState(0); 

  // دالة الإضافة إلى السلة (محتفظ بها)
  const addToCart = useCallback((productId) => {
    setCartCount(prevCount => prevCount + 1);
    console.log(`Product ${productId} added to cart. Total items: ${cartCount + 1}`);
  }, []);

  return (
    <div className="home-page-container">
      {}
      
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts onAddToCart={addToCart} /> 
      
    </div>
  );
};

export default HomePage;
