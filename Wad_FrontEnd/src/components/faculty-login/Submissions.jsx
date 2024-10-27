import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillFileCheckFill, BsListUl, BsPersonFill } from 'react-icons/bs';
import logo from '../../assets/Images/1.png';

const Submissions = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/events/proposals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBudgets(response.data);
      } catch (err) {
        if (err.response) {
          setError(`Error: ${err.response.data.message}`); // Improved error message
        } else {
          setError('Failed to fetch budgets.'); // Fallback error message
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgets();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
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
              style={{ width: '200px', zIndex: 1050 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex flex-column">
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/faculty-profile')}
                >
                  <BsPersonFill className="me-2" size={25} />
                  <span>Edit Profile</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/new-expense')}
                >
                  <BsFillFileCheckFill className="me-2" size={25} />
                  <span>New Expense</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center"
                  onClick={() => navigate('/submissions')}
                >
                  <BsFillFileCheckFill className="me-2" size={25} />
                  <span>Submissions</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Submissions Content */}
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-3">
        <div className="card border-0 shadow w-75">
          <div className="card-body">
            <h3 className="text-center mb-4">Accepted and Rejected Expenses</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Description</th>
                  <th>Event Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{budget.eventName}</td>
                    <td>{budget.eventDescription}</td>                    
                    <td>{budget.eventDate}</td>
                    <td>₹{budget.totalBudget}</td>
                    <td>
                      <span className={`badge ${budget.status === 'accepted' ? 'bg-success' : budget.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                        {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Submissions;
