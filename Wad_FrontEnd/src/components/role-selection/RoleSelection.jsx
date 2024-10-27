import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/Images/1.png'; 
import AdminLogo from '../../assets/Images/Ad.png';
import FacultyLogo from '../../assets/Images/Fa.png';

function RoleSelection() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  const handleFacultyLogin = () => {
    navigate('/faculty-login');
  };

  // Add a navigation to the Home page
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
        <img src={logo} alt="CSE Department Logo" style={{ width: '150px' }} />
        <button className="btn" style={{ backgroundColor: '#ff7e39', color: 'white' }} onClick={handleGoHome}>
          Home
        </button>
      </header>

      {/* Body */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 py-3">
        <div className="row w-75">
          {/* Card for Admin Login */}
          <div className="col-md-6 mb-4 d-flex justify-content-center">
            <div className="card border-0 shadow" style={{ width: '80%', borderRadius: '0px' }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center" style={{ padding: '10px' }}>
                <img src={AdminLogo} alt="Admin Logo" style={{ width: '250px', height: '200px', marginBottom: '10px' }} /> {/* Larger image for Admin */}
                <button
                  className="btn w-100"
                  style={{
                    backgroundColor: '#ff7e39',
                    color: 'white',
                    borderRadius: '15px',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    fontSize: '30px', // Increase font size for a bigger button
                    padding: '30px 0', // Increased padding for bigger button
                    margin: '0', // Remove margin to reduce spacing with white box
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#e06a2f')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff7e39')}
                  onClick={handleAdminLogin}
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
          {/* Card for Faculty Login */}
          <div className="col-md-6 mb-4 d-flex justify-content-center">
            <div className="card border-0 shadow" style={{ width: '80%', borderRadius: '0px' }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center" style={{ padding: '10px' }}>
                <img src={FacultyLogo} alt="Faculty Logo" style={{ width: '250px', height: '200px', marginBottom: '10px' }} /> {/* Larger image for Faculty */}
                <button
                  className="btn w-100"
                  style={{
                    backgroundColor: '#ff7e39',
                    color: 'white',
                    borderRadius: '15px',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    fontSize: '30px', // Increase font size for a bigger button
                    padding: '30px 0', // Increased padding for bigger button
                    margin: '0', // Remove margin to reduce spacing with white box
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#e06a2f')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff7e39')}
                  onClick={handleFacultyLogin}
                >
                  Faculty Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-3 text-center">
        <small>© 2024 CSE Department | All Rights Reserved</small>
      </footer>
    </div>
  );
}

export default RoleSelection;
