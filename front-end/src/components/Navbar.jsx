import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
const Navbar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const token = Cookies.get('token');
    setIsLogged(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLogged(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-lg shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transform hover:scale-105 transition-transform duration-300"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              ShopEasy
            </span>
          </Link>
          <div className={`relative transition-all duration-300 ${
            searchFocused ? 'w-[500px]' : 'w-[300px]'
          }`}>
            <input
              type="text"
              placeholder="Search for products..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full px-6 py-2 rounded-full bg-white/10 border border-white/20 
                       text-white placeholder-white/60 focus:outline-none focus:ring-2 
                       focus:ring-purple-500/50 transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <NavLink to="/products">
              <span className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Products</span>
              </span>
            </NavLink>

            {!isLogged ? (
              <>
                <NavLink to="/signup">Sign Up</NavLink>
                <NavLink to="/login">Login</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/add-product">Add Product</NavLink>
                <NavLink to="/cart">Cart</NavLink>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 
                           text-white font-medium hover:from-pink-600 hover:to-purple-600 
                           transform hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
            
            <NavLink to="/about">About</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative text-white/90 hover:text-white font-medium 
                  transition-all duration-300 group ${isActive ? 'text-white' : ''}`}
    >
      <span className="relative z-10">{children}</span>
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r 
                       from-pink-500 to-purple-500 transform origin-left scale-x-0 
                       transition-transform duration-300 group-hover:scale-x-100
                       ${isActive ? 'scale-x-100' : ''}`} />
    </Link>
  );
};

export default Navbar;