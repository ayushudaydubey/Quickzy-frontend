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
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {paginatedData.map((product) => (
          <div 
            key={product._id} 
            className="bg-white p-5 rounded-xl border border-zinc-200 shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Gallery Scroll */}
            <div className="flex gap-2 overflow-x-auto mb-4 pb-2 border-b border-zinc-100">
              {Array.isArray(product.images) && product.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={product.title} 
                  loading="lazy" 
                  decoding="async" 
                  className="h-20 w-20 object-cover rounded-md border border-zinc-300 flex-shrink-0" 
                />
              ))}
            </div>

            <h4 className="font-bold text-xl text-zinc-900 line-clamp-1">{product.title}</h4>
            <p className="text-sm text-zinc-600 line-clamp-2 mt-1 flex-grow">{product.description}</p>
            <p className="mt-3 text-2xl font-black text-zinc-900">₹ {product.price}</p>

            <p className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">
              Category: <span className="font-semibold text-zinc-700">{product.category || "Uncategorized"}</span>
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex justify-between gap-3 pt-4 border-t border-zinc-100">
              <button 
                onClick={() => onEdit(product)} 
                className="flex-1 px-4 py-2 text-zinc-900 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(product._id)} 
                className="w-1/3 px-4 py-2 bg-red-50 text-red-700 border border-red-300 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button 
          onClick={prev} 
          className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold" 
          disabled={currentPage <= 1}
        >
          &larr; Prev
        </button>
        <div className="text-lg font-medium text-zinc-700">
          Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
        </div>
        <button 
          onClick={next} 
          className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold" 
          disabled={currentPage >= totalPages}
        >
          Next &rarr;
        </button>
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

  // fetch products logic (unchanged)
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

  // ensure logged in user is admin before showing form (unchanged)
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

  // do not auto-load all products - admin should select a category first (unchanged)
  useEffect(() => {
    // ensure products is empty initially
    setProducts([]);
  }, []);

// onSubmit logic
  const onSubmit = async (data) => {
    try {
      // Validate images for create mode
      if (!editingId && (!data.images || data.images.length === 0)) {
        toast.error('At least one image is required for new products.');
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      // allow category to be updated in both create and edit modes
      formData.append('category', data.category || 'Other');
      
      // Only append images if they exist
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

  // handleEdit logic (unchanged)
  const handleEdit = (product) => {
    setEditingId(product._id);
    setValue('title', product.title);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('category', product.category); 
  };

  // handleDelete logic (unchanged)
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

  // Loading State (B/W theme)
  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-900">
        <div className="flex items-center space-x-3">
          {/* Simple Spinner */}
          <div className="w-6 h-6 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <ToastContainer />
        
        {/* Header */}
        <header className="mb-10 pb-6 border-b border-zinc-300 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">
            {editingId ? 'Edit Product' : 'Create New Product'}
          </h2>
          <p className="text-md text-zinc-600 mt-2">Manage your inventory and product listings.</p>
        </header>

        {/* Product Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-2xl space-y-6 mb-12 border border-zinc-200">
          <h3 className='text-2xl font-semibold mb-6 border-b border-zinc-100 pb-3'>
            {editingId ? 'Product Details' : 'New Product Entry'}
          </h3>

          <input 
            {...register('title', { required: true })} 
            placeholder="Product Title" 
            className="w-full p-3 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-colors" 
          />
          <textarea 
            {...register('description', { required: true })} 
            placeholder="Detailed Description" 
            className="w-full p-3 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-colors min-h-[100px]" 
          />
          <input 
            type="file" 
            {...register('images', { required: !editingId })} 
            accept="image/*" 
            multiple 
            className="w-full p-3 border border-zinc-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200" 
          />
          <input 
            type="number" 
            step="0.01" 
            {...register('price', { required: true })} 
            placeholder="Price (e.g., 99.99)" 
            className="w-full p-3 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-colors" 
          />

{/* Category Dropdown (now editable during updates) */}
          <select 
            {...register('category', { required: true })} 
            className="w-full p-3 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-colors"
          >
            <option value="">-- Select Category --</option>
            <option value="Fashion">Fashion / Lifestyle</option>
            <option value="Technology">Technology / Gadgets</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Food & Wellness">Food & Wellness</option>
            <option value="Accessories">Accessories</option>
            <option value="Beauty">Beauty & Grooming</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-zinc-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors shadow-md"
            >
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { reset(); setEditingId(null); }}
                className="flex-1 border border-zinc-300 text-zinc-900 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Product List Filter */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-zinc-200">
          <label className="block mb-4 font-semibold text-xl border-b border-zinc-100 pb-3">
            Filter Products by Category
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className='flex-grow'>
                <label htmlFor="category-select" className="block mb-2 text-sm font-medium text-zinc-700">Select Category</label>
                <select 
                    id="category-select"
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    className="w-full p-3 border border-zinc-300 rounded-lg focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none transition-colors bg-white"
                >
                    <option value="">-- Select Category --</option>
                    <option value="Fashion">Fashion / Lifestyle</option>
                    <option value="Technology">Technology / Gadgets</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Food & Wellness">Food & Wellness</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Beauty">Beauty & Grooming</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <button 
              onClick={() => fetchProducts(selectedCategory)} 
              disabled={!selectedCategory}
              className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Products
            </button>
            <button 
              onClick={() => { setSelectedCategory(''); setProducts([]); }} 
              className="px-4 py-3 border border-zinc-300 text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Product Listing */}
        <h3 className="text-2xl font-bold mb-6 pt-4 border-t border-zinc-300">
          Products in: {selectedCategory || '—'} ({products.length} items)
        </h3>
        
        <div>
          {selectedCategory && products.length === 0 ? (
            <div className="text-zinc-600 p-6 bg-white border border-zinc-200 rounded-lg text-center">
              No products found for **{selectedCategory}**.
            </div>
          ) : !selectedCategory ? (
             <div className="text-zinc-600 p-6 bg-white border border-zinc-200 rounded-lg text-center">
              Select a category and click **Load Products** to view listings.
            </div>
          ) : (
            <PaginatedProducts products={products} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;