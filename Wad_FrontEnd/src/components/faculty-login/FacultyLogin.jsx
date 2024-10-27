import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/Images/1.png'; 

function FacultyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    console.log('Login Request:', { email, password }); // Debugging line
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        navigate('/faculty-profile');
      } else {
        console.error('Login failed:', response.statusText);
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login. Please try again later.');
    }
  };
  

  const handleSignUp = () => {
    navigate('/faculty-signup');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
        <img src={logo} alt="CSE Department Logo" style={{ width: '150px' }} />
      </header>

      {/* Body */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 py-3">
        <h1>Faculty Login</h1>
        <form onSubmit={handleLogin} className="w-75">
          <div className="mb-3">
            <input
              type="email"
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
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <div className="mt-3">
            <small>
              Don't have an account? 
              <span 
                style={{ color: '#ff7e39', cursor: 'pointer' }} 
                onClick={handleSignUp}
              >
                {' '}Sign Up
              </span>
            </small>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-white py-3 text-center">
        <small>© 2024 CSE Department | All Rights Reserved</small>
      </footer>
    </div>
  );
}

export default FacultyLogin;
