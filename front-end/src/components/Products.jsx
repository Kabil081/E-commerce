import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import mongoose from 'mongoose';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load products. Please try again later.');
      setLoading(false);
      console.error('Fetch error:', error);
    }
  };

  const fetchCart = async () => {
    const userId = Cookies.get("userId");
    console.log(userId);
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5000/cart?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data.cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })));
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const addToCart = async(product) => {
    const userId = Cookies.get("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          userId,
          productId: product._id,
          quantity: 1
        })
      });

      if (response.ok) {
        fetchCart();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (productId) => {
    const userId = Cookies.get("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/remove-from-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId })
      });

      if (response.ok) {
        fetchCart();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || product.category === selectedCategory)
  );

  const isInCart = (productId) => {
    return cart.some(item => item.productId === productId);
  };
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-purple-500 animate-bounce"></div>
        <p className="text-white mt-4 text-xl tracking-wider">Loading Products...</p>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-8 pt-16">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-full border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
              onClick={() => navigate('/cart')}
              className="relative group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full px-2 py-1 text-xs">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product._id} 
              className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-purple-500/30"
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-lg mb-4 transform transition-transform duration-500 group-hover:scale-110"
              />
              <h2 className="text-xl font-bold text-white mb-2">{product.name}</h2>
              <p className="text-gray-400 mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  ₹{product.price}
                </span>
                
                <button 
                  onClick={() => isInCart(product._id) 
                    ? removeFromCart(product._id) 
                    : addToCart(product)
                  }
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    isInCart(product._id) 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  }`}
                >
                  {isInCart(product._id) ? 'Remove' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Products;