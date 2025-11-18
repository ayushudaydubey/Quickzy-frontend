import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RazorpayButton from "../../components/RazorpayButton";
import Loader from '../../components/Loader';

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(
    Number.isInteger(location.state?.quantity) &&
      location.state.quantity > 0
      ? location.state.quantity
      : 1
  );

  const [submitting, setSubmitting] = useState(false);

  const totalPrice = product ? (product.price * quantity).toFixed(2) : "0.00";

  /* ------------------- Load product ------------------- */
  useEffect(() => {
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  /* ------------------- Load user ------------------- */
  useEffect(() => {
    axiosInstance
      .get("/profile", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        toast.error("Please log in first");
        navigate("/login");
      });
  }, [navigate]);

  /* ------------------- Razorpay success ------------------- */
  const handlePaymentSuccess = async (r) => {
    setSubmitting(true);
    try {
      await axiosInstance.post(
        "/cart/create",
        {
          productId: id,
          quantity,
          customer: {
            name: user.username,
            address: user.address,
            phone: user.mobile,
          },
          total: Number(totalPrice),
          payment: {
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          },
        },
        { withCredentials: true }
      );

      toast.success("Payment successful!");
      setTimeout(() => navigate("/orders"), 1200);
    } catch (err) {
      toast.error("Order save failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------- Razorpay error ------------------- */
  const handlePaymentError = () => {
    toast.error("Payment failed or cancelled.");
  };

  /* ------------------- Loading state ------------------- */
  if (!product || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader text="Loading checkout..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ---------- Header ---------- */}
        <div className="text-left">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-black text-sm mb-4"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-medium text-zinc-950"> Final Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete your purchase securely
          </p>
        </div>

        {/* ---------- Main Grid ---------- */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* -------- Left: Product & Delivery -------- */}
          <div className="lg:col-span-2 space-y-6">

            {/* --- Product Card --- */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Product Image */}
                <img
                  src={(Array.isArray(product.images) && product.images[0]) || product.image}
                  alt={product.title}
                  className="w-40 h-40 object-cover rounded-lg shadow-md"
                />

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">Quantity:</span>

                    <div className="flex items-center border rounded-xl overflow-hidden bg-gray-50">
                      <button
                        className="px-3 py-1 text-lg hover:bg-gray-200 active:scale-95 transition"
                        onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                      >
                        −
                      </button>

                      <div className="px-4 font-medium">{quantity}</div>

                      <button
                        className="px-3 py-1 text-lg hover:bg-gray-200 active:scale-95 transition"
                        onClick={() => {
                          if (quantity >= 10) {
                            toast.warn("Maximum 10 items allowed");
                            return;
                          }
                          setQuantity((n) => n + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="text-xl font-semibold text-gray-900">
                    Total: ₹{totalPrice}
                  </p>
                </div>
              </div>
            </div>

            {/* --- Delivery Info --- */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Delivery Info
                </h2>

                <button
                  onClick={() => navigate("/profile")}
                  className="text-sm text-zinc-950 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><strong>Name:</strong> {user.username}</p>
                <p><strong>Phone:</strong> {user.mobile}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p className="sm:col-span-2">
                  <strong>Address:</strong> {`${user.address}, ${user.city}, ${user.state} ${user.zipCode}`}
                </p>
              </div>
            </div>
          </div>

          {/* -------- Right: Total & Pay -------- */}
          <div className="space-y-6">

            {/* Price Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Total
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>

                <div className="flex justify-between border-t pt-3 mt-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <RazorpayButton
                amount={Number(totalPrice)}
                currency="INR"
                meta={{
                  productId: id,
                  quantity,
                  customer: {
                    name: user.username,
                    address: user.address,
                    phone: user.mobile,
                  },
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                disabled={submitting}
              />

              <p className="text-xs text-gray-500 text-center mt-3">
                Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
