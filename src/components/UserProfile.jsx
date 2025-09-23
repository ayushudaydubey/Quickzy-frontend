import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/profile', { withCredentials: true });
        if (!mounted) return;
        setUser(res.data.user || res.data);
      } catch (err) {
        // not authorized / failed -> go to login
        navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [navigate]);

  if (loading) return <div className="text-center mt-20">Loading profile...</div>;
  if (!user) return <div className="text-center mt-20 text-gray-600">Profile not available</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <div className="text-sm text-gray-500">Username</div>
          <div className="font-medium text-lg">{user.username}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <div className="font-medium">{user.mobile || user.phone || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Gender</div>
            <div className="font-medium">{user.gender || '—'}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Date of Birth</div>
          <div className="font-medium">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Address</div>
          <div className="font-medium">{user.address || '—'}</div>
          <div className="text-sm text-gray-500">
            {user.city ? `${user.city}, ` : ''}{user.state ? `${user.state} ` : ''}{user.zipCode ? ` - ${user.zipCode}` : ''}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-black text-white rounded"
          >
            My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border rounded"
          >
            Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;