import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import usePagination from '../../hooks/usePagination';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        // Assuming this endpoint requires admin authentication
        const res = await axiosInstance.get('/admin/users');
        if (!mounted) return;
        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      } catch (err) {
        console.error('Failed to fetch users', err);
        if (mounted) setError('Failed to load users. Please check server status or admin privileges.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const { paginatedData, currentPage, totalPages, next, prev, gotoPage } = usePagination(users, 10);

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 pb-4 border-b border-zinc-300">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Registered Users
          </h2>
          <p className="text-md text-zinc-600 mt-1">
            Total Users: **{users.length}**
          </p>
        </header>

        {loading ? (
          <div className="flex items-center space-x-3 text-zinc-700 p-6 bg-white rounded-xl shadow-md">
            <div className="w-5 h-5 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
            <div>Loading user list...</div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-zinc-600 p-6 bg-white border border-zinc-200 rounded-lg text-center">
            No registered users found.
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Created Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-100">
                  {paginatedData.map((u, idx) => (
                    <tr key={u._id || u.id || idx} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-700">
                        {(currentPage - 1) * 10 + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                        {u.username || <span className="text-zinc-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                        {u.email || <span className="text-zinc-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                        {u.mobile || <span className="text-zinc-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold leading-5 ${u.admin ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-800'}`}>
                          {u.admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50">
              <div className="text-sm text-zinc-700 font-medium">
                Showing <span className="font-bold">{paginatedData.length}</span> results on this page.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  &larr; Previous
                </button>
                <span className="text-sm font-medium text-zinc-700">
                  Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </span>
                <button
                  onClick={next}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;