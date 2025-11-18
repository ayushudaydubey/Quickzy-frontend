import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usePagination from '../../hooks/usePagination';
import Loader from '../../components/Loader';

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
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageSize, setPageSize] = useState(6);

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

  // sort newest first by createdAt
  const sortedOrders = useMemo(() => {
    return (orders || []).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  // apply status filter
  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return sortedOrders;
    return sortedOrders.filter(o => o.status === filterStatus);
  }, [sortedOrders, filterStatus]);

  const { paginatedData, currentPage, totalPages, next, prev, gotoPage } = usePagination(filteredOrders, pageSize);

  const CATEGORY_OPTIONS = ['Fashion','Technology','Home & Living','Food & Wellness','Accessories','Beauty','Other'];

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

  const updateDeliveryDate = async (orderId, dateStr) => {
    setUpdatingId(orderId);
    try {
      const res = await axiosInstance.put(
        `/admin/orders/${orderId}/delivery`,
        { expectedDeliveryDate: dateStr },
        { withCredentials: true }
      );
      toast.success('Expected delivery date updated');
      setOrders((prev) => prev.map(o => (o._id === orderId ? res.data.order : o)));
    } catch (err) {
      console.error('Update delivery date error', err);
      toast.error('Failed to update delivery date');
    } finally {
      setUpdatingId(null);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard — Orders</h1>

      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button className={`px-3 py-1 rounded ${filterStatus === 'all' ? 'bg-black text-white' : 'border'}`} onClick={() => setFilterStatus('all')}>All</button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} className={`px-3 py-1 rounded ${filterStatus === s ? 'bg-black text-white' : 'border'}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm">Page size:</label>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="p-1 border rounded">
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
        </select>
  <div className="text-sm text-gray-600">Showing {filteredOrders.length} orders</div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-gray-600">No orders found for this filter.</div>
      ) : (
        <div className="space-y-4">
          {paginatedData.map((order) => {
            const product = order.productId || {};
            const user = order.userId || {};
            return (
              <div key={order._id} className="bg-white rounded-xl shadow border p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={(Array.isArray(product.images) && product.images[0]) || product.image} alt={product.title} loading="lazy" decoding="async" className="w-20 h-20 object-cover rounded" />
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
                        <div className="mt-2">
                          <label className="text-xs text-gray-500 block">Expected delivery date</label>
                          <input
                            type="date"
                            defaultValue={order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().slice(0,10) : ''}
                            onChange={(e) => updateDeliveryDate(order._id, e.target.value)}
                            className="mt-1 p-1 border rounded text-sm"
                            disabled={updatingId === order._id}
                          />
                        </div>
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

                    {/* product category quick-change removed per admin policy */}
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">Product category</div>
                      <div className="text-sm font-medium mt-1">{product.category || 'Uncategorized'}</div>
                    </div>
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

          {/* pagination controls */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={prev} className="px-3 py-1 border rounded" disabled={currentPage <= 1}>Prev</button>
            <div className="space-x-2">Page {currentPage} of {totalPages}</div>
            <button onClick={next} className="px-3 py-1 border rounded" disabled={currentPage >= totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersProductStatus;
