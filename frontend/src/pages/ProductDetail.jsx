import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Product not found.'));
  }, [id]);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (error) return <p className="status-text error page">{error}</p>;
  if (!product) return <p className="status-text page">Loading...</p>;

  const outOfStock = product.stock <= 0;

  return (
    <div className="page product-detail">
      <button className="btn-ghost back-btn" onClick={() => navigate(-1)}>&larr; Back</button>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="product-card-placeholder">No image</div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-card-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-desc">{product.description}</p>
          <p className={`stock-text ${outOfStock ? 'out' : 'in'}`}>
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </p>

          {!outOfStock && (
            <div className="add-to-cart-row">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))
                }
              />
              <button className="btn-primary" onClick={handleAdd}>
                {added ? 'Added ✓' : 'Add to cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
