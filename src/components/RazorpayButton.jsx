import React from 'react';
import { toast } from 'react-toastify';
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
      // backend may return { order, key_id } or the order directly
      const order = orderRes.data.order || orderRes.data;
      const keyId = orderRes.data?.key_id || order.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!keyId) {
        console.error('Razorpay: missing key_id', { orderRes, order });
        toast.error('Payment configuration error: missing Razorpay key. Contact support.');
        return;
      }

      if (!order || !order.amount) {
        console.error('Razorpay: invalid order response', { orderRes, order });
        toast.error('Payment initialization failed: invalid order from server.');
        return;
      }

      const options = {
        key: keyId,
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
        theme: { color: 'black' },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          onError && onError(resp);
        });
        rzp.open();
      } catch (e) {
        console.error('Razorpay open error', e);
        toast.error('Unable to open payment window. Try disabling browser extensions (adblock) or use another browser.');
        onError && onError(e);
      }
    } catch (err) {
      console.error('Razorpay error:', err);
      if (err?.response) {
        console.error('Server response:', err.response.status, err.response.data);
      }
      // show a helpful toast with status when available
      const status = err?.response?.status;
      const message = err?.response?.data?.error || err?.message || 'Payment initialization failed';
        // If the Razorpay script failed to load (commonly blocked by adblockers), show a clear toast
        if (message.includes('Razorpay script failed to load') || message.toLowerCase().includes('checkout not available')) {
          toast.error('Payment unavailable — your browser or an extension may be blocking Razorpay. Disable adblocker or try another browser.');
        } else {
          toast.error(`Payment error${status ? ' (' + status + ')' : ''}: ${message}`);
        }
      onError && onError(err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl text-lg font-bold ${disabled ? 'bg-gray-400 text-gray-700' : 'bg-black text-white hover:bg-zinc-900'}`}
    >
      {disabled ? 'Processing...' : `Confirm & Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayButton;