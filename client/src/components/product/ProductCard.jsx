import { Link } from 'react-router-dom';
import { HiStar } from 'react-icons/hi2';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : product.basePrice;

  const maxPrice = product.variants?.length
    ? Math.max(...product.variants.map((v) => v.price))
    : product.basePrice;

  const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;

  return (
    <Link to={`/products/${product._id}`} className="product-card" id={`product-${product._id}`}>
      <div className="product-card-image-wrapper">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {totalStock === 0 && (
          <div className="product-card-overlay">
            <span className="badge badge-danger">Out of Stock</span>
          </div>
        )}
        <div className="product-card-category">
          <span className="badge badge-primary">{product.category}</span>
        </div>
      </div>
      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                size={14}
                style={{ opacity: i < Math.round(product.averageRating) ? 1 : 0.25 }}
              />
            ))}
          </div>
          <span className="product-card-reviews">({product.numReviews})</span>
        </div>
        <div className="product-card-price">
          <span className="price">₹{minPrice.toLocaleString('en-IN')}</span>
          {maxPrice > minPrice && (
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {' '}- ₹{maxPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <div className="product-card-variants-count">
          {product.variants?.length > 0 && (
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              {product.variants.length} variants
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
