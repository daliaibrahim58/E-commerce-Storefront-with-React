import { useState } from "react";
import {
  Button,
  IconButton,
  Typography
} from "@material-tailwind/react";

import {
  IoBagOutline,
  IoAdd,
  IoRemove,
  IoClose
} from "react-icons/io5";
// Separator component
function MTSeparator() {
  return <div className="w-full h-px bg-gray-200 my-3" />;
}
// Image component with fallback
function MTImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? "/fallback.png" : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
// Drawer component
function MTDrawer({ open, onClose, title, children }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-50 
          transform transition-transform duration-300 
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {title}
          </h2>

          <button onClick={onClose}>
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-[calc(100%-64px)] overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
}
const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem , setCartItems}) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;
  return (
     <MTDrawer
      open={isOpen}
      onClose={onClose}
      title={
        <>
          <IoBagOutline className="w-6 h-6" />
          Shopping Cart ({items.length})
        </>
      }
    >
      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-8">
          <IoBagOutline className="h-16 w-16 text-gray-300" />

          <Typography className="text-gray-500">
            Your cart is empty
          </Typography>

          <Button color="blue" onClick={onClose}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          {/* ITEMS */}
          <div className="space-y-4 py-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <MTImage
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                <div className="flex-1">
                  <Typography className="font-medium text-sm line-clamp-2">
                      {item.name}
                    </Typography>
                  <div className="flex justify-between">
                    <div>
                      <Typography className="text-gray-500 text-xs">
                        {item.category}
                      </Typography>
                      
                      <Typography className="font-bold text-sm mt-1">
                        ${item.price}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                    <IconButton
                      variant="outlined"
                      size="sm"
                      onClick={() =>
                        onUpdateQuantity(
                          item.id,
                          Math.max(0, item.quantity - 1)
                        )
                      }
                    >
                      <IoRemove className="h-4 w-4" />
                    </IconButton>

                    <Typography className="text-sm w-6 text-center">
                      {item.quantity}
                    </Typography>

                    <IconButton
                      variant="outlined"
                      size="sm"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <IoAdd className="h-4 w-4" />
                    </IconButton>
                  </div>
                  </div>

                  
                </div>

                <IconButton
                  variant="text"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <IoClose className="w-5 h-5 text-gray-600" />
                </IconButton>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="mt-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm space-y-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <MTSeparator />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="space-y-2 mt-4">
              <Button
               fullWidth 
               color="green"
               onClick={() => {
                // Clear cart and close drawer on checkout
                setCartItems([]);
                localStorage.setItem("cartItems", JSON.stringify([]));
                onClose();
               }}>
                Checkout
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="blue"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </>
      )}
    </MTDrawer>
  )
}

export default Cart