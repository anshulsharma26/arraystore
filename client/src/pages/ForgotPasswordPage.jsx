import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordThunk, resetAuthState } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(resetAuthState());
    }
    if (isError && message) {
      toast.error(message);
      dispatch(resetAuthState());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    dispatch(forgotPasswordThunk(email));
  };

  return (
    <div className="auth-page page">
      <div className="auth-container animate-fade-in">
        <div className="auth-card card-glass">
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p>Enter your email and we'll send you a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
                id="email"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
