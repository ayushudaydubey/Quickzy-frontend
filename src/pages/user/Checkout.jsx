import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RazorpayButton from '../../components/RazorpayButton';

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(
    Number.isInteger(location.state?.quantity) && location.state.quantity > 0
      ? location.state.quantity
      : 1
  );
  const [submitting, setSubmitting] = useState(false);

  const totalPrice = product ? (product.price * quantity).toFixed(2) : '0.00';

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error('Failed to load product'));
  }, [id]);

  useEffect(() => {
    axiosInstance.get('/profile', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => {
        toast.error('Please log in to continue');
        navigate('/login');
      });
  }, [navigate]);

  const handlePaymentSuccess = async (razorpayResponse) => {
    setSubmitting(true);
    try {
      await axiosInstance.post(
        '/cart/create',
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
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_signature: razorpayResponse.razorpay_signature,
          },
        },
        { withCredentials: true }
      );

      toast.success('Payment successful and order created!');
      setTimeout(() => navigate('/orders'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Order creation failed';
      toast.error(`Order save failed: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentError = (err) => {
    toast.error('Payment failed or was cancelled.');
    console.error('Razorpay error:', err);
  };

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (!product || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-black text-xl font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border p-8 lg:p-12 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">🛒 Checkout</h1>

        <div className="border p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src={product.image} alt={product.title} className="w-32 h-32 object-cover rounded-xl" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>

              <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                <span className="text-gray-600">Quantity:</span>
                <button onClick={decreaseQty} className="border px-3 py-1 rounded-full font-bold">−</button>
                <span>{quantity}</span>
                <button onClick={increaseQty} className="border px-3 py-1 rounded-full font-bold">+</button>
              </div>

              <div className="text-xl font-bold">Total: ₹{totalPrice}</div>
            </div>
          </div>
        </div>

        <div className="border p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Delivery Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.mobile}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {`${user.address}, ${user.city}, ${user.state} ${user.zipCode}`}</p>

              
          </div>
        </div>

        <div className="border p-6 rounded-2xl bg-gray-50">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-bold text-xl border-t pt-4">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <RazorpayButton
          amount={Number(totalPrice)}
          currency="INR"
          meta={{
            productId: id,
            quantity,
            customer: { name: user.username, address: user.address, phone: user.mobile },
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          disabled={submitting}
        />
      </div>
    </div>
  );
};

export default Checkout;
