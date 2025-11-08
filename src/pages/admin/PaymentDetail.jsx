import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentDetail = () => {
  const { orderId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPayment = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/payments/${encodeURIComponent(orderId)}`, { withCredentials: true });
      setPayment(res.data.payment || null);
    } catch (err) {
      console.error('Failed to fetch payment', err?.response || err);
      toast.error('Failed to load payment. Are you an admin?');
      setPayment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) return <div className="text-center mt-12">Loading payment…</div>;

  if (!payment) return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />
      <div className="text-red-600">Payment not found.</div>
      <Link to="/admin/payments" className="mt-4 inline-block text-sm text-blue-600">Back to payments</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/payments" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold">Payment</h1>
        </div>

        <div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm ${payment.status === 'completed' ? 'bg-green-50 text-green-700' : payment.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{payment.status}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {payment.product ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                {payment.product.image ? (
                  <img src={payment.product.image} alt={payment.product.title} className="mx-auto w-40 h-40 object-cover rounded-lg" />
                ) : (
                  <div className="w-40 h-40 bg-gray-100 rounded-lg mx-auto flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="mt-3 font-semibold">{payment.product.title}</div>
                <div className="text-sm text-gray-500">₹{payment.product.price}</div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="font-medium">No product info</div>
                <div className="text-sm text-gray-500">(Product not attached to payment)</div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-medium break-all">{payment.orderId}</div>

                <div className="text-sm text-gray-500 mt-3">Payment ID</div>
                <div className="font-medium">{payment.paymentId || 'N/A'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div className="font-medium">₹{payment.amount} {payment.currency}</div>

                <div className="text-sm text-gray-500 mt-3">Created</div>
                <div className="font-medium">{new Date(payment.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-500">Customer</div>
              <div className="font-medium">{payment.userId?.username || payment.userId?.email || 'Guest'}</div>
              <div className="text-sm text-gray-600">{payment.userId?.email}</div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-500">Meta</div>
              <pre className="bg-gray-50 p-3 rounded mt-2 text-sm overflow-auto">{JSON.stringify(payment.meta || {}, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
