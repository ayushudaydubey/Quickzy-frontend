// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import axiosInstance from '../../utils/axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CreateProduct = () => {
//   const { register, handleSubmit, reset } = useForm();
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     axiosInstance.get('/me', { withCredentials: true })
//       .then((res) => {
//         const isAdmin = res.data?.admin === true || res.data?.role === 'admin';
//         setUserRole(isAdmin ? 'admin' : 'user');
//       })
//       .catch((err) => {
//         setUserRole('guest');
//       });
//   }, []);

//   const onSubmit = async (data) => {
//     try {
//       await axiosInstance.post("/products", data, { withCredentials: true });
//       toast.success('Product created successfully!');
//       reset();
//     } catch (err) {
//       toast.error('Failed to create product.');
//     }
//   };

//   if (userRole === null) {
//     return <p className="text-center mt-10 text-gray-500">Loading user role...</p>;
//   }

//   if (userRole !== 'admin') {
//     return (
//       <div className="text-center text-red-600 font-semibold mt-16 text-xl">
//         You are not authorized to create products. <br />
//         <span className="text-sm text-gray-600">Role detected: <strong>{userRole}</strong></span>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10 border border-gray-100">
//       <ToastContainer />
//       <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Create New Product</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         <div>
//           <label className="block text-sm mb-1 font-medium text-gray-700">Title</label>
//           <input {...register('title', { required: true })} className="w-full border p-3 rounded" />
//         </div>

//         <div>
//           <label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
//           <textarea {...register('description', { required: true })} rows={4} className="w-full border p-3 rounded" />
//         </div>

//         <div>
//           <label className="block text-sm mb-1 font-medium text-gray-700">Image URL</label>
//           <input {...register('image', { required: true })} className="w-full border p-3 rounded" />
//         </div>

//         <div>
//           <label className="block text-sm mb-1 font-medium text-gray-700">Price</label>
//           <input type="number" step="0.01" {...register('price', { required: true })} className="w-full border p-3 rounded" />
//         </div>

//         <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition">
//           Create Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateProduct;
