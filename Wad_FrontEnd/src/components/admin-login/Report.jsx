import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BsListUl, BsPersonFill, BsFileEarmarkTextFill,  BsCheckSquareFill, BsFillXSquareFill,BsFillArrowRightSquareFill } from 'react-icons/bs';
import logo from '../../assets/Images/1.png';

const Reports = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null); 
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
          setError(`Error: ${err.response.data.message}`);
        } else {
          setError('Failed to fetch budgets.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Function to format the date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Function to handle the expansion of budget breakdown
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
                  < BsCheckSquareFill className="me-2" size={25} /> 
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
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Submissions Content */}
      <div className="flex-column align-items-center justify-content-center flex-grow-1 py-2">
        <div className="card border-0 shadow w-100"style={{height:'620px'}}>
          <div className="card-body">
            <h3 className="text-center mb-4">Reports</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Description</th>
                  <th>Budget Proposal Date</th> 
                  <th>Event Date</th>
                  <th>Amount</th>
                  <th>Status</th>                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{budget.eventName}</td>
                      <td>{budget.eventDescription}</td>
                      <td>{formatDate(budget.budgetProposalDate)}</td>
                      <td>{formatDate(budget.eventDate)}</td>
                      <td>₹{budget.totalBudget}</td>
                      <td>
                        <span className={`badge ${budget.status === 'Accepted' ? 'bg-success' : budget.status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                          {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-info btn-sm" onClick={() => toggleExpand(index)}>
                          {expandedIndex === index ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedIndex === index && (
                      <tr>
                        <td colSpan="8">
                          <div className="p-2 bg-light">
                            <h5>Budget Breakdown</h5>
                            <ul>
                              {budget.breakdown.map((item, i) => (
                                <li key={i}>
                                  {item.item}: ₹{item.cost}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

export default Reports;
