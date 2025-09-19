import React from 'react';
import axiosInstance from '../utils/axios';

const RazorpayButton = ({ amount, currency = 'INR', onSuccess, onError, meta }) => {
  const handlePayment = async () => {
    try {
      // send rupees amount
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
          name: '', email: '', contact: ''
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        onError && onError(resp);
      });
      rzp.open();
    } catch (err) {
      onError && onError(err);
    }
  };

  return <button onClick={handlePayment} className="btn-primary">Pay {amount} {currency}</button>;
};

export default RazorpayButton;