import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/Reducers/userSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.user);
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const loginHandler = async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      const user = result.user;
      const isAdmin = user?.role === 'admin' || user?.admin === true;

      toast.success('Login successful');

      if (isAdmin) {
        // navigate('/admin/create-products', { replace: true });
         navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(redirect, { replace: true }); // ✅ Redirect to original page
      }
    } catch (err) {
      toast.error('Login failed: ' + (err?.error || 'Invalid credentials'));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-black text-white py-8 px-8">
            <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
            <p className="text-gray-300 text-center mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(loginHandler)} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                disabled={status === 'loading'}
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Enter your password"
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black"
                disabled={status === 'loading'}
              />
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-black hover:bg-gray-800 text-white text-lg font-bold rounded-xl shadow-lg"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-black font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
