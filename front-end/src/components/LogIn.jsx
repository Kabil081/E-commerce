import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOff, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
const LogIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const isEmailValid = email.includes('@') && email.length > 5;
  const isPasswordValid = password.length >= 6;
  const navigate=useNavigate();
  const Login=async(e)=>{
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:5000/login',{
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({email,password})
      })
      const data=await response.json();
      if(response.ok){
        alert('Logged In successfully');
        navigate('/');
      }
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col p-8 rounded-lg items-center border border-gray-300 w-full max-w-md bg-white shadow-lg gap-5">
        <h1 className="mb-6 tracking-tighter text-black font-semibold text-2xl text-center">Login</h1>
        <div className="relative w-full">
          <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailTouched(true)}
            required
            placeholder="Email"
            className={`pl-10 pr-10 p-3 border-2 ${emailTouched && (isEmailValid ? 'border-green-500' : 'border-red-500')} rounded-lg w-full appearance-none focus:outline-none focus:ring-0`}
          />
          {emailTouched && (
            isEmailValid ? (
              <CheckCircle size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            ) : email.length > 0 ? (
              <XCircle size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            ) : null
          )}
        </div>
        <div className="relative w-full">
          <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordTouched(true)}
            required
            placeholder="Password"
            className={`pl-10 pr-10 p-3 border-2 ${passwordTouched && (isPasswordValid ? 'border-green-500' : 'border-red-500')} rounded-lg w-full appearance-none focus:outline-none focus:ring-0`}
          />
          {passwordTouched && (
            isPasswordValid ? (
              <CheckCircle size={20} className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500" />
            ) : password.length > 0 ? (
              <XCircle size={20} className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500" />
            ) : null
          )}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {passwordVisible ? (
              <EyeOff
                size={20}
                className="text-gray-400 cursor-pointer"
                onClick={() => setPasswordVisible(false)}
              />
            ) : (
              <EyeIcon
                size={20}
                className="text-gray-400 cursor-pointer"
                onClick={() => setPasswordVisible(true)}
              />
            )}
          </div>
        </div>
        <button
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={Login}
        >
          Login
        </button>
        <div className="flex items-center w-full">
          <div className="flex-grow border-t-2 border-gray-700"></div>
          <span className="px-2 text-gray-700 font-semibold">Or</span>
          <div className="flex-grow border-t-2 border-gray-700"></div>
        </div>
        <button
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-slate-800 transition duration-200"
        >
          Sign-Up
        </button>
      </div>
    </div>
  );
}
export default LogIn