import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Default state for a new product
  const initialProductState = {
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    image: "",
    description: "",
    isEcoFriendly: false,
    isNew: false,
    // Defaults for fields without inputs
    rating: 0,
    reviews: 0,
    tags: [],
    features: [],
    salePrice: "",
    isSale: false,
  };

  const [currentProduct, setCurrentProduct] = useState(initialProductState);

  const API_URL = "https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/items";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentProduct(initialProductState);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    // Ensure all fields exist when editing
    setCurrentProduct({
      ...initialProductState,
      ...product,
      // Ensure booleans are booleans
      isEcoFriendly: !!product.isEcoFriendly,
      isNew: !!product.isNew,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const price = parseFloat(currentProduct.price);
      const originalPrice = parseFloat(currentProduct.originalPrice) || price;
      const stock = parseInt(currentProduct.stock) || 0;
      const isSale = originalPrice > price;

      // Generate tags based on attributes
      const tags = [];
      if (currentProduct.isNew) tags.push("New");
      if (currentProduct.isEcoFriendly) tags.push("Eco-Friendly");
      if (isSale) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        tags.push(`-${discount}%`);
      }

      const productToSend = {
        ...currentProduct,
        price,
        originalPrice,
        stock,
        salePrice: price, // Sync salePrice with price
        isSale,
        tags,
        // Ensure defaults for other fields
        rating: currentProduct.rating || 0,
        reviews: currentProduct.reviews || 0,
        features: currentProduct.features || [],
      };

      if (isEditing) {
        await axios.put(`${API_URL}/${currentProduct.id}`, productToSend);
        setProducts(
          products.map((p) => (p.id === currentProduct.id ? { ...productToSend, id: currentProduct.id } : p))
        );
      } else {
        const res = await axios.post(API_URL, productToSend);
        setProducts([...products, res.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Products Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Image</th>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Category</th>
              <th className="p-4 border-b">Stock</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="p-4 border-b font-medium">{product.name}</td>
                <td className="p-4 border-b">
                  <div className="flex flex-col">
                    <span>${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 border-b">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {product.category || "General"}
                  </span>
                </td>
                <td className="p-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      (product.stock || 0) > 5
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock || 0} In Stock
                  </span>
                </td>
                <td className="p-4 border-b text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEditing ? "Edit Product" : "Add Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={currentProduct.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Original Price
                  </label>
                  <input
                    type="text"
                    name="originalPrice"
                    value={currentProduct.originalPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    placeholder="Optional"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={currentProduct.stock}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={currentProduct.image}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                />
              </div>

              <div className="mb-4 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isEcoFriendly"
                    checked={currentProduct.isEcoFriendly}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm font-bold">Eco-Friendly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={currentProduct.isNew}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm font-bold">New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
