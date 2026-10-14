import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const initialAddress = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
};

const Checkout = () => {
  const { items, itemsTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ product: i.product, quantity: i.quantity }));
      const { data } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      navigate('/orders', { state: { justPlaced: data._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <p className="status-text">Your cart is empty.</p>
      </div>
    );
  }

  const shippingFee = itemsTotal > 100 ? 0 : 9.99;

  return (
    <div className="page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping address</h2>
          <div className="form-grid">
            <input name="fullName" placeholder="Full name" value={address.fullName} onChange={handleChange} required />
            <input name="phone" placeholder="Phone number" value={address.phone} onChange={handleChange} required />
            <input name="street" placeholder="Street address" value={address.street} onChange={handleChange} required className="span-2" />
            <input name="city" placeholder="City" value={address.city} onChange={handleChange} required />
            <input name="state" placeholder="State / Province" value={address.state} onChange={handleChange} required />
            <input name="zipCode" placeholder="ZIP / Postal code" value={address.zipCode} onChange={handleChange} required />
            <input name="country" placeholder="Country" value={address.country} onChange={handleChange} required />
          </div>

          <h2>Payment method</h2>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option>Cash on Delivery</option>
            <option>Credit Card</option>
            <option>UPI</option>
          </select>

          {error && <p className="status-text error">{error}</p>}

          <button className="btn-primary full-width" type="submit" disabled={submitting}>
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <div className="cart-summary">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div className="summary-row" key={item.product}>
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${(itemsTotal + shippingFee).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
