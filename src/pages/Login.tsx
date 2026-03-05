import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user info in localStorage or context if needed
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/sync");
      } else {
        setError(data.error || "Failed to login");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col p-8 bg-[#F5F5F0] max-w-3xl mx-auto w-full"
    >
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center">
          <Leaf className="w-8 h-8 text-[#5A5A40]" />
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif font-medium text-stone-800">Momentum</h1>
          <h2 className="text-3xl font-serif font-medium leading-tight text-stone-900">
            Find your balance,<br />not just your limit.
          </h2>
          <p className="text-stone-500 text-sm max-w-[240px] mx-auto">
            Join a community focused on sustainable progress and mindful movement.
          </p>
        </div>
      </div>

      <div className="space-y-4 pb-8">
        {isEmailLogin ? (
          <form onSubmit={handleEmailLogin} className="space-y-4 w-full">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium flex items-center justify-center space-x-2 hover:bg-[#4A4A30] transition-colors disabled:opacity-70"
            >
              <span>{isLoading ? "Logging in..." : "Login"}</span>
            </button>
            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => setIsEmailLogin(false)}
                className="text-stone-500 text-sm font-medium hover:text-stone-800"
              >
                Back to other options
              </button>
            </div>
          </form>
        ) : (
          <>
            <button 
              onClick={() => navigate("/sync")}
              className="w-full py-4 bg-stone-900 text-white rounded-full font-medium flex items-center justify-center space-x-2 hover:bg-stone-800 transition-colors"
            >
              <span>Continue with Apple</span>
            </button>
            <button 
              onClick={() => navigate("/sync")}
              className="w-full py-4 bg-white text-stone-900 rounded-full font-medium border border-stone-200 flex items-center justify-center space-x-2 hover:bg-stone-50 transition-colors"
            >
              <span>Continue with Google</span>
            </button>
            <div className="text-center pt-4">
              <button 
                onClick={() => setIsEmailLogin(true)}
                className="text-stone-500 text-sm font-medium hover:text-stone-800"
              >
                Email Login
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className="text-center text-xs text-stone-400 flex justify-center space-x-4">
        <a href="#" className="hover:text-stone-600">Terms of Service</a>
        <a href="#" className="hover:text-stone-600">Privacy Policy</a>
      </div>
    </motion.div>
  );
}
