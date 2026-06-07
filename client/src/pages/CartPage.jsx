import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import { HiTrash, HiArrowRight, HiShoppingBag } from 'react-icons/hi2';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const shipping = subtotal > 500 ? 0 : 49;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">
              <HiShoppingBag size={64} />
            </div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-text">Start shopping to add items to your cart.</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products <HiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item, idx) => (
              <div key={`${item.product}-${item.variant?.sku}`} className="cart-item card animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="cart-item-image">
                  <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="cart-item-image" />
                </div>
                <div className="cart-item-info">
                  <Link to={`/products/${item.product}`} className="cart-item-name">{item.name}</Link>
                  {item.variant && (
                    <p className="cart-item-variant">
                      {item.variant.color && `Color: ${item.variant.color}`}
                      {item.variant.color && item.variant.size && ' · '}
                      {item.variant.size && `Size: ${item.variant.size}`}
                    </p>
                  )}
                  <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        dispatch(updateQuantity({ product: item.product, sku: item.variant?.sku, quantity: Math.max(1, item.quantity - 1) }))
                      }
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        dispatch(updateQuantity({ product: item.product, sku: item.variant?.sku, quantity: item.quantity + 1 }))
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => dispatch(removeFromCart({ product: item.product, sku: item.variant?.sku }))}
                    title="Remove"
                  >
                    <HiTrash size={18} className="text-danger" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card-glass">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Tax (18% GST)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg w-full mt-md" id="checkout-button">
              Proceed to Checkout <HiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
