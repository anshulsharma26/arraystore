import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../features/products/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/ui/Loader';
import { HiArrowRight, HiSparkles, HiShieldCheck, HiTruck, HiCreditCard } from 'react-icons/hi2';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts({ limit: 8, sort: '-averageRating' }));
  }, [dispatch]);

  return (
    <div className="home-page">
      {}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <HiSparkles /> New Season Collection
            </div>
            <h1 className="hero-title">
              Discover Your <br />
              <span className="hero-gradient">Perfect Style</span>
            </h1>
            <p className="hero-subtitle">
              Curated collections from the world's finest brands. Premium quality, timeless designs, 
              delivered to your doorstep.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Collection <HiArrowRight />
              </Link>
              <Link to="/products?category=Electronics" className="btn btn-secondary btn-lg">
                Shop Electronics
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-glow"></div>
      </section>

      {}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <HiTruck className="feature-icon" />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above ₹500</p>
              </div>
            </div>
            <div className="feature-item">
              <HiShieldCheck className="feature-icon" />
              <div>
                <h4>Secure Payments</h4>
                <p>Razorpay protected</p>
              </div>
            </div>
            <div className="feature-item">
              <HiCreditCard className="feature-icon" />
              <div>
                <h4>Easy Returns</h4>
                <p>30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Top Rated Products</h2>
              <p className="section-subtitle">Hand-picked favorites from our collection</p>
            </div>
            <Link to="/products" className="btn btn-secondary">
              View All <HiArrowRight />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid-products">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="grid-products stagger">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card card-glass">
            <div className="cta-content">
              <h2>Ready to Upgrade Your Wardrobe?</h2>
              <p>Browse our full collection of premium products from top brands worldwide.</p>
              <Link to="/products" className="btn btn-accent btn-lg">
                Start Shopping <HiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
