import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { registerUser } from "../../store/Reducers/userSlice";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const RegisterHandler = (userData) => {
    dispatch(registerUser({ ...userData, admin: false, cart: [] }))
      .unwrap()
      .then(() => {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch((err) => {
        // Display backend validation error as toast
        const errorMessage = err?.error || err?.message || "Registration failed";
        toast.error(errorMessage);
        console.error("Registration failed:", err);
      });
  };

  return (
    <div className="h-screen flex overflow-hidden  bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white">
      {/* Left Info Section */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center text-center px-12 space-y-6">
        <h1 className="text-5xl  tracking-normal">
          Why search everywhere when it’s all here?
        </h1>
        <p className="text-lg text-gray-400 max-w-md">
        From fashion to daily essentials, explore thousands of products all in one place 
          Join the Quickzy community and experience shopping like never before.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Explore Store
          </button>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl px-10">
          <h2 className="text-3xl font-bold text-center mb-1">
            Create Account
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Join us and start your journey
          </p>

          <form
            onSubmit={handleSubmit(RegisterHandler)}
            className="grid grid-cols-2 gap-4"
          >
            {/* Personal Info */}
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="Full Name *"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email Address *"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <input
              {...register("mobile", { required: true })}
              type="tel"
              placeholder="Mobile Number *"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password *"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <select
              {...register("gender")}
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              {...register("dateOfBirth")}
              type="date"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white"
            />

            {/* Address Info */}
            <input
              {...register("address")}
              type="text"
              placeholder="Street Address"
              className="col-span-2 p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <input
              {...register("city")}
              type="text"
              placeholder="City"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <input
              {...register("state")}
              type="text"
              placeholder="State"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <input
              {...register("zipCode")}
              type="text"
              placeholder="ZIP Code"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />
            <input
              {...register("country")}
              type="text"
              placeholder="Country"
              className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none text-white placeholder-gray-400"
            />

            <button
              type="submit"
              className="col-span-2 mt-3 py-3 bg-white hover:bg-gray-300 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.03]"
            >
              Create Account
            </button>

            <div className="col-span-2 text-center mt-2">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-white font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
