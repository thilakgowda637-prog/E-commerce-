import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const emptyForm = { name: '', description: '', price: '', category: '', imageUrl: '', stock: '' };

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    api
      .get('/products', { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.products))
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      setError('Could not delete product.');
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <button
          className="btn-primary-sm"
          onClick={() => {
            resetForm();
            setShowForm((s) => !s);
          }}
        >
          {showForm ? 'Cancel' : '+ Add product'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input name="price" type="number" step="0.01" min="0" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input name="stock" type="number" min="0" placeholder="Stock quantity" value={form.stock} onChange={handleChange} required />
            <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} className="span-2" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="span-2" />
          </div>
          <button className="btn-primary" type="submit">{editingId ? 'Update product' : 'Create product'}</button>
        </form>
      )}

      {error && <p className="status-text error">{error}</p>}
      {loading ? (
        <p className="status-text">Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td className="admin-actions">
                  <button className="btn-ghost" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn-ghost danger" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProducts;
