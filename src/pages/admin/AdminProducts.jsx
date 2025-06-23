import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProducts = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/products/${editingId}`, data, { withCredentials: true });
        toast.success('Product updated!');
      } else {
        await axiosInstance.post('/products', data, { withCredentials: true });
        toast.success('Product created!');
      }

      reset();
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setValue('title', product.title);
    setValue('description', product.description);
    setValue('image', product.image);
    setValue('price', product.price);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`, { withCredentials: true });
      toast.success('Product deleted!');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        {editingId ? 'Edit Product' : 'Create Product'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow space-y-4 mb-10">
        <input {...register('title', { required: true })} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea {...register('description', { required: true })} placeholder="Description" className="w-full p-2 border rounded" />
        <input {...register('image', { required: true })} placeholder="Image URL" className="w-full p-2 border rounded" />
        <input type="number" {...register('price', { required: true })} placeholder="Price" className="w-full p-2 border rounded" />

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { reset(); setEditingId(null); }} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">All Products</h3>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-xl shadow relative">
            <img src={product.image} alt={product.title} className="h-40 w-full object-cover rounded mb-3" />
            <h4 className="font-bold text-lg">{product.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <p className="mt-2 text-blue-600 font-semibold">₹ {product.price}</p>
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
