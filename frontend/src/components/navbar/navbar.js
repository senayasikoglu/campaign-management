import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
       <div className="navbar-brand">
        <Link to="/">Marketing Dashboard</Link>
      </div>
   
      {token && (
        <div className="navbar-right">
          <span className="welcome-text">Welcome, {user?.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 