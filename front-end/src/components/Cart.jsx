import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const fetchCart = async () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/cart?userId=${userId}`);
      const data = await response.json();
      setCartItems(data.cart.items);
      setTotal(data.cart.total);
      setLoading(false);
    } catch (error) {
      console.error("Cart fetch error:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  
  const removeFromCart = async (productId) => {
    const userId = Cookies.get("userId");
    
    try {
      const response = await fetch("http://localhost:5000/remove-from-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId })
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const initiatePayment = async () => {
    const userId = Cookies.get("userId");
    
    try {
      const response = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          items: cartItems.map(item => ({
            productId: item.productId._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total 
        })
      });
      const session = await response.json();
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-purple-500 animate-bounce"></div>
        <p className="text-white mt-4 text-xl tracking-wider">Loading Cart...</p>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-8 pt-16">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Your Cart
          </h1>
          <button 
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-24 w-24 mx-auto mb-6 text-purple-500"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <p className="text-2xl mb-4 text-gray-300">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="space-y-6">
              {cartItems.map(item => (
                <div 
                  key={item.productId._id} 
                  className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 flex items-center justify-between hover:border-pink-500/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-6 flex-1">
                    <img 
                      src={item.productId.imageUrl} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-white mb-2">{item.name}</h2>
                      <p className="text-purple-300">₹{item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-gray-700 rounded-full">
                      <button 
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 text-white disabled:opacity-50 rounded-l-full"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        className="px-3 py-1 text-white rounded-r-full"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.productId._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4m-4 0h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Subtotal</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Tax (10%)</span>
                <span className="text-xl">₹{(total * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-purple-500/20 my-4"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">Total</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  ₹{(total * 1.1).toFixed(2)}
                </span>
              </div>
              
              <button 
                onClick={initiatePayment}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Cart;