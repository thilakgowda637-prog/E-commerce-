import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products/meta/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page, limit: 12 };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setPages(data.pages);
      } catch (err) {
        setError('Could not load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setKeyword(e.target.elements.search.value.trim());
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Everything you need, in one cart.</h1>
        <p>Browse the catalog, add what you like, checkout in seconds.</p>
      </section>

      <div className="toolbar">
        <form onSubmit={handleSearch} className="search-form">
          <input name="search" type="text" placeholder="Search products..." defaultValue={keyword} />
          <button type="submit" className="btn-primary-sm">Search</button>
        </form>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <p className="status-text">Loading products...</p>}
      {error && <p className="status-text error">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="status-text">No products found.</p>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Home;
