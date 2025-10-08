// src/components/faculty-login/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/Images/slogo.png'; 

// Component renamed to "Login" for clarity
function Login() { 
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password }),
      });
  
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        
        // This is the correct logic for redirection
        if (data.forcePasswordChange) {
          navigate('/force-change-password');
        } else if (data.role === 'Admin') {
          navigate('/admin-dashboard'); // Redirect Admin
        } else {
          navigate('/faculty-dashboard'); // Redirect Faculty
        }
      } else {
        alert(data.message || 'Invalid credentials.');
      }
    } catch (error) {
      alert('Error during login. Please check the server connection.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <header className="d-flex justify-content-between align-items-center p-1 bg-white shadow-sm">
        <img src={logo} alt="Logo" style={{ width: '200px', marginLeft: '40px'}} />
        <button className="btn btn-outline-secondary me-4" onClick={() => navigate('/')}>Home</button>
      </header>
      <div className="d-flex flex-column align-items-center text-center flex-grow-1" style={{ marginTop: '100px' }}>
        <h1>Portal Login</h1>
        <form onSubmit={handleLogin} className="w-50">
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn w-100" style={{ backgroundColor: '#1B4A56', color: 'white' }}>
            Login
          </button>
        </form>
      </div>
      <footer className="bg-white py-3 text-center">
        <small>© 2024 CSE Department | All Rights Reserved</small>
      </footer>
    </div>
  );
}

export default Login;