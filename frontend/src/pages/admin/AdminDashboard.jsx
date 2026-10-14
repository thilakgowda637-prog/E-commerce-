import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import ManageProducts from './ManageProducts';
import ManageOrders from './ManageOrders';

const AdminDashboard = () => {
  const location = useLocation();
  const isProducts = location.pathname.includes('products') || location.pathname === '/admin';

  return (
    <div className="page">
      <h1>Admin dashboard</h1>
      <div className="admin-tabs">
        <Link to="/admin/products" className={isProducts ? 'tab active' : 'tab'}>Products</Link>
        <Link to="/admin/orders" className={!isProducts ? 'tab active' : 'tab'}>Orders</Link>
      </div>

      <Routes>
        <Route index element={<ManageProducts />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="orders" element={<ManageOrders />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
