import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeIcon, EyeOff, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
import Cookies from "js-cookie";
const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [message, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const isEmailValid = email.includes("@") && email.length > 5;
  const isPasswordValid = password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials:include
      });
      const data = await response.json();
      Cookies.set("token", data.token, { expires: 100000, path: "" });
      Cookies.set("userId",data.userId,{expires:100000,path:""});
      console.log(Cookies.get("token"));
      console.log(Cookies.get("userId"));
      if (response.ok) {
        alert("Logged In successfully");
        navigate("/");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error logging in");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-16 h-16 bg-blue-500 rounded-full opacity-30 animate-bubble top-10 left-1/4"></div>
        <div className="absolute w-20 h-20 bg-pink-500 rounded-full opacity-30 animate-bubble top-40 left-3/4 animation-delay-2000"></div>
        <div className="absolute w-12 h-12 bg-purple-500 rounded-full opacity-30 animate-bubble top-20 left-1/3 animation-delay-4000"></div>
        <div className="absolute w-16 h-16 bg-green-500 rounded-full opacity-30 animate-bubble top-60 left-1/5 animation-delay-6000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailTouched(true)}
                  required
                  placeholder="Email"
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                {emailTouched && (
                  isEmailValid ? (
                    <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  ) : email.length > 0 ? (
                    <XCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                  ) : null
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordTouched(true)}
                  required
                  placeholder="Password"
                  className="w-full pl-10 pr-16 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {passwordVisible ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                </button>
                {passwordTouched && isPasswordValid && (
                  <CheckCircle
                    size={20}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>

              {message && (
                <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                Login
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center space-x-2">
              <span className="h-px w-16 bg-white/20" />
              <span className="text-white/60 text-sm">OR</span>
              <span className="h-px w-16 bg-white/20" />
            </div>

            <button
              onClick={() => navigate("/signup")}
              className="mt-6 w-full py-3 border border-white/20 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
