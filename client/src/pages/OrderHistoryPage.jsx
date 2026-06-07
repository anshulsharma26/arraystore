import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../features/orders/orderSlice';
import Loader from '../components/ui/Loader';
import { HiEye, HiShoppingBag } from 'react-icons/hi2';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(getMyOrders()); }, [dispatch]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid': return 'badge-success';
      case 'Shipped': return 'badge-info';
      case 'Failed': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  if (isLoading) return <div className="page"><Loader text="Loading orders..." /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><HiShoppingBag size={64} /></div>
            <h3 className="empty-state-title">No orders yet</h3>
            <p className="empty-state-text">Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="orders-list stagger">
            {orders.map((order) => (
              <div key={order._id} className="order-card card">
                <div className="order-card-header">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
                </div>
                <div className="order-card-items">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <img key={idx} src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="order-item-thumb" />
                  ))}
                  {order.items.length > 3 && <div className="order-item-more">+{order.items.length - 3}</div>}
                </div>
                <div className="order-card-footer">
                  <span className="order-total">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                  <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                    <HiEye size={14} /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
