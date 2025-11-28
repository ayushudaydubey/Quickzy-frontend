import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Package, 
  PlusSquare, 
  ClipboardList, 
  Users, 
  CreditCard, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'; // Import Lucide icons

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosInstance.get('/admin/notifications', { withCredentials: true });
        if (mounted) setNotifications(res.data.notifications || []);
      } catch (err) {
        // silent
      }
    })();
    return () => { mounted = false; };
  }, []);

  const quickNavigate = (path) => {
    try {
      navigate(path);
    } catch (err) {
      toast.error('Navigation failed');
    }
  };

  const cards = [
    // Cancelled Products card will be shown separately below with dynamic count
    { title: 'Products', desc: 'View, edit, and manage all product listings.', path: '/product', icon: Package },
    { title: 'Create Product', desc: 'Add a new product to the catalog.', path: '/admin/create-products', icon: PlusSquare },
    { title: 'Orders', desc: 'Review, track, and process customer orders.', path: '/orders', icon: ClipboardList },
    { title: 'Users', desc: 'Manage user accounts and permissions.', path: '/all-users', icon: Users },
    { title: 'Payments', desc: 'Review and reconcile payment transactions.', path: '/admin/payments', icon: CreditCard },
    { title: 'Product Status', desc: 'Track and update user product submission status.', path: '/admin/product-status', icon: CheckCircle },
  ];

  const pendingCancelledCount = notifications.filter(n => !n.refundProcessed).length;

  return (
    // Outer container: Soft gray background for contrast against white cards
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-7xl mx-auto p-6 sm:p-10 lg:p-14">
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={true}
          theme="light"
        />

        {/* Header Section: High contrast and professional */}
        <header className="mb-12 pb-6 border-b border-zinc-300">
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900">
            Admin Dashboard
          </h1>
          <p className="text-xl text-zinc-600 mt-3">
            Your centralized control center for management.
          </p>
        </header>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Cancelled Products card */}
          <div className="bg-white rounded-xl shadow-lg transition-all duration-300 p-8 flex flex-col border border-zinc-200">
            <div className="flex items-start mb-4">
              <Package className="w-8 h-8 text-zinc-900 flex-shrink-0 mr-4" strokeWidth={2} />
              <h2 className="text-2xl font-bold text-zinc-900 pt-0.5">Cancelled Products</h2>
            </div>
            <p className="text-base text-zinc-600 mb-8 flex-grow">{pendingCancelledCount} cancelled items requiring refund processing.</p>
            <div className="flex gap-4 pt-4 border-t border-zinc-100">
              <button onClick={() => quickNavigate('/admin/product-status')} className="flex-1 flex items-center justify-center px-5 py-3 bg-red-600 text-white text-base font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md">Go Now</button>
              <Link to={'/admin/product-status'} className="w-1/3 flex items-center justify-center px-4 py-3 border-2 border-zinc-300 text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-100 transition-colors" title="Open Cancelled Products page"><ArrowRight className="w-5 h-5" strokeWidth={2.5} /></Link>
            </div>
          </div>

          {cards.map((c) => (
            <div 
              key={c.title} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col border border-zinc-200"
            >
              <div className="flex items-start mb-4">
                {/* Lucide Icon - Large and Bold */}
                <c.icon className="w-8 h-8 text-zinc-900 flex-shrink-0 mr-4" strokeWidth={2} />
                <h2 className="text-2xl font-bold text-zinc-900 pt-0.5">
                  {c.title}
                </h2>
              </div>
              
              <p className="text-base text-zinc-600 mb-8 flex-grow">
                {c.desc}
              </p>

              {/* Action Buttons - Clean B/W look */}
              <div className="flex gap-4 pt-4 border-t border-zinc-100">
                {/* Primary Button: Black Background */}
                <button
                  onClick={() => quickNavigate(c.path)}
                  className="flex-1 flex items-center justify-center px-5 py-3 bg-zinc-900 text-white text-base font-semibold rounded-lg hover:bg-zinc-700 transition-colors shadow-md"
                >
                  Go Now 
                </button>

                {/* Secondary Link: Outline Style */}
                <Link 
                  to={c.path} 
                  className="w-1/3 flex items-center justify-center px-4 py-3 border-2 border-zinc-300 text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-100 transition-colors"
                  title={`Open ${c.title} page`}
                >
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer/Note */}
        <footer className="mt-20 pt-8 border-t border-zinc-300 text-center">
          <p className="text-sm text-zinc-500">
            All administrative routes are protected. Ensure you are authenticated with the necessary privileges.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashBoard;