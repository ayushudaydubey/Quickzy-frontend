import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState(null); // null means "loading"

  useEffect(() => {
    axiosInstance.get('/cart/orders', { withCredentials: true })
      .then(res => {
        console.log('Orders fetched:', res.data);
        setOrders(res.data.orders || []);
      })
      .catch(err => {
        console.error(' Failed to fetch orders:', err);
        setOrders([]); // fallback to empty
      });
  }, []);

  if (orders === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800"> My Orders</h1>

      <div className="space-y-6">
        {orders.map((order, i) => {
          const product = order.productId;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl shadow border flex flex-col md:flex-row gap-6 p-5 hover:shadow-md transition"
            >
              <img
                src={product?.image}
                alt={product?.title}
                className="w-28 h-28 object-cover rounded-xl border"
              />

              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold text-gray-700">{product?.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{product?.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-sm text-gray-700">
                  <p><strong>Price:</strong> ₹{product?.price}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Total:</strong> ₹{order.total}</p>
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full 
                      ${order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    Status: {order.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
