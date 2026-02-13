import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import api from '../../utils/api';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send login request to backend
      const response = await api.post('/auth/login', {email,password});
        
      if (response.data && response.data.token) {
        login(response.data.token,response.data.user);
        console.log('Token saved:', response.data.token);
        navigate('/');
      } else {
        setError('Invalid response from server: No token received');
      }
    } catch (error) {
        
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
     

        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          Don't have an account? <a onClick={() => navigate('/register')}>Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login; 