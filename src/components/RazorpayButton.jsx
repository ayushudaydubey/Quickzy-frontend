import React from 'react';
import axiosInstance from '../utils/axios';

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay script failed to load'));
    document.body.appendChild(script);
  });
};

const RazorpayButton = ({ amount, currency = 'INR', onSuccess, onError, meta, disabled = false }) => {
  const handlePayment = async () => {
    if (disabled) return;
    try {
      // ensure checkout script is loaded
      await loadRazorpayScript();
      if (!window.Razorpay) throw new Error('Razorpay checkout not available');

      // create order on server (amount in rupees)
      const orderRes = await axiosInstance.post('/payment/create-order', { amount, currency, meta }, { withCredentials: true });
      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_EETe6chpOgdWdf',
        amount: order.amount,
        currency: order.currency,
        name: 'Quickzy',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            await axiosInstance.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { withCredentials: true });

            onSuccess && onSuccess(response);
          } catch (err) {
            onError && onError(err);
          }
        },
        prefill: {
          name: meta?.customer?.name || '',
          email: meta?.customer?.email || '',
          contact: meta?.customer?.phone || ''
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        onError && onError(resp);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      onError && onError(err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl text-lg font-bold ${disabled ? 'bg-gray-400 text-gray-700' : 'bg-black text-white hover:bg-gray-800'}`}
    >
      {disabled ? 'Processing...' : `Confirm & Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayButton;