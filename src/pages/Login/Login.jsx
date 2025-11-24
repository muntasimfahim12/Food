import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(""); // Toast message state

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signIn(email, password);
      const loggedUser = result.user;

      const userInfo = { email: loggedUser.email };
     

      const res = await fetch(`${import.meta.env.VITE_NEXT_API_URL}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      localStorage.setItem("access-token", data.token);

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      setToast("❌ Invalid email or password"); // Set toast message
      setTimeout(() => setToast(""), 4000); // Hide after 4s
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-black via-blue-300 to-red-200">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          {toast}
        </div>
      )}

      <div className="w-full max-w-md p-8 bg-neutral-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-neutral-700 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-red-500 mb-6 text-center">Welcome Back</h1>
        <p className="text-center text-neutral-300 mb-6">
          Login to your account or{" "}
          <Link to="/signup" className="text-pink-500 hover:text-pink-400 font-semibold">
            Sign Up
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-neutral-200 font-medium">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-neutral-700 rounded-xl bg-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-neutral-200 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-neutral-700 rounded-xl bg-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              required
            />
            <span
              className="absolute right-3 top-11 cursor-pointer text-neutral-400 hover:text-pink-500 transition-transform hover:scale-110"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl shadow-lg transition transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-neutral-400 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-500 hover:text-pink-400 font-semibold">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
