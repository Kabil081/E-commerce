import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  const categories = [
    {
      name: 'Electronics',
      description: 'Latest gadgets and devices',
      icon: (
        <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Clothing',
      description: 'Trendy fashion collections',
      icon: (
        <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M16 6l-4-4-4 4" />
        </svg>
      )
    },
    {
      name: 'Books',
      description: 'Extensive book collection',
      icon: (
        <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Food',
      description: 'Delicious culinary items',
      icon: (
        <svg className="w-8 h-8 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full 
                         mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full 
                         mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full 
                         mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-8">
              <span className="block text-white">Welcome to</span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
                             bg-clip-text text-transparent animate-gradient">
                ShopEasy
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Discover an amazing shopping experience with our curated collection of products. 
              From electronics to fashion, we've got everything you need.
            </p>
            <div className="mt-12 flex justify-center space-x-6">
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                         rounded-full font-medium hover:from-pink-600 hover:to-purple-600 
                         transform hover:scale-105 transition-all duration-300"
              >
                Explore Products
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border border-white/20 text-white rounded-full 
                         font-medium hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg 
                       p-8 border border-white/10 hover:border-white/20 transition-all duration-500
                       transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative text-center">
                {category.icon}
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative rounded-2xl bg-white/5 backdrop-blur-lg p-8 border border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for the latest products and exclusive offers.
            </p>
            <form className="flex space-x-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 
                         focus:ring-purple-500/50"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 
                         text-white rounded-full font-medium hover:from-pink-600 
                         hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;