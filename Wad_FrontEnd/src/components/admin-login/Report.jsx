import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsListUl, BsPersonFill, BsFillFileArrowUpFill } from 'react-icons/bs';
import logo from '../../assets/Images/1.png';

const AdminReports = () => {
  const [approvedProposals, setApprovedProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Fetch approved proposals
  useEffect(() => {
    const fetchApprovedProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/events/approved-proposals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovedProposals(response.data);
      } catch (error) {
        setError('Failed to fetch approved proposals.');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedProposals();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light" onClick={closeSidebar}>
      <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
        <img src={logo} alt="CSE Department Logo" style={{ width: '150px' }} />
        <div className="position-relative">
          <button
            className="btn d-flex align-items-center justify-content-center"
            style={{ backgroundColor: '#ff7e39', color: 'white', padding: '0.5rem 1rem' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
          >
            <BsListUl size={30} />
          </button>
          {/* Sidebar */}
          {sidebarOpen && (
            <div
              className="bg-white border shadow-sm position-absolute end-0 mt-2 p-3"
              style={{ width: '250px', zIndex: 1050 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex flex-column">
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/admin-profile')}
                >
                  <BsPersonFill className="me-2" size={25} />
                  <span>Profile</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/report')}
                >
                  <BsFillFileArrowUpFill className="me-2" size={25} />
                  <span>Admin Approved</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/adminrejected')}
                >
                  <BsFillFileArrowUpFill className="me-2" size={25} />
                  <span>Admin Rejected</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-3">
        <div className="card border-0 shadow col-11">
          <div className="card-body">
            <h3>Approved Proposals</h3>
            <ul className="list-group">
              {approvedProposals.map((proposal) => (
                <li key={proposal._id} className="list-group-item">
                  <h5>{proposal.eventName}</h5>
                  <p>{proposal.eventDescription}</p>
                  <p><strong>Event Date:</strong> {new Date(proposal.eventDate).toLocaleDateString()}</p>
                  <p><strong>Total Budget:</strong> ₹{proposal.totalBudget}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="bg-white py-3 text-center">
        <small>© 2024 CSE Department | All Rights Reserved</small>
      </footer>
    </div>
  );
};

export default AdminReports;
