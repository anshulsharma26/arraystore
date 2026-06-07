import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../features/orders/orderSlice';
import Loader from '../components/ui/Loader';
import { HiArrowLeft } from 'react-icons/hi2';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, isLoading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(getOrderById(id)); }, [dispatch, id]);

  const getStatusClass = (s) => {
    if (s === 'Paid') return 'badge-success';
    if (s === 'Shipped') return 'badge-info';
    if (s === 'Failed') return 'badge-danger';
    return 'badge-warning';
  };

  if (isLoading || !order) return <div className="page"><Loader text="Loading order..." /></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <button className="btn btn-ghost mb-lg" onClick={() => navigate(-1)}><HiArrowLeft /> Back</button>
        <div className="card-glass" style={{ padding: '2rem' }}>
          <div className="flex justify-between items-center mb-lg">
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
          </div>

          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.name}</p>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>{item.variant?.color} {item.variant?.size && `/ ${item.variant.size}`} × {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Shipping Address</h3>
              <div style={{ padding: '1rem', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Price Summary</h3>
              <div style={{ padding: '1rem', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div className="summary-row"><span>Items</span><span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span></div>
                <div className="summary-row"><span>Tax</span><span>₹{order.taxPrice?.toLocaleString('en-IN')}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span></div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-total"><span>Total</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
