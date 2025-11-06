import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import usePagination from '../../hooks/usePagination';

// Small presentational component for paginated products grid
function PaginatedProducts({ products = [], onEdit, onDelete }) {
  const { paginatedData, currentPage, totalPages, prev, next, gotoPage } = usePagination(products, 9);

  return (
    <div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {paginatedData.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-xl shadow relative">
            <div className="flex gap-2 overflow-x-auto mb-3">
              {Array.isArray(product.images) && product.images.map((img, idx) => (
                <img key={idx} src={img} alt={product.title} loading="lazy" decoding="async" className="h-24 w-24 object-cover rounded" />
              ))}
            </div>
            <h4 className="font-bold text-lg">{product.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <p className="mt-2 text-blue-600 font-semibold">₹ {product.price}</p>

            <p className="mt-1 text-sm text-gray-500">Category: <span className="font-medium">{product.category || "Uncategorized"}</span></p>

            <div className="mt-4 flex justify-between">
              <button onClick={() => onEdit(product)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => onDelete(product._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={prev} className="px-3 py-1 border rounded" disabled={currentPage <= 1}>Prev</button>
        <div className="space-x-2">
          Page {currentPage} of {totalPages}
        </div>
        <button onClick={next} className="px-3 py-1 border rounded" disabled={currentPage >= totalPages}>Next</button>
      </div>
    </div>
  );
}

const AdminProducts = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // fetch products optionally by category. If category is empty, return empty list (admin must select category first)
  const fetchProducts = async (category) => {
    try {
      if (!category) {
        setProducts([]);
        return;
      }
      const url = `/products?category=${encodeURIComponent(category)}`;
      const res = await axiosInstance.get(url);
      // sort newest first if createdAt exists
      const list = (res.data || []).slice();
      list.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
      setProducts(list);
    } catch (err) {
      toast.error('Failed to fetch products.');
      console.error(err?.response?.data || err);
      setProducts([]);
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

  // do not auto-load all products - admin should select a category first
  useEffect(() => {
    // ensure products is empty initially
    setProducts([]);
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category || 'Other');
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append('images', data.images[i]);
        }
      }

      if (editingId) {
        // For update: send FormData (supports optional new images)
        await axiosInstance.put(`/products/${editingId}`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated!');
      } else {
        await axiosInstance.post('/products', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created!');
      }

  reset();
  setEditingId(null);
  // If admin just created/updated a product, ensure the listing shows that category
  const cat = data.category || 'Other';
  setSelectedCategory(cat);
  fetchProducts(cat);
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      console.error('Product save error:', err?.response || err);
      toast.error(`Action failed: ${serverMsg}`);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setValue('title', product.title);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('category', product.category); //  category preload
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`, { withCredentials: true });
      toast.success('Product deleted!');
      if (selectedCategory) fetchProducts(selectedCategory);
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
  <input type="file" {...register('images', { required: !editingId })} accept="image/*" multiple className="w-full p-2 border rounded" />
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

      {/* Product List - Admin selects category first */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Filter by Category</label>
        <div className="flex gap-3 items-center">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded">
            <option value="">-- Select Category --</option>
            <option value="Fashion">Fashion / Lifestyle</option>
            <option value="Technology">Technology / Gadgets</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Food & Wellness">Food & Wellness</option>
            <option value="Accessories">Accessories</option>
            <option value="Beauty">Beauty & Grooming</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={() => fetchProducts(selectedCategory)} className="px-4 py-2 bg-black text-white rounded">Load Products</button>
          <button onClick={() => { setSelectedCategory(''); setProducts([]); }} className="px-3 py-2 border rounded">Clear</button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Products in {selectedCategory || '—'}</h3>
      <div>
        {products.length === 0 ? (
          <div className="text-gray-600">No products loaded. Select a category and click "Load Products".</div>
        ) : (
          <>
            {/* Paginate products */}
            <PaginatedProducts products={products} onEdit={handleEdit} onDelete={handleDelete} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
