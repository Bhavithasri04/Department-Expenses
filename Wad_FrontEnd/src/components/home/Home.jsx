// src/components/home/Home.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/Images/logo.png'; 
import home from '../../assets/Images/home.png'; 

function Home() {
  const navigate = useNavigate();

  // This single function now handles all logins
  const handleLogin = () => {
    navigate('/login'); // Points to the unified login page
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
        <img src={logo} alt="Logo" style={{ width: '130px' }} />
        <div>
          {/* UPDATED: This button now goes to the unified login page */}
          <button className="btn me-2" style={{ backgroundColor: '#1B4A56', color: 'white', width: '130px', height: '45px' }} onClick={handleLogin}>
            Login
          </button>
        </div>
      </header>

      {/* Main Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          {/* left Column: Text and Buttons */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <h1 className="fw-bold" style={{ color: '#323B60', fontSize: '2.8rem' }}>
              Simplifying Budget Management
            </h1>
            <p className="lead text-muted">
              Submit Expenses | Track Budgets<br />
              Empower Decisions
            </p>
            <div>
              {/* UPDATED: Both buttons now go to the same unified login page */}
              <button className="btn me-2" style={{backgroundColor: '#1B4A56', color: 'white', width: '200px', height: '50px' }} onClick={handleLogin}>
                Login as Faculty
              </button>
              <button className="btn" style={{ backgroundColor: '#ff914d', color: 'white', width: '200px', height: '50px' }} onClick={handleLogin}>
                Login as Admin
              </button>
            </div>
          </div>

          {/* right Column: Image */}
          <div className="col-12 col-md-6 text-center">
            <img src={home} alt="Budget Management" style={{ width: '500px', height: '400px' }} />
          </div>
        </div>
      </div>

      {/* ... the rest of your homepage JSX remains exactly the same ... */}
       <div className="container text-center">
        <div className="row g-4">
          <div className="col-6 col-md-3">
            <div>
              <i className="bi bi-file-earmark-arrow-up" style={{ fontSize: '3rem', color: '#1B4A56' }}></i>
              <h5 className="mt-2">Submit Expenses</h5>
              <p className="text-muted small">Track and categorize all department spending.</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div>
              <i className="bi bi-person-check" style={{ fontSize: '3rem', color: '#1B4A56' }}></i>
              <h5 className="mt-2">Admin Approvals</h5>
              <p className="text-muted small">Quick and secure proposal approvals.</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div>
              <i className="bi bi-file-earmark-bar-graph" style={{ fontSize: '3rem', color: '#1B4A56' }}></i>
              <h5 className="mt-2">Real Time Tracking</h5>
              <p className="text-muted small">Monitor your event or project budgets easily.</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div>
              <i className="bi bi-piggy-bank" style={{ fontSize: '3rem', color: '#1B4A56' }}></i>
              <h5 className="mt-2">Detailed Reports</h5>
              <p className="text-muted small">Export expense reports for audit or review.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold" style={{ color: '#323B60' }}>How It Works</h2>
          <div className="row mt-4 g-4">
            <div className="col-12 col-md-4 d-flex">
              <div className="p-4 shadow-sm rounded d-flex flex-column h-100">
                <i className="bi bi-arrow-up-right-square-fill" style={{ fontSize: '3rem', color: '#1B4A56' }}></i>
                <h5 className="mt-3">Faculty Submits Expense Proposal</h5>
              </div>
            </div>
            <div className="col-12 col-md-4 d-flex">
              <div className="p-4 shadow-sm rounded d-flex flex-column h-100">
                <i className="bi bi-person-fill-up" style={{ fontSize: '3rem', color: '#1B4A56' }}></i>
                <h5 className="mt-3">Admin Reviews and Approves/Rejects</h5>
              </div>
            </div>
            <div className="col-12 col-md-4 d-flex">
              <div className="p-4 shadow-sm rounded d-flex flex-column h-100">
                <i className="bi bi-clipboard-data" style={{ fontSize: '3rem', color: '#1B4A56' }}></i>
                <h5 className="mt-3">Budget Updates and Reporting Available</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white py-3 text-center mt-auto">
        <small>© 2025 CSE Department | All Rights Reserved</small>
      </footer>
    </div>
  );
}

export default Home;