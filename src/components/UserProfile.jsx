import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/profile', { withCredentials: true });
        if (!mounted) return;
        const userData = res.data.user || res.data;
        setUser(userData);
        setForm({
          username: userData.username || '',
          email: userData.email || '',
          mobile: userData.mobile || userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zipCode: userData.zipCode || '',
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().slice(0,10) : '',
          gender: userData.gender || '',
          password: '',
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      // don't send empty password
      if (!payload.password) delete payload.password;

      const res = await axiosInstance.put('/profile', payload, { withCredentials: true });
      toast.success('Profile updated');
      setUser(res.data.user || res.data);
      setEditing(false);
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Profile update error:', err?.response || err);
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Update failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer />
      <h1 className="text-4xl font-medium mb-4">My Profile</h1>

      {!editing ? (
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
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 border rounded bg-zinc-950 text-white"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <label className="text-md text-zinc-800">Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="text-md text-zinc-800">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-md text-zinc-800">Phone</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="text-md text-zinc-800">Gender</label>
              <input name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="text-md text-zinc-800">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="text-md text-zinc-800">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="p-2 border rounded" />
            <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip" className="p-2 border rounded" />
          </div>

          <div>
            <label className="text-sm text-gray-600">New Password (leave blank to keep current)</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-950">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;