import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/Reducers/userSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const RegisterHandler = async (userData) => {
    try {
      await dispatch(registerUser({ ...userData, admin: false, cart: [] })).unwrap();
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed: " + (err?.message || "Please try again"));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-black text-white py-8 px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center">Create Account</h2>
            <p className="text-gray-300 text-center mt-2">Join us and start your journey</p>
          </div>

          <form onSubmit={handleSubmit(RegisterHandler)} className="p-8 lg:p-12 space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-black border-b border-gray-200 pb-2">
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  {...register("username", { required: true })}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-2">Name is required.</p>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-2">Email is required.</p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                  <input
                    {...register("mobile", { required: true })}
                    type="tel"
                    placeholder="Enter mobile number"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500 mt-2">Mobile number is required.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-2">Password is required.</p>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    {...register("gender", { required: true })}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-black"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-black border-b border-gray-200 pb-2">
                Address Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  {...register("address")}
                  type="text"
                  placeholder="Enter your street address"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    {...register("city")}
                    type="text"
                    placeholder="Enter city"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    {...register("state")}
                    type="text"
                    placeholder="Enter state"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    {...register("zipCode")}
                    type="text"
                    placeholder="Enter ZIP code"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    {...register("country")}
                    type="text"
                    placeholder="Enter country"
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 bg-black hover:bg-gray-800 text-white text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Account
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-black font-semibold hover:underline"
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
