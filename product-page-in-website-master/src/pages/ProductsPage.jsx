import { useState } from "react";
import { TfiViewListAlt,TfiFilter} from "react-icons/tfi";
import { MdViewModule } from "react-icons/md";
import { ProductCard } from "../components/Productpage/ProductCard";
import CustomSelect from "../components/Productpage/CustomSelect";
import SortSelect from "../components/Productpage/SortSelect";

export function ProductsPage({ products = [] , onAddToCart, onViewDetails }) {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("all");

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length && !selectedCategories.includes(product.category)) {
      return false;
    }
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max && (product.price < min || product.price > max)) return false;
      if (!max && product.price < min) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return a.isNew ? -1 : b.isNew ? 1 : 0;
      default: return 0;
    }
  });



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover our complete collection of sustainable and eco-friendly products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
          <div className="bg-white shadow rounded-xl p-6 space-y-6">
            <h3 className="font-semibold text-lg">Filters</h3>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="font-medium mb-2">Categories</h4>
              {categories.map((cat) => (
                <label key={cat} htmlFor={cat} className="flex items-center space-x-2 text-md  text-gray-800">
                  <input
                    id={cat}
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                      else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                    }}
                    className="peer accent-green-600 scale-110 checked:scale-95 transition-transform"
                  />

                  <span className="peer-checked:text-sm peer-checked:text-gray-500 transition-all">
                    {cat}
                  </span>
                </label>

              ))}
            </div>

            {/* Price Range */}

              <div className="mb-6 w-full">
              <h4 className="font-medium mb-2">Price Range</h4>

              <CustomSelect
                value={priceRange}
                onChange={(val) => setPriceRange(val)}
              />
            </div>


            {/* Clear Filters */}
            <button
              className="w-full py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange("all");
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Products Area */}
        <div className="flex-1 flex flex-col space-y-4">
          {/* Toolbar */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{sortedProducts.length} products found</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {filteredProducts.filter(p => p.isEcoFriendly).length} Eco-Friendly
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <SortSelect sortBy={sortBy} setSortBy={setSortBy} />


              <button
                className={`p-2 rounded-xl ${viewMode === "grid" ? "bg-green-600 text-white" : "border border-gray-300"}`}
                onClick={() => setViewMode("grid")}
              >
                <MdViewModule />
              </button>
              <button
                className={`p-2 rounded-xl ${viewMode === "list" ? "bg-green-600 text-white" : "border border-gray-300"}`}
                onClick={() => setViewMode("list")}
              >
                <TfiViewListAlt />
              </button>
            </div>
          </div>

          {/* Products Display */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <TfiFilter className="text-gray-400 mx-auto mb-4 text-4xl" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => onAddToCart(product)} onViewDetails={() => onViewDetails(product)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => onAddToCart(product)} onViewDetails={() => onViewDetails(product)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
