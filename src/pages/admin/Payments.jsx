import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usePagination from '../../hooks/usePagination';
import { Link } from 'react-router-dom';

// small helper to format date
const fmt = (d) => new Date(d).toLocaleString();
const PaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <div><span className="font-medium">Order ID:</span> {payment.orderId}</div>
          <div><span className="font-medium">Payment ID:</span> {payment.paymentId || 'N/A'}</div>
          <div><span className="font-medium">Status:</span> {payment.status}</div>
          <div><span className="font-medium">Amount:</span> ₹{payment.amount}</div>
          <div><span className="font-medium">Currency:</span> {payment.currency}</div>
          <div><span className="font-medium">Created:</span> {new Date(payment.createdAt).toLocaleString()}</div>
          <div><span className="font-medium">User:</span> {payment.userId?.username || payment.userId?.email || 'Guest'}</div>
          <div><span className="font-medium">User Email:</span> {payment.userId?.email || 'N/A'}</div>
          <div><span className="font-medium">Meta:</span> <pre className="whitespace-pre-wrap">{JSON.stringify(payment.meta || {}, null, 2)}</pre></div>
        </div>
      </div>
    </div>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [pageSize, setPageSize] = useState(8);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/payments', { withCredentials: true });
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error('Failed to fetch payments', err?.response || err);
      toast.error('Failed to load payments. Make sure you are an admin.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // summary counts
  const total = payments.length;
  const completed = payments.filter(p => p.status === 'completed').length;
  const failed = payments.filter(p => p.status === 'failed').length;
  const pending = payments.filter(p => p.status === 'pending').length;

  // Ensure newest payments are first (server should already sort, but enforce here)
  const sorted = useMemo(() => {
    return (payments || []).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [payments]);

  // apply search and status filter
  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    return sorted.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!q) return true;
      // match order id, product title, user email/username
      const prod = p.product?.title || '';
      const user = (p.userId?.username || p.userId?.email || '').toString();
      return (p.orderId || '').toLowerCase().includes(q)
        || prod.toLowerCase().includes(q)
        || user.toLowerCase().includes(q)
        || (p.amount && p.amount.toString().includes(q));
    });
  }, [sorted, query, statusFilter]);

  const { paginatedData, currentPage, totalPages, prev, next, gotoPage } = usePagination(filtered, pageSize);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer />
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <div className="text-sm text-gray-500">Overview of customer payments</div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); gotoPage(1); }}
            placeholder="Search order, product or user..."
            className="w-full sm:w-72 p-2 border rounded shadow-sm"
          />
          <button onClick={fetchPayments} className="px-3 py-2 bg-gray-100 border rounded">Refresh</button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-xl font-semibold">{total}</div>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-xl font-semibold text-green-600">{completed}</div>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-500">Failed</div>
          <div className="text-xl font-semibold text-red-600">{failed}</div>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-xl font-semibold text-yellow-600">{pending}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2">
        {['all','completed','pending','failed'].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); gotoPage(1); }}
            className={`${statusFilter === s ? 'bg-black text-white' : 'bg-white text-gray-700'} px-3 py-1 rounded-full border shadow-sm text-sm`}
          >{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center mt-12">Loading payments…</div>
      ) : payments.length === 0 ? (
        <div className="text-gray-600">No payments found.</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedData.map((p) => (
              <div key={p._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {p.product?.image ? (
                    <img src={p.product.image} alt={p.product.title} className="w-20 h-20 object-cover rounded-lg" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                  )}

                  <div>
                    <div className="text-sm text-gray-500">Order</div>
                    <div className="font-semibold">{p.orderId}</div>
                    {p.product?.title && <div className="text-sm text-gray-600 mt-1">{p.product.title}</div>}
                    <div className="text-sm text-gray-500 mt-1">{p.userId?.username || p.userId?.email || 'Guest'}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm">
                    <span className={`px-3 py-1 rounded-full text-sm ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                  </div>

                  <div className="text-sm text-gray-600">₹{p.amount}</div>
                  <div className="text-xs text-gray-400">{fmt(p.createdAt)}</div>

                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setSelected(p)} className="px-3 py-1 border rounded text-sm">Details</button>
                    <Link to={`/admin/payments/${p.orderId}`} className="px-3 py-1 border rounded text-sm text-gray-600">Open</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={prev} className="px-3 py-1 border rounded" disabled={currentPage <= 1}>Prev</button>
              <div>Page {currentPage} of {totalPages}</div>
              <button onClick={next} className="px-3 py-1 border rounded" disabled={currentPage >= totalPages}>Next</button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Per page:</label>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); gotoPage(1); }} className="p-1 border rounded">
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {selected && <PaymentDetailsModal payment={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Payments;
