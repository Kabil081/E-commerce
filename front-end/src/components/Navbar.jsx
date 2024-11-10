import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const [isLogged,setisLogged]=useState(false);
  useEffect(()=>{
    const token=document.cookie.includes('token');
    setisLogged(true);
  },[])
  const Logout=async(e)=>{
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:5000/logout',{
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify()
      })
      if(response.ok){
        alert('Logged Out Successfully');
        setisLogged(false);
        Navigate('/login');
      }
    }catch(error){
      console.log(error);
    }
  }
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between p-4 rounded-lg shadow-lg">
      <div className="flex items-center">
        <h1 className="text-3xl font-extrabold mr-4">ShopEasy</h1>
        <input
          type="text"
          placeholder="Search for products..."
          className="ml-32 px-4 py-2 w-[400px] rounded-lg  border-white bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
        />
      </div>
      <div className="flex gap-8 text-lg mr-16">
        <Link to="/" className="hover:text-gray-200 transition duration-200">Home</Link>
        {!isLogged ? (
          <>
            <Link to="/signup" className="hover:text-gray-200 transition duration-200">SignUp</Link>
            <Link to="/login" className="hover:text-gray-200 transition duration-200">Login</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="hover:text-gray-200 transition duration-200">Profile</Link>
            <button
              onClick={Logout}
              className="hover:text-gray-200 transition duration-200"
            >
              Logout
            </button>
          </>
        )}
        <Link to="/about" className="hover:text-gray-200 transition duration-200">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
