import React from 'react';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LogIn from './components/LogIn'
import Navbar from './components/Navbar';
import About from './components/About';
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
