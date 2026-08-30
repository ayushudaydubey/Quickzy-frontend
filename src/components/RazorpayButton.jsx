import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';

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

const RazorpayButton = ({
  amount,
  currency = 'INR',
  onSuccess,
  onError,
  meta,
  disabled = false,
  onDisabledClick,
  loading = false,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    setIsProcessing(true);
    try {
      // ensure checkout script is loaded
      await loadRazorpayScript();
      if (!window.Razorpay) throw new Error('Razorpay checkout not available');

      // create order on server (amount in rupees)
      const orderRes = await axiosInstance.post(
        '/payment/create-order',
        { amount, currency, meta },
        { withCredentials: true }
      );
      const order = orderRes.data.order || orderRes.data;
      const keyId = orderRes.data?.key_id || order.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!keyId) {
        console.error('Razorpay: missing key_id', { orderRes, order });
        toast.error('Payment configuration error: missing Razorpay key. Contact support.');
        setIsProcessing(false);
        return;
      }

      if (!order || !order.amount) {
        console.error('Razorpay: invalid order response', { orderRes, order });
        toast.error('Payment initialization failed: invalid order from server.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Quickzy',
        description: 'Secure Order Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            await axiosInstance.post(
              '/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            onSuccess && onSuccess(response);
          } catch (err) {
            onError && onError(err);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        prefill: {
          name: meta?.customer?.name || '',
          email: meta?.customer?.email || '',
          contact: meta?.customer?.phone || '',
        },
        theme: { color: '#0f172a' },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setIsProcessing(false);
          onError && onError(resp);
        });
        rzp.open();
      } catch (e) {
        setIsProcessing(false);
        console.error('Razorpay open error', e);
        toast.error('Unable to open payment window. Try disabling browser extensions (adblock) or use another browser.');
        onError && onError(e);
      }
    } catch (err) {
      setIsProcessing(false);
      console.error('Razorpay error:', err);
      if (err?.response) {
        console.error('Server response:', err.response.status, err.response.data);
      }
      const status = err?.response?.status;
      const message = err?.response?.data?.error || err?.message || 'Payment initialization failed';
      if (message.includes('Razorpay script failed to load') || message.toLowerCase().includes('checkout not available')) {
        toast.error('Payment unavailable — your browser or an extension may be blocking Razorpay. Disable adblocker or try another browser.');
      } else {
        toast.error(`Payment error${status ? ' (' + status + ')' : ''}: ${message}`);
      }
      onError && onError(err);
    }
  };

  const isBusy = loading || isProcessing;

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isBusy}
      className={
        className ||
        `w-full py-4 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm ${
          disabled
            ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed shadow-none'
            : isBusy
            ? 'bg-zinc-800 text-zinc-300 cursor-wait opacity-90'
            : 'bg-zinc-900 text-white hover:bg-black hover:shadow-md hover:shadow-zinc-900/10 active:scale-[0.99] cursor-pointer'
        }`
      }
      title={disabled ? 'Please complete your profile details first' : 'Proceed to secure payment'}
    >
      {isBusy ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          <span>Processing Payment...</span>
        </>
      ) : disabled ? (
        <>
          <ShieldCheck className="w-5 h-5 text-zinc-400" />
          <span>Complete Shipping Details to Pay</span>
        </>
      ) : (
        <>
          <Lock className="w-5 h-5 text-zinc-300" />
          <span>Confirm & Pay ₹{Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </>
      )}
    </button>
  );
};

export default RazorpayButton;