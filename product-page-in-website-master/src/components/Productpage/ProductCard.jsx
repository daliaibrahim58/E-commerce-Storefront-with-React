import { FaRegHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { VscPreview } from "react-icons/vsc";
export function ProductCard({ product, onAddToCart, onViewDetails }) {
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="relative overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
          )}
          {product.isSale && discountPercentage > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
          {product.isEcoFriendly && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Eco-Friendly
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1 rounded-md shadow-sm">
          <FaRegHeart className="text-gray-900 w-4 h-4" />
        </button>

        {/* Quick Add to Cart Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <button
            onClick={() => onViewDetails(product)}
            className="bg-white text-green-600 px-3 py-1 rounded flex items-center gap-2 hover:bg-gray-100"
          >
            <VscPreview className="text-xl text-green-600" /> View Details
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
          >
            <FaShoppingCart /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;