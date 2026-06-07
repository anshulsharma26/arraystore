import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../schemas/loginSchema';
import { login, resetAuthState } from '../features/auth/authSlice';
import { syncCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';
import './AuthPages.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(resetAuthState());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(syncCart());
      navigate('/');
    }
  }, [user, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(login({ email: data.email, password: data.password }));
  };

  return (
    <div className="auth-page page">
      <div className="auth-container animate-fade-in">
        <div className="auth-card card-glass">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your ArrayStore account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                id="email"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                {...register('password')}
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                id="password"
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <Link to="/forgot-password" className="auth-forgot-link">
              Forgot your password?
            </Link>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading} id="login-submit">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
