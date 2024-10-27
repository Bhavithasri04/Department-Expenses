import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import { BsFillFileArrowUpFill, BsListUl, BsBellFill,BsPersonFill } from 'react-icons/bs';
import logo from '../../assets/Images/1.png'; 
import budget from '../../assets/Images/new.png';

const NewExpense = () => {
  const [userData, setUserData] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(''); // New state for event date
  const [budgetProposalDate, setBudgetProposalDate] = useState(''); // New state for budget proposal date
  const [totalBudget, setTotalBudget] = useState(''); // New state for total budget
  const [breakdown, setBreakdown] = useState([{ item: '', cost: '' }]); // State for budget breakdown
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(profileResponse.data);
      } catch (err) {
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleBreakdownChange = (index, event) => {
    const newBreakdown = [...breakdown];
    newBreakdown[index][event.target.name] = event.target.value;
    setBreakdown(newBreakdown);
  };

  const addBreakdownRow = () => {
    const lastRow = breakdown[breakdown.length - 1];
    // Check if the last row is complete
    if (lastRow.item && lastRow.cost) {
      setBreakdown([...breakdown, { item: '', cost: '' }]);
    } else {
      alert('Please complete the current item before adding a new one.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate that the event date is after the budget proposal date
    if (new Date(eventDate) <= new Date(budgetProposalDate)) {
      setError('Event date must be after the budget proposal date.');
      return;
    }
  
    // Log user data and token for debugging
    console.log('Submitting proposal with user ID:', userData ? userData._id : 'No user data');
    console.log('Token:', localStorage.getItem('token'));
  
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/events/proposals', {
        userId: userData._id,
        eventName,
        eventDescription,
        eventDate,
        totalBudget,
        breakdown,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Log the response for debugging
      console.log('Response from server:', response.data);
      
      alert('Expense proposal submitted successfully!');
      navigate('/faculty-profile');
    } catch (err) {
      console.error('Submission error:', err); // Log the error for debugging
      setError('Failed to submit expense proposal. ' + (err.response?.data?.message || ''));
    }
  };
  

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
                  <span>Profile</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => navigate('/new-expense')}
                >
                  <BsFillFileArrowUpFill className="me-2" size={25} />
                  <span>New Expense</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center"
                  onClick={() => navigate('/submissions')}
                >
                  <BsFillFileArrowUpFill className="me-2" size={25} />
                  <span>Submissions</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Form */}
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-3">
        <div className="card border-0 shadow col-11"> {/* Adjusted width to accommodate table */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="eventName" className="form-label">Event Name</label>
                <input
                  type="text"
                  id="eventName"
                  className="form-control"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="eventDescription" className="form-label">Event Description</label>
                <textarea
                  id="eventDescription"
                  className="form-control"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  required
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="budgetProposalDate" className="form-label">Budget Proposal Date</label>
                <input
                  type="date"
                  id="budgetProposalDate"
                  className="form-control"
                  value={budgetProposalDate}
                  onChange={(e) => setBudgetProposalDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="eventDate" className="form-label">Event Date</label>
                <input
                  type="date"
                  id="eventDate"
                  className="form-control"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="totalBudget" className="form-label">Expected Total Budget (₹)</label>
                <input
                  type="number"
                  id="totalBudget"
                  className="form-control"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  required
                />
              </div>

              {/* Breakdown Budget Table */}
              <div className="mb-3">
                <label className="form-label">Breakdown Budget</label>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Cost (₹)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            name="item"
                            className="form-control"
                            value={row.item}
                            onChange={(e) => handleBreakdownChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="cost"
                            className="form-control"
                            value={row.cost}
                            onChange={(e) => handleBreakdownChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              const newBreakdown = breakdown.filter((_, i) => i !== index);
                              setBreakdown(newBreakdown);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn btn-secondary" onClick={addBreakdownRow}>
                  Add Item
                </button>
              </div>

              <div className="mb-3 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: '#ff7e39', color: 'white' }}
                >
                  <BsFillFileArrowUpFill className="me-2" />
                  Submit Proposal
                </button>
              </div>
            </form>
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

export default NewExpense;
