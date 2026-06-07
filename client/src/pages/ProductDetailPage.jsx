import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, clearProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import VariantSelector from '../components/product/VariantSelector';
import Loader from '../components/ui/Loader';
import { HiStar, HiShoppingCart, HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, isLoading } = useSelector((state) => state.products);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(getProductById(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    if (selectedVariant.stock === 0) {
      toast.error('This variant is out of stock');
      return;
    }

    dispatch(
      addToCart({
        product: product._id,
        variant: {
          size: selectedVariant.size,
          color: selectedVariant.color,
          sku: selectedVariant.sku,
        },
        quantity,
        name: product.name,
        image: product.images?.[0] || '',
        price: selectedVariant.price,
      })
    );

    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#1e293b',
        color: '#f8fafc',
        border: '1px solid rgba(255,255,255,0.08)',
      },
      iconTheme: {
        primary: '#6366f1',
        secondary: '#fff',
      },
    });
  };

  if (isLoading || !product) {
    return (
      <div className="page flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <Loader text="Loading product..." />
      </div>
    );
  }

  const displayPrice = selectedVariant?.price || product.basePrice;
  const isOutOfStock = selectedVariant && selectedVariant.stock === 0;
  const canAddToCart = selectedVariant && selectedVariant.stock > 0;

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-ghost mb-lg" onClick={() => navigate(-1)}>
          <HiArrowLeft /> Back
        </button>

        <div className="product-detail">
          {}
          <div className="product-images">
            <div className="product-main-image">
              <img
                src={product.images?.[activeImage] || 'https://via.placeholder.com/600x600'}
                alt={product.name}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`product-thumb ${activeImage === idx ? 'active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="product-info">
            <div className="product-info-header">
              <span className="badge badge-primary">{product.category}</span>
              <p className="product-brand">{product.brand}</p>
            </div>

            <h1 className="product-name">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <HiStar
                    key={i}
                    size={18}
                    style={{ opacity: i < Math.round(product.averageRating) ? 1 : 0.25 }}
                  />
                ))}
              </div>
              <span className="text-muted">
                {product.averageRating} ({product.numReviews} reviews)
              </span>
            </div>

            <div className="product-price-display">
              <span className="product-current-price">₹{displayPrice.toLocaleString('en-IN')}</span>
              {selectedVariant && selectedVariant.price !== product.basePrice && (
                <span className="price-original">₹{product.basePrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {}
            {product.variants?.length > 0 && (
              <VariantSelector
                variants={product.variants}
                onVariantSelect={setSelectedVariant}
              />
            )}

            {}
            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!canAddToCart}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))
                  }
                  disabled={!canAddToCart}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary btn-lg product-add-btn"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                id="add-to-cart-button"
              >
                <HiShoppingCart />
                {isOutOfStock ? 'Out of Stock' : !selectedVariant ? 'Select a Variant' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
