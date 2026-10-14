import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const loadOrders = () => {
    setLoading(true);
    const params = { limit: 100 };
    if (filter) params.status = filter;
    api
      .get('/orders', { params })
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      loadOrders();
    } catch (err) {
      setError('Could not update order status.');
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="status-text error">{error}</p>}
      {loading ? (
        <p className="status-text">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="status-text">No orders found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-8)}</td>
                <td>{o.user?.name || 'N/A'}<br /><span className="muted">{o.user?.email}</span></td>
                <td>{o.items.length} item(s)</td>
                <td>${o.totalAmount.toFixed(2)}</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrders;
