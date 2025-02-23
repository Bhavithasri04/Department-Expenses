import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsListUl, BsPersonFill, BsFileEarmarkTextFill, BsCheckSquareFill, BsFillXSquareFill, BsFillArrowRightSquareFill } from 'react-icons/bs';
import logo from '../../assets/Images/1.png';

const AdminProfile = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  // Fetching budget proposals from the backend API
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:5000/api/events/proposals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pendingProposals = response.data.filter(proposal => proposal.status === 'Pending');
        setProposals(pendingProposals);
      } catch (err) {
        setError('Failed to fetch proposals.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Accept budget proposal
  const handleAcceptProposal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/events/proposals/${id}/accepted`, {}, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Proposal accepted!');
      setProposals(proposals.filter(proposal => proposal._id !== id)); 
    } catch (err) {
      setError('Failed to accept proposal.');
    }
  };

  // Reject budget proposal
  const handleRejectProposal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/events/proposals/${id}/rejected`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Proposal rejected!');
      setProposals(proposals.filter(proposal => proposal._id !== id));
    } catch (err) {
      setError('Failed to reject proposal.');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/admin-login'); // Redirect to login page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light" onClick={closeSidebar}>
      {/* Header */}
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
                  onClick={() => navigate('/admin-approved')}
                >
                  <BsCheckSquareFill className="me-2" size={25} /> 
                  <span>Admin Approved</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/adminrejected')}
                >
                  <BsFillXSquareFill className="me-2" size={25} /> 
                  <span>Admin Rejected</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/report')}
                >
                  <BsFileEarmarkTextFill className="me-2" size={25} /> 
                  <span>Reports</span>
                </button>
                <button
                  className="btn btn-danger d-flex align-items-center mb-3"
                  onClick={handleLogout} 
                >
                  <BsFillArrowRightSquareFill className="me-2" size={25} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Proposal List */}
      <div className="flex-column align-items-center justify-content-center flex-grow-1 py-3">
        <div className="card border-0 shadow col-11 w-100">
          <div className="card-body">
            <h3>Pending Proposals</h3>
            <ul className="list-group">
              {proposals.map((proposal, index) => (
                <React.Fragment key={proposal._id}>
                  <li className="list-group-item">
                    <h5>{proposal.eventName}</h5>
                    <p>{proposal.eventDescription}</p>
                    <p><strong>Event Date:</strong> {new Date(proposal.eventDate).toLocaleDateString()}</p>
                    <p><strong>Total Budget:</strong> ₹{proposal.totalBudget}</p>
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-success me-2" onClick={() => handleAcceptProposal(proposal._id)}>
                        Accept
                      </button>
                      <button className="btn btn-danger" onClick={() => handleRejectProposal(proposal._id)}>
                        Reject
                      </button>
                    </div>
                    {/* Toggle details for budget breakdown */}
                    <button className="btn btn-info btn-sm mt-2" onClick={() => toggleExpand(index)}>
                      {expandedIndex === index ? 'Hide Details' : 'Show Details'}
                    </button>
                  </li>
                  {/* Expanded details for budget breakdown */}
                  {expandedIndex === index && (
                    <li className="list-group-item">
                      <h5>Budget Breakdown</h5>
                      <ul>
                        {proposal.breakdown.map((item, i) => (
                          <li key={i}>
                            {item.item}: ₹{item.cost}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-3 text-center">
        <small>© 2024 CSE Department | All Rights Reserved</small>
      </footer>
    </div>
  );
};

export default AdminProfile;
