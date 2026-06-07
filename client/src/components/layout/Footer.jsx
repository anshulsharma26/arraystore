import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">◆</span>
              <span className="logo-text">ArrayStore</span>
            </Link>
            <p className="footer-desc">
              Premium shopping experience with curated collections from the world's finest brands.
            </p>
          </div>
          <div className="footer-links">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=Shoes">Shoes</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Jackets">Jackets</Link>
          </div>
          <div className="footer-links">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/orders">Order History</Link>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Shipping Info</a>
            <a href="#">Returns</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ArrayStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
