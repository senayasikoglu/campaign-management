import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import HomePage from './components/homepage/homepage';
import CampaignForm from './components/campaign/form';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { AuthProvider, useAuth } from './context/auth';


const AuthenticatedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { token } = useAuth();
  
  return (
    <div className="App">
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AuthenticatedRoute><HomePage /></AuthenticatedRoute>} />
        <Route path="/campaign/add" element={<AuthenticatedRoute><CampaignForm /></AuthenticatedRoute>} />
        <Route path="/campaign/update/:id" element={<AuthenticatedRoute><CampaignForm /></AuthenticatedRoute>} />
      </Routes>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App; 