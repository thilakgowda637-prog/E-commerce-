import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const outOfStock = product.stock <= 0;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-placeholder">No image</div>
        )}
        {outOfStock && <span className="badge-out">Out of stock</span>}
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
