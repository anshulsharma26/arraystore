import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkoutSchema } from '../schemas/checkoutSchema';
import { createOrder } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import { initiateRazorpayCheckout } from '../utils/razorpay';
import toast from 'react-hot-toast';
import { HiLockClosed } from 'react-icons/hi2';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.orders);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const shipping = subtotal > 500 ? 0 : 49;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: { country: 'India' },
  });

  const onSubmit = async (shippingAddress) => {
    try {
      setIsProcessing(true);

      
      const orderResult = await dispatch(
        createOrder({ shippingAddress, cartItems })
      ).unwrap();

      
      await initiateRazorpayCheckout(
        orderResult._id,
        user,
        (result) => {
          dispatch(clearCart());
          toast.success('Payment successful! 🎉');
          navigate(`/orders/${orderResult._id}`);
        },
        (error) => {
          toast.error(error?.message || 'Payment failed');
          setIsProcessing(false);
        }
      );
    } catch (error) {
      toast.error(error?.message || error || 'Checkout failed');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Complete your order</p>
        </div>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
            <div className="card-glass checkout-section">
              <h3>Shipping Address</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="street">Street Address</label>
                <input {...register('street')} className={`form-input ${errors.street ? 'error' : ''}`} placeholder="123 Main Street" id="street" />
                {errors.street && <p className="form-error">{errors.street.message}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input {...register('city')} className={`form-input ${errors.city ? 'error' : ''}`} placeholder="Mumbai" id="city" />
                  {errors.city && <p className="form-error">{errors.city.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="state">State</label>
                  <input {...register('state')} className={`form-input ${errors.state ? 'error' : ''}`} placeholder="Maharashtra" id="state" />
                  {errors.state && <p className="form-error">{errors.state.message}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="postalCode">Postal Code</label>
                  <input {...register('postalCode')} className={`form-input ${errors.postalCode ? 'error' : ''}`} placeholder="400001" id="postalCode" />
                  {errors.postalCode && <p className="form-error">{errors.postalCode.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="country">Country</label>
                  <input {...register('country')} className={`form-input ${errors.country ? 'error' : ''}`} id="country" />
                  {errors.country && <p className="form-error">{errors.country.message}</p>}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-accent btn-lg w-full checkout-pay-btn" disabled={isLoading || isProcessing} id="pay-button">
              <HiLockClosed />
              {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>

          {}
          <div className="checkout-summary card-glass">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.variant?.sku}`} className="checkout-item">
                  <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="checkout-item-image" />
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {item.variant?.color} {item.variant?.size && `/ ${item.variant.size}`} × {item.quantity}
                    </p>
                  </div>
                  <span className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Tax (18% GST)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
