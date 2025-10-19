import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashBoard = () => {
  const navigate = useNavigate();

  const quickNavigate = (path) => {
    try {
      navigate(path);
    } catch (err) {
      toast.error('Navigation failed');
    }
  };

  const cards = [
    { title: 'Products', desc: 'View and manage products', path: '/product' },
    { title: 'Create Product', desc: 'Add a new product', path: '/admin/create-products' },
    { title: 'Orders', desc: 'View all orders', path: '/orders' },
    { title: 'Users', desc: 'Manage users', path: '/profile' },
    { title: 'Payments', desc: 'Review payments', path: '/admin/payments' },
    { title: 'User Products Status', desc: 'User Products Status', path: '/admin/product-status' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">Quick actions and navigation</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
            <div>
              <div className="text-lg font-semibold mb-2">{c.title}</div>
              <div className="text-sm text-gray-600 mb-4">{c.desc}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => quickNavigate(c.path)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go
              </button>

              <Link to={c.path} className="border border-gray-200 px-4 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        Note: admin routes are protected. If you see a redirect to login, ensure you're signed in with an admin account.
      </div>
    </div>
  );
};

export default AdminDashBoard;

