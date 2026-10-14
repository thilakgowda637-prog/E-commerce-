import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, itemsTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Your cart</h1>
        <p className="status-text">Your cart is empty. <Link to="/">Browse products</Link>.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.product}>
              <img src={item.imageUrl || ''} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)} each</p>
              </div>
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.product, Math.max(1, Math.min(item.stock, Number(e.target.value))))
                }
              />
              <span className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
              <button className="btn-ghost" onClick={() => removeFromCart(item.product)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Items total</span>
            <span>${itemsTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{itemsTotal > 100 ? 'Free' : '$9.99'}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${(itemsTotal + (itemsTotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
          </div>
          <button className="btn-primary full-width" onClick={handleCheckout}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
