import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Overview from "./pages/dashboard/Overview";
import Users from "./pages/dashboard/Users";
import Products from "./pages/dashboard/Products";
import Orders from "./pages/dashboard/Orders";
import ErrorBoundary from "./components/ErrorBoundary";
import Notfound from "./pages/Notfound";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import OrdersPage from "./pages/OrdersPage";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "@material-tailwind/react";
import { API_URLS } from "./api/config";
export const AuthContext = createContext();

// Set axios Authorization header synchronously at module load if token exists.
// This ensures requests fired during initial render/effects include the token.
try {
  const _token = localStorage.getItem("token");
  if (_token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${_token}`;
  }
} catch (err) {
  // ignore (localStorage may be unavailable during some environments)
}

const App = () => {
  // Alert state
  const [alertMessage, setAlertMessage] = useState("");
  //  Load stored user safely
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("Error parsing stored user:", err);
      return null;
    }
  })();

  // Auth state
  const [auth, setAuth] = useState({
    isLoggedIn: storedUser ? true : false,
    role: storedUser?.role || "",
    userName: storedUser?.userName || "",
  });

  // Persist auth state from localStorage on app load
  useEffect(() => {
    const storedUserRaw = localStorage.getItem("user");
    if (storedUserRaw) {
      const user = JSON.parse(storedUserRaw);
      setAuth({
        isLoggedIn: true,
        role: user.role,
        userName: user.userName || "",
      });
    }
    // If token exists, set axios default Authorization header
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error setting axios auth header from localStorage", err);
    }
  }, []);

  // Setup axios interceptors: attach token from localStorage on every request
  // and handle 401 responses by clearing auth and redirecting to login.
  const navigate = useNavigate();
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (err) {
          console.error("Error attaching token to request:", err);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        try {
          if (error.response && error.response.status === 401) {
            // Clear stored auth and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuth({ isLoggedIn: false, role: "", userName: "" });
            navigate("/login");
          }
        } catch (err) {
          console.error("Error handling 401:", err);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [navigate]);

  // Products state and fetching

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_URLS.PRODUCTS);
        const data = await res.data;

        // Normalize response: backend may return an array or an object like { items: [...] } or { products: [...] }
        const items = Array.isArray(data)
          ? data
          : data.products || data.items || data.data || [];
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);
  // save selected product for details view
  const [selectedProduct, setSelectedProduct] = useState(null);
  // View Details handler
  const onViewDetails = (product) => {
    setSelectedProduct(product);
  };
  const onCloseDetails = () => {
    setSelectedProduct(null);
  };

  // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const key = storedUser
        ? `cartItems_${storedUser.userName}`
        : "cartItems_guest";
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  // Persist cart to localStorage whenever cartItems changes.
  // Avoid writing during an auth transition (login/logout) to prevent
  // accidentally overwriting the user's stored cart with guest state.
  // Also avoid saving an empty guest cart on logout so guest data persists.
  const prevAuthRef = (() => {
    // simple lazy ref stored on module-level via closure to avoid adding refs
    // to component state; but useEffect below will recreate on each render,
    // so use a ref pattern instead
  })();

  const authPrevRef = (function () {
    // create a stable ref using closure on component render
    const ref = { current: auth.isLoggedIn };
    return ref;
  })();

  useEffect(() => {
    try {
      // If auth changed (login/logout) then skip persisting here; the
      // merge-on-login effect will write the correct merged cart and
      // we avoid overwriting user storage with pre-merge guest items.
      // We compare previous auth state stored on a property attached to
      // this effect function to persist across calls.
      if (typeof useEffect.__prevAuth === "undefined") {
        useEffect.__prevAuth = auth.isLoggedIn;
      }
      const prevAuth = useEffect.__prevAuth;
      // update for next run
      useEffect.__prevAuth = auth.isLoggedIn;

      if (prevAuth !== auth.isLoggedIn) {
        // auth changed (login/logout) — skip immediate persist
        return;
      }

      // Do not overwrite guest localStorage with an empty array on logout
      if (!auth.isLoggedIn && cartItems.length === 0) return;

      const key = auth.isLoggedIn
        ? `cartItems_${auth.userName}`
        : "cartItems_guest";
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch (err) {
      console.error("Error saving cart:", err);
    }
  }, [cartItems, auth.isLoggedIn, auth.userName]);
  // Merge guest cart into user cart on login
  useEffect(() => {
    if (auth.isLoggedIn) {
      try {
        const userKey = `cartItems_${auth.userName}`;
        const userCart = localStorage.getItem(userKey);
        const guestCart = localStorage.getItem("cartItems_guest");

        let finalCart = [];
        if (guestCart) {
          finalCart = JSON.parse(guestCart); // guest cart
        }
        if (userCart) {
          finalCart = [...finalCart, ...JSON.parse(userCart)]; // merge with previous user cart
        }

        // Remove duplicates with the same product
        const mergedCart = finalCart.reduce((acc, item) => {
          const existing = acc.find((i) => i.id === item.id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, []);

        setCartItems(mergedCart);

        // Save under username key and clear guest cart
        localStorage.setItem(userKey, JSON.stringify(mergedCart));
        localStorage.removeItem("cartItems_guest"); // clear guest cart
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]); // Clear cart on logout
    }
  }, [auth.isLoggedIn, auth.userName]);
  //cart handlers
  const handleAddToCart = (product) => {
    if (!auth.isLoggedIn) {
      setAlertMessage("You must be logged in to add items to the cart.");
      return;
    }
    // Normalize product id on add to ensure consistency (backend may use _id)
    const normId = product._id || product.id || product.productId;
    const normalizedProduct = { ...product, id: normId };
    setCartItems((prevItems) => {
      const itemExists = prevItems.find(
        (item) => (item.id || item._id || item.productId) === normId
      );
      if (itemExists) {
        return prevItems.map((item) =>
          (item.id || item._id || item.productId) === normId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...normalizedProduct, quantity: 1 }];
    });
  };
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => (item.id || item._id || item.productId) !== productId
      )
    );
  };
  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.id || item._id || item.productId) === productId
          ? { ...item, quantity }
          : item
      )
    );
  };
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  //hide alert after 2 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);
  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              loadingProducts={loadingProducts}
              handleAddToCart={handleAddToCart}
              onViewDetails={onViewDetails}
              onCloseDetails={onCloseDetails}
              selectedProduct={selectedProduct}
            />
          }
        />
        <Route
          path="/products"
          element={
            <ProductsPage
              products={products}
              loadingProducts={loadingProducts}
              handleAddToCart={handleAddToCart}
              onViewDetails={onViewDetails}
              onCloseDetails={onCloseDetails}
              selectedProduct={selectedProduct}
            />
          }
        />
        <Route path="/my-orders" element={<OrdersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {!auth.isLoggedIn && (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </>
        )}

        <Route
          path="/admin/dashboard/*"
          element={
            auth.isLoggedIn && auth.role === "admin" ? (
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        setCartItems={setCartItems}
      />
      {/* show message if alertMessage */}
      {alertMessage && (
        <div className="fixed  right-2 top-20 z-50">
          <Alert color="red" onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default App;
