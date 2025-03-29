import React from 'react';
import { apiClient } from '../lib/api-Client';
import { useAppStore } from '../Store';

const RazorpayPayment = ({ amount, currency = 'INR', productName }) => {

  const {userInfo}=useAppStore();
  console.log(userInfo);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      // Load Razorpay script dynamically
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // Create order on your backend
      const { data } = await apiClient.post('payment/create-order', {
        amount: 1,
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          productName: "mumbai tour",
          userId: userInfo._id 
        }
      });

      // Razorpay options
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Easy Travel",
        description: `Payment for ${productName}`,
        image: 'https://your-company-logo.png',
        order_id: data.order.id,
        handler: async function (response) {
          // Verify payment on your backend
          const { data } = await axios.post('/api/verifyPayment', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          });

          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: '9999999999'
        },
        notes: {
          address: 'Customer Address'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="payment-container">
      <button 
        onClick={handlePayment} 
        // disabled={loading}
        className="pay-button"
      >
        Payment now
        {/* {loading ? 'Processing...' : `Pay ₹${amount}`} */}
      </button>
    </div>
  );
};

export default RazorpayPayment;