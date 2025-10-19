import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STATUS_OPTIONS = [
  'pending',
  'paid',
  'shipped',
  'out-for-delivery',
  'delivered',
  'failed',
];

const UsersProductStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/orders', { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Fetch admin orders error', err);
      toast.error('Failed to load orders. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status, incrementAttempt = false, note = '') => {
    setUpdatingId(orderId);
    try {
      const res = await axiosInstance.put(
        `/admin/orders/${orderId}/status`,
        { status, incrementAttempt, note },
        { withCredentials: true }
      );
      toast.success('Order updated');
      // replace order in list
      setOrders((prev) => prev.map(o => (o._id === orderId ? res.data.order : o)));
    } catch (err) {
      console.error('Update order status error', err);
      toast.error('Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard — Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-600">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const product = order.productId || {};
            const user = order.userId || {};
            return (
              <div key={order._id} className="bg-white rounded-xl shadow border p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={(Array.isArray(product.images) && product.images[0]) || product.image} alt={product.title} className="w-20 h-20 object-cover rounded" />
                    <div>
                      <div className="font-semibold">{product.title}</div>
                      <div className="text-sm text-gray-600">Order: {order._id}</div>
                      <div className="text-sm text-gray-600">Qty: {order.quantity} · Total: ₹{order.total}</div>
                      <div className="text-sm text-gray-600">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <div className="text-sm text-gray-500">Customer</div>
                        <div className="font-medium">{user.username || order.customer?.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-sm text-gray-600">{order.customer?.phone || user.mobile}</div>
                        <div className="text-sm text-gray-600">{order.customer?.address || `${user.address || ''}`}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Delivery</div>
                        <div className="text-sm">Status: <span className="font-medium">{order.status}</span></div>
                        <div className="text-sm">Attempts: <span className="font-medium">{order.deliveryAttempts || 0}</span></div>
                        {order.deliveredAt && <div className="text-sm">Delivered at: {new Date(order.deliveredAt).toLocaleString()}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value, false)}
                      className="p-2 border rounded"
                      disabled={updatingId === order._id}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => updateStatus(order._id, order.status, true, 'Delivery attempt recorded')}
                      className="text-sm bg-gray-100 px-3 py-1 rounded"
                      disabled={updatingId === order._id}
                    >
                      + Record delivery attempt
                    </button>
                  </div>
                </div>

                {/* Delivery logs */}
                {order.deliveryLogs?.length > 0 && (
                  <div className="mt-3 text-sm text-gray-700">
                    <div className="font-medium">Delivery Logs:</div>
                    <ul className="list-disc ml-5">
                      {order.deliveryLogs.slice().reverse().map((l, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{l.status}</span> — {l.note || 'No note'}{' '}
                          <span className="text-gray-500">({new Date(l.timestamp).toLocaleString()})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UsersProductStatus;

