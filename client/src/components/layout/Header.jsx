import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { clearCart } from '../../features/cart/cartSlice';
import { HiOutlineShoppingBag, HiOutlineUser, HiBars3, HiXMark, HiSun, HiMoon } from 'react-icons/hi2';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">ArrayStore</span>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'open' : ''}`}>
          <Link to="/products" className="nav-link" onClick={() => setMobileOpen(false)}>
            Shop
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>
              Admin
            </Link>
          )}
        </nav>

        <div className="header-actions">
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>

          <Link to="/cart" className="header-cart-btn" id="cart-button">
            <HiOutlineShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="profile-dropdown">
              <button
                className="profile-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
                id="profile-menu-button"
              >
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </button>
              {profileOpen && (
                <div className="profile-menu animate-scale-in">
                  <div className="profile-menu-header">
                    <p className="profile-menu-name">{user.name}</p>
                    <p className="profile-menu-email">{user.email}</p>
                  </div>
                  <div className="profile-menu-divider"></div>
                  <Link to="/profile" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/orders" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <div className="profile-menu-divider"></div>
                  <button className="profile-menu-item profile-menu-logout" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="login-button">
              <HiOutlineUser size={16} />
              Sign In
            </Link>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
