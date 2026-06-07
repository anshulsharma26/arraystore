import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '../../features/orders/orderSlice';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import './AdminPages.css';

const OrderManagePage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(getAllOrders()); }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      toast.success(`Order updated to ${status}`);
    } catch (err) { toast.error(err || 'Update failed'); }
  };

  const getStatusClass = (s) => {
    if (s === 'Paid' || s === 'Shipped') return 'badge-success';
    if (s === 'Failed') return 'badge-danger';
    return 'badge-warning';
  };

  if (isLoading) return <div className="page"><Loader text="Loading orders..." /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>

        <div className="admin-table-wrap card-glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td><Link to={`/orders/${o._id}`} className="text-primary">#{o._id.slice(-8).toUpperCase()}</Link></td>
                  <td>{o.user?.name || 'N/A'}<br /><span className="text-muted" style={{ fontSize: '0.78rem' }}>{o.user?.email}</span></td>
                  <td>{o.items?.length}</td>
                  <td className="price">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><span className={`badge ${getStatusClass(o.status)}`}>{o.status}</span></td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="form-select"
                      style={{ minWidth: 120, padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagePage;
