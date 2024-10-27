import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/Images/1.png';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Ensure dob is in YYYY-MM-DD format
    const formattedDob = new Date(dob).toISOString().split('T')[0];

    console.log('Logging in with:', { email, password, dob: formattedDob }); // Debugging line

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          dob: formattedDob, // Send the correctly formatted dob
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token);
        navigate('/admin-profile');
      } else {
        console.error('Login failed:', data.message);
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
        <img src={logo} alt="CSE Department Logo" style={{ width: '150px' }} />
      </header>

      {/* Body */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 py-3">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin} className="w-50">
          <div className="mb-3">
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="date"
              id="dob"
              name="dob"
              className="form-control"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: '#ff7e39',
              color: 'white',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              fontWeight: 'bold',
              fontSize: '20px',
              padding: '10px 0',
            }}
          >
            Login
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-white py-3 text-center">
        <small>© 2024 CSE Department | All Rights Reserved</small>
      </footer>
    </div>
  );
}

export default AdminLogin;
