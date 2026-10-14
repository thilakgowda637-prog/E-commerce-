import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Shop<span>Easy</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Catalog</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          {user && user.role !== 'admin' && <Link to="/orders">My Orders</Link>}
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn-ghost" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <div className="user-menu">
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary-sm">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
