import axios from 'axios';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (orderId) => {
  const { data } = await axios.post('/api/payments/create-order', { orderId }, { withCredentials: true });
  return data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const { data } = await axios.post('/api/payments/verify', paymentData, { withCredentials: true });
  return data;
};

export const initiateRazorpayCheckout = async (orderId, userInfo, onSuccess, onFailure) => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error('Razorpay SDK failed to load');
  }

  const orderData = await createRazorpayOrder(orderId);

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'ArrayStore',
    description: `Order #${orderId}`,
    order_id: orderData.razorpayOrderId,
    prefill: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
    },
    theme: {
      color: '#6366f1',
    },
    handler: async (response) => {
      try {
        const result = await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId,
        });
        onSuccess?.(result);
      } catch (error) {
        onFailure?.(error);
      }
    },
    modal: {
      ondismiss: () => {
        onFailure?.(new Error('Payment cancelled'));
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
