import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch products.');
      console.error(err?.response?.data || err);
    }
  };

  // ensure logged in user is admin before showing form
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axiosInstance.get('/me', { withCredentials: true });
        if (!res.data?.admin && res.data?.role !== 'admin') {
          toast.error('Access denied — admin only.');
          navigate('/');
          return;
        }
      } catch (err) {
        toast.error('Please login as admin to access this page.');
        navigate('/login');
        return;
      } finally {
        setCheckingAdmin(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (data) => {
    try {
      // normalize types before sending
      const payload = {
        ...data,
        price: Number(data.price),
        category: data.category || 'Other',
      };

      // create or update product
      if (editingId) {
        await axiosInstance.put(`/products/${editingId}`, payload, { withCredentials: true });
        toast.success('Product updated!');
      } else {
        await axiosInstance.post('/products', payload, { withCredentials: true });
        toast.success('Product created!');
      }

      reset();
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      // show detailed server message for debugging
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      console.error('Product save error:', err?.response || err);
      toast.error(`Action failed: ${serverMsg}`);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setValue('title', product.title);
    setValue('description', product.description);
    setValue('image', product.image);
    setValue('price', product.price);
    setValue('category', product.category); //  category preload
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`, { withCredentials: true });
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err?.response || err);
      toast.error('Failed to delete product.');
    }
  };

  if (checkingAdmin) {
    return <div className="text-center mt-20">Checking admin access...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        {editingId ? 'Edit Product' : 'Create Product'}
      </h2>

      {/* Product Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow space-y-4 mb-10">
        <input {...register('title', { required: true })} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea {...register('description', { required: true })} placeholder="Description" className="w-full p-2 border rounded" />
        <input {...register('image', { required: true })} placeholder="Image URL" className="w-full p-2 border rounded" />
        <input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price" className="w-full p-2 border rounded" />

        {/* ✅ Category Dropdown */}
        <select {...register('category', { required: true })} className="w-full p-2 border rounded">
          <option value="">-- Select Category --</option>
          <option value="Fashion">Fashion / Lifestyle</option>
          <option value="Technology">Technology / Gadgets</option>
          <option value="Home & Living">Home & Living</option>
          <option value="Food & Wellness">Food & Wellness</option>
          <option value="Accessories">Accessories</option>
          <option value="Beauty">Beauty & Grooming</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { reset(); setEditingId(null); }}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <h3 className="text-xl font-semibold mb-4">All Products</h3>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-xl shadow relative">
            <img src={product.image} alt={product.title} className="h-40 w-full object-cover rounded mb-3" />
            <h4 className="font-bold text-lg">{product.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <p className="mt-2 text-blue-600 font-semibold">₹ {product.price}</p>

            {/* ✅ Show category */}
            <p className="mt-1 text-sm text-gray-500">
              Category: <span className="font-medium">{product.category || "Uncategorized"}</span>
            </p>

            <div className="mt-4 flex justify-between">
              <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
