import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../features/orders/orderSlice';
import { getProducts } from '../../features/products/productSlice';
import { HiCube, HiShoppingCart, HiCurrencyRupee, HiUsers } from 'react-icons/hi2';
import './AdminPages.css';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { total: productCount } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getProducts({ limit: 1 }));
  }, [dispatch]);

  const totalRevenue = orders.filter(o => o.status === 'Paid' || o.status === 'Shipped').reduce((acc, o) => acc + o.totalPrice, 0);
  const paidOrders = orders.filter(o => o.status === 'Paid' || o.status === 'Shipped').length;

  const stats = [
    { icon: <HiCurrencyRupee />, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#10b981' },
    { icon: <HiShoppingCart />, label: 'Total Orders', value: orders.length, color: '#6366f1' },
    { icon: <HiCube />, label: 'Products', value: productCount, color: '#f59e0b' },
    { icon: <HiUsers />, label: 'Paid Orders', value: paidOrders, color: '#3b82f6' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage your store</p>
        </div>

        <div className="admin-stats grid-4 stagger">
          {stats.map((s, i) => (
            <div key={i} className="stat-card card-glass">
              <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-quick-links grid-2 mt-xl">
          <Link to="/admin/products" className="admin-link-card card">
            <div className="card-body">
              <HiCube size={24} className="text-accent" />
              <h3>Manage Products</h3>
              <p className="text-muted">Add, edit, or remove products and variants</p>
            </div>
          </Link>
          <Link to="/admin/orders" className="admin-link-card card">
            <div className="card-body">
              <HiShoppingCart size={24} className="text-primary" />
              <h3>Manage Orders</h3>
              <p className="text-muted">View and update order statuses</p>
            </div>
          </Link>
        </div>

        {orders.length > 0 && (
          <div className="mt-xl">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Orders</h2>
            <div className="admin-table-wrap card-glass">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map(o => (
                    <tr key={o._id}>
                      <td><Link to={`/orders/${o._id}`} className="text-primary">#{o._id.slice(-8).toUpperCase()}</Link></td>
                      <td>{o.user?.name || 'N/A'}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="price">₹{o.totalPrice.toLocaleString('en-IN')}</td>
                      <td><span className={`badge ${o.status === 'Paid' || o.status === 'Shipped' ? 'badge-success' : o.status === 'Failed' ? 'badge-danger' : 'badge-warning'}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
