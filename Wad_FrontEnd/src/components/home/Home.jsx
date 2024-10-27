  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import logo from '../../assets/Images/1.png'; // Import the logo

  function Home() {
    const navigate = useNavigate();

    // Handle navigation for buttons
    const handleNavigation = () => {
      navigate('/role-selection');
    };

    return (
      <div className="d-flex flex-column min-vh-100 bg-light">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
          <img src={logo} alt="CSE Department Logo" style={{ width: '150px' }} />
          <button className="btn" style={{ backgroundColor: '#ff7e39', color: 'white' }} onClick={handleNavigation}>
            Login
          </button>
        </header>

        {/* Body */}
        <div className="d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 py-5">
          <h1 className="display-4 fw-bold" style={{ color: '#ff7e39' }}>CSE Department Expenses</h1>
          <p className="lead text-muted">Optimize Management, Empower Decisions.</p>
          <p className="text-muted">Simplify your financial processes, boost productivity, and drive informed decision-making.</p>
          <button className="btn btn-lg mt-4" style={{ backgroundColor: '#ff7e39', color: 'white' }} onClick={handleNavigation}>
            Get Started
          </button>
        </div>

        {/* Footer */}
        <footer className="bg-white py-3 text-center">
          <small>© 2024 CSE Department | All Rights Reserved</small>
        </footer>
      </div>
    );
  }

  export default Home;
