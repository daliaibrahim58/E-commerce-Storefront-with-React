import Detials from "../components/Productpage/Detials";
import HeroSection from "../components/HomePage/HeroSection";
import CategoriesSection from "../components/HomePage/CategoriesSection";
import Products from "../components/HomePage/Products.jsx";

const HomePage = ({ products = [], loadingProducts, handleAddToCart, onViewDetails,onCloseDetails, selectedProduct })=> {
  return (
     <div className="home-page-container">
     <HeroSection />
    <CategoriesSection />
    <Products
      products={products}
      handleAddToCart={handleAddToCart}
      loadingProducts={loadingProducts}
      onViewDetails={onViewDetails}
      selectedProduct={selectedProduct}
      onCloseDetails={onCloseDetails}
    />
    </div>
  );
};

export default HomePage;
