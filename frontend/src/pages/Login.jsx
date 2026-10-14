import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      const dest = location.state?.from || (user.role === 'admin' ? '/admin' : '/');
      navigate(dest);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="status-text error">{error}</p>}
        <button className="btn-primary full-width" type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
        <p className="auth-switch">
          No account? <Link to="/register">Sign up</Link>
        </p>
        <p className="auth-hint">Demo admin: admin@example.com / admin123</p>
        <p className="auth-hint">Demo user: user@example.com / user1234</p>
      </form>
    </div>
  );
};

export default Login;
