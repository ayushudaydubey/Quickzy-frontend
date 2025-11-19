import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState(null); // null = loading

  useEffect(() => {
    axiosInstance
      .get("/cart/orders", { withCredentials: true })
      .then((res) => {
        const fetched = res.data.orders || [];
        setOrders(fetched);

        // If any order has adminSetEta === true and etaNotified === false,
        // show a simple confirmation alert and acknowledge on the server.
        fetched.forEach(async (o) => {
          if (o.adminSetEta && !o.etaNotified) {
            try {
              const dateStr = o.expectedDeliveryDate
                ? new Date(o.expectedDeliveryDate).toLocaleDateString()
                : null;
              // Simple confirmation to the user
              if (dateStr) {
                window.alert(`Your product delivery confirmed on ${dateStr}`);
              } else {
                window.alert(`Your delivery date has been set by admin.`);
              }

              // Acknowledge to backend so we don't show the message again
              await axiosInstance.put(`/cart/orders/${o._id}/ack-eta`, {}, { withCredentials: true });
            } catch (e) {
              // swallow errors — acknowledgment is best-effort
              console.error('ack-eta error', e);
            }
          }
        });
      })
      .catch(() => setOrders([]));
  }, []);

  /* ------------------- LOADING ------------------- */
  if (orders === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"></div>
      </div>
    );
  }

  /* ------------------- NO ORDERS ------------------- */
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
          className="w-28 opacity-70 mb-4"
        />
        <p className="text-lg">No orders yet.</p>
      </div>
    );
  }

  /* ------------------- ORDERS LIST ------------------- */
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-medium text-gray-900 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order, i) => {
          const product = order.productId;

          return (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border p-5 sm:p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-all duration-300"
            >
              {/* PRODUCT IMAGE */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={product?.image}
                  alt={product?.title}
                  className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-xl border shadow-sm"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1 space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {product?.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {product?.description}
                </p>

                {/* GRID INFO */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700 mt-3">
                  <p>
                    <strong>Price:</strong> ₹{product?.price}
                  </p>
                  <p>
                    <strong>Qty:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.total}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <div className="pt-2">
                  <span
                    className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full 
                        ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }
                      `}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  {order.expectedDeliveryDate && (
                    <div className="text-sm text-gray-600 mt-2">
                      Estimated delivery: <span className="font-medium">{new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
                      {new Date(order.expectedDeliveryDate) > new Date() && (
                        <span className="text-gray-500"> — in {Math.ceil((new Date(order.expectedDeliveryDate) - new Date()) / (1000*60*60*24))} days</span>
                      )}
                    </div>
                  )}
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
