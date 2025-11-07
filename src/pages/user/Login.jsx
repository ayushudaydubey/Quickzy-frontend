import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/Reducers/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { status } = useSelector((state) => state.user);
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isLoading = status === "loading";

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login successful");
      const isAdmin =
        result.user?.role === "admin" || result.user?.admin === true;
      navigate(isAdmin ? "/admin/dashboard" : redirect, { replace: true });
    } catch (err) {
      toast.error(err?.error || "Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    const backend = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const target = redirect || "/";
    const url = `${backend.replace(/\/$/, "")}/auth/google?redirect=${encodeURIComponent(
      target
    )}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* LEFT SIDE - Quickzy Security Info */}
      <div className="flex flex-col justify-center items-center md:w-1/2 p-10 bg-gradient-to-br from-zinc-950 text-center md:text-left space-y-6 animate-fadeIn">
        <h1 className="text-5xl font-medium tracking-tight  text-center">
          Login with  Securely {" "}
        </h1>
        <p className="text-gray-400 max-w-md text-lg">
          Your privacy and security are our top priority. At{" "}
          <span className="text-white font-semibold">Quickzy</span>, we use
          modern encryption and{" "}
          <span className="text-gray-200 font-medium">Google Authentication</span>{" "}
          to protect your login and personal data.
        </p>
        <p className="text-gray-500 text-sm italic">
          “Safe, fast, and smart — just how online shopping should be.”
        </p>

        <div className="flex gap-3 mt-4">
          <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md">
            🔒 256-bit Encryption
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md">
            ☁️ Secure Cloud Auth
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
        <div className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 animate-slideIn">
          <h2 className="text-3xl font-medium text-center mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900/60 text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900/60 text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 hover:scale-[1.02] transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-black text-gray-400">OR</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 flex items-center justify-center gap-3 bg-zinc-900/60 border border-white/10 rounded-lg hover:bg-zinc-800 hover:shadow-white/10 transition-all"
              disabled={isLoading}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-white">
                Continue with Google
              </span>
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-400 pt-3">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-white font-semibold hover:underline hover:text-gray-300 transition"
                disabled={isLoading}
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
