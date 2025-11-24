import React, { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter email and password.");
      setIsLoading(false);
      return;
    }

    createUser(email, password)
      .then((result) => {
        console.log("User created:", result.user);
        setIsLoading(false);
        setSuccess("Account created successfully! Redirecting to login...");
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creating user:", error.message);
        setError(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-800 via-black to-indigo-700">
      <div className="w-full max-w-md p-8 bg-neutral-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-neutral-700 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-pink-400 mb-2 text-center">Create Account</h1>
        <p className="text-center text-neutral-300 mb-6">
          Join us and start your journey today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 text-neutral-200 font-medium">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-neutral-700 rounded-xl bg-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-neutral-200 font-medium">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-neutral-700 rounded-xl bg-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-neutral-200 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-neutral-700 rounded-xl bg-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
            <span
              className="absolute right-3 top-11 cursor-pointer text-neutral-400 hover:text-pink-400 transition-transform hover:scale-110"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-red-700 bg-red-100 border border-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 text-green-700 bg-green-100 border border-green-200 rounded-md text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl shadow-lg transition transform hover:scale-105"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-neutral-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 font-semibold hover:text-pink-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
