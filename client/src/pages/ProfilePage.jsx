import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, resetAuthState } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { HiUser } from 'react-icons/hi2';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    if (password && password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password && password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    const updates = { name, email };
    if (password) updates.password = password;
    dispatch(updateUserProfile(updates));
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="page-header text-center">
          <div className="profile-avatar-lg">
            <HiUser size={32} />
          </div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">{user?.email}</p>
          <span className="badge badge-primary mt-sm">{user?.role}</span>
        </div>

        <div className="card-glass" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" id="name" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" id="email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">New Password (leave blank to keep current)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" id="password" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" placeholder="••••••••" id="confirmPassword" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
