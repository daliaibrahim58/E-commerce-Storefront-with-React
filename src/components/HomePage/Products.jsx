import Details from "../Productpage/Detials";
import ProductCard from "../Productpage/ProductCard";
import { TfiFilter } from "react-icons/tfi";

const Products = ({ 
  products = [], 
  handleAddToCart, 
  loadingProducts,
  onViewDetails,
  onCloseDetails, 
  selectedProduct 
}) => {
  if (loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
          Loading products...
        </div>
      </div>
    );
  }

  const discountedProducts = products.filter(
    (product) => 
      product.isSale === true || 
      (product.tags && product.tags.some(tag => tag.includes("%")))
  );

  const sortedDiscountedProducts = discountedProducts.sort(
    (a, b) => Number(b.id) - Number(a.id)
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-8">
        <div className="my-8 flex justify-center items-center flex-col">
          <div className="text-center">
            <h2 className=" font-semibold text-gray-900 mb-8 text-3xl sm:text-4xl md:text-5xl">
              Featured Products
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-loose  md:text-xl">
              Discover our carefully curated selection of sustainable products that help you live more consciously.
            </p>
          </div>
        </div>
        
        {/* Details Modal */}
         <Details
          selectedProduct={selectedProduct}
          onCloseDetails={onCloseDetails}
          handleAddToCart={handleAddToCart}
        />
        
         {/* Products Area */}
         {products.length === 0 ? (
          <div className="text-center py-12">
            <TfiFilter className="text-gray-400 mx-auto mb-4 text-4xl" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedDiscountedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                handleAddToCart={() => handleAddToCart(product)} 
                onViewDetails={onViewDetails} 
              />
            ))}
          </div>
        )}
      </div>
  );
};

export default Products;