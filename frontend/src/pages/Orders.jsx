import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';

const statusColors = {
  pending: 'status-pending',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1>My orders</h1>

      {location.state?.justPlaced && (
        <p className="status-text success">
          Order placed successfully! Order ID: {location.state.justPlaced}
        </p>
      )}

      {loading && <p className="status-text">Loading...</p>}
      {error && <p className="status-text error">{error}</p>}
      {!loading && orders.length === 0 && <p className="status-text">You haven't placed any orders yet.</p>}

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-card-header">
              <div>
                <strong>Order #{order._id.slice(-8)}</strong>
                <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className={`status-pill ${statusColors[order.status]}`}>{order.status}</span>
            </div>
            <ul className="order-items">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="order-card-footer">
              <span>Total: <strong>${order.totalAmount.toFixed(2)}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
