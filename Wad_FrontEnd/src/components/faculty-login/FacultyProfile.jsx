import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsPersonFill, BsFillKeyFill, BsBoxArrowRight, BsPencilFill, BsListUl, BsFillFileArrowUpFill, BsFillFileCheckFill, BsBellFill, BsGearFill } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/Images/1.png';

const FacultyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); 
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);  // Add this
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found.');
          return;
        }

        const response = await axios.put(`http://localhost:5000/api/auth/profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data); // Update userData with the new profile info
        setEditing(false);
        setError('');
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before submission:", formData);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      await axios.put(`http://localhost:5000/api/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditing(false);
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err.response ? err.response.data : err.message);
      setError('Failed to update profile.');
    }
  };

  const togglePrivacyPolicy = () => {
    setShowPrivacyPolicy(!showPrivacyPolicy);
    setShowSettings(false);
    setEditing(false);
    setShowChangePassword(false);
    setShowDeleteAccount(false);
  };
  
  const toggleDeleteAccount = () => {
    setShowDeleteAccount(!showDeleteAccount);
    setShowSettings(false);
    setEditing(false);
    setShowChangePassword(false);
    setShowPrivacyPolicy(false);
  };
  

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = e.target.elements;

    // Basic validation
    if (newPassword.value !== confirmPassword.value) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      // Call your API to change password
      const response = await axios.put(`http://localhost:5000/api/auth/change-password`, {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data); // Handle success
      setShowChangePassword(false); // Optionally hide the form
      setError(''); // Clear any previous errors
      alert('Password changed successfully!'); // Optionally show a success message
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/faculty-login'); // Redirect to the login page (adjust the path as needed)
  };
  
  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    setShowSettings(false); 
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
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

          {sidebarOpen && (
            <div
              ref={sidebarRef}
              className="bg-white border shadow-sm position-absolute end-0 mt-2 p-3"
              style={{ width: '200px', zIndex: 1050 }}
            >
              <div className="d-flex flex-column">
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => handleNavigate('/faculty-profile')}
                >
                  <BsPersonFill className="me-2" size={25} />
                  <span>Profile</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => handleNavigate('/new-expense')}
                >
                  <BsFillFileArrowUpFill className="me-2" size={25} />
                  <span>New Expense</span>
                </button>
                <button
                  className="btn btn-light d-flex align-items-center mb-3"
                  onClick={() => handleNavigate('/submissions')}
                >
                  <BsFillFileCheckFill className="me-2" size={25} />
                  <span>Submissions</span>
                </button>
                
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex-grow-1 container my-4 d-flex">
        <aside className="bg-white shadow-sm p-3" style={{ width: '250px' }}>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <button className="btn btn-light d-flex align-items-center w-100" onClick={() => {
                setEditing(false);
                setShowSettings(false); // Close settings when showing profile
              }}>
                <BsPersonFill className="me-2" size={20} />
                Profile
              </button>
            </li>
            <li className="nav-item mb-3">
              <button className="btn btn-light d-flex align-items-center w-100" onClick={() => {
                setEditing(true);
                setShowSettings(false); // Close settings when editing profile
              }}>
                <BsPencilFill className="me-2" size={20} />
                Edit Profile
              </button>
            </li>
            <li className="nav-item mb-3">
              <button className="btn btn-light d-flex align-items-center w-100" onClick={() => {
                setShowSettings(true);
                setEditing(false); // Close editing when showing settings
              }}>
                <BsGearFill className="me-2" size={20} />
                Settings
              </button>
            </li>
          </ul>
        </aside>

        <div className="flex-grow-1 card shadow border-0 bg-white ms-2">
          <div className="card-body">
            {editing ? (
              // Edit Profile Form
              <form onSubmit={handleSubmit} className="bg-light p-3 shadow-sm">
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select id="gender" name="gender" value={formData.gender || ''} onChange={handleInputChange} className="form-control" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="designation" className="form-label">Designation</label>
                  <input type="text" id="designation" name="designation" value={formData.designation || ''} onChange={handleInputChange} className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            ) : showSettings ? (
              // Settings Section
<div className="bg-light p-4 shadow-sm rounded">
  <h5 className="text-primary mb-4">Settings</h5>

  {/* Dark Mode */}
  <div className="mb-3">
    <button className="btn btn-outline-dark w-50 d-flex align-items-center" aria-label="Toggle dark mode">
      <span className="me-2">🌙</span> 
      Dark Mode
    </button>
  </div>
{/* Terms of Service */}
<div className="mb-3">
  <button 
    className="btn btn-outline-secondary w-50 d-flex align-items-center" 
    aria-label="View terms of service"
    onClick={togglePrivacyPolicy}
  >
    <span className="me-2">📄</span> 
    Terms of Service / Privacy Policy
  </button>
</div>

{/* Deactivate/Delete Account */}
<div className="mb-3">
  <button 
    className="btn btn-outline-danger w-50 d-flex align-items-center" 
    aria-label="Deactivate or delete account"
    onClick={toggleDeleteAccount}
  >
    <span className="me-2">❌</span> 
    Deactivate/Delete Account
  </button>
</div>
 

  {/* Change Password */}
  <div className="mb-3">
    <button 
      onClick={toggleChangePassword} 
      className="btn btn-outline-primary w-50 d-flex align-items-center" 
      aria-label="Change your password">
      <span className="me-2">🔑</span> 
      Change Password
    </button>
  </div>

  {/* Logout */}
  <div>
    <button 
      onClick={handleLogout} 
      className="btn btn-outline-danger w-50 d-flex align-items-center" 
      aria-label="Logout of your account">
      <span className="me-2">🚪</span> 
      Logout
    </button>
  </div>
</div>

            ) : showChangePassword ? (
              // Change Password Form
              <form onSubmit={handleChangePassword} className="bg-light p-3 shadow-sm">
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input type="password" id="currentPassword" name="currentPassword" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input type="password" id="newPassword" name="newPassword" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
                <button type="button" onClick={toggleChangePassword} className="btn btn-link">Cancel</button>
              </form>
            ) : showPrivacyPolicy ? (

              <div className="bg-light p-3 shadow-sm">
              <h4>Privacy Policy</h4>
              <p>Our privacy policy outlines how we handle your data...</p>
              {/* Add more details as per your policy */}
            </div>
          )

          : showDeleteAccount ? (
            <form className="bg-light p-3 shadow-sm">
              <h4>Deactivate/Delete Account</h4>
              <p>If you proceed, your account will be deactivated or deleted permanently. Please confirm your decision.</p>
              <button className="btn btn-danger" onClick={() => alert('Account deletion process initiated')}>
                Delete Account
              </button>
              </form>


            ) : (
              // Profile Details
              <div className="bg-light p-3 shadow-sm">
                
                <div className="mb-3">
                  <p><strong>Full Name:</strong></p>
                  <div className="border rounded p-2 bg-white">{userData.fullName}</div>
                </div>
                
                <div className="mb-3">
                  <p><strong>Email:</strong></p>
                  <div className="border rounded p-2 bg-white">{userData.email}</div>
                </div>
                
                <div className="mb-3">
                  <p><strong>Phone Number:</strong></p>
                  <div className="border rounded p-2 bg-white">{userData.phoneNumber}</div>
                </div>
                
                <div className="mb-3">
                  <p><strong>Gender:</strong></p>
                  <div className="border rounded p-2 bg-white">{userData.gender}</div>
                </div>
                
                <div className="mb-3">
                  <p><strong>Designation:</strong></p>
                  <div className="border rounded p-2 bg-white">{userData.designation}</div>
                </div>
              </div>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
