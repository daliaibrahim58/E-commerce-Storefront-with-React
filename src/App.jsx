import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import DetailsProductsPage from "./pages/DetailsProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/dashboard/Users";
import Orders from "./pages/dashboard/Orders";
import Notfound from "./pages/Notfound";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const App = () => {
  // --- Load stored user safely ---
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
  }, []);

  // Products state and fetching

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/items"
        );
        const data = await res.data;

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const onViewDetails = (product) => {
    alert(`Viewing details for ${product.name}`);
  };

  // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const getCartStorageKey = () => {
    return auth.isLoggedIn ? `cartItems_${auth.userName}` : "cartItems_guest";
  };
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
      alert("You must be logged in to add items to the cart.");
      return;
    }
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };
  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={
            <ProductsPage
              products={products}
              loadingProducts={loadingProducts}
              handleAddToCart={handleAddToCart}
              onViewDetails={onViewDetails}
            />
          }
        />
        <Route path="/details" element={<DetailsProductsPage />} />
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
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route path="users" element={<Users />} />
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
    </AuthContext.Provider>
  );
};

export default App;
