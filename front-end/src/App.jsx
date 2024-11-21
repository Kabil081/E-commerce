import React from 'react';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import About from './components/About';
import AddProduct from './components/AddProduct';
import Products from './components/Products';
import Cart from './components/cart';
const App=()=>{
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
