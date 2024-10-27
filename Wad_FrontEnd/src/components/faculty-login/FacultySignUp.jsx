import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/Images/1.png';

function FacultySignUp() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [designation, setDesignation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState(''); // Add state for date of birth
    const [loading, setLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState(''); // Error message state

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent duplicate submissions
        setLoading(true);
        setErrorMessage(''); // Clear previous error

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    phoneNumber,
                    email,
                    gender,
                    designation,
                    password,
                    dateOfBirth: dob,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                navigate('/faculty-login'); // Redirect on success
            } else {
                console.error('Error during signup:', data.message);
                setErrorMessage(data.message || 'Signup failed'); // Show error message
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorMessage('An error occurred during signup. Please try again.'); // Show error message
        } finally {
            setLoading(false); // Always reset loading state
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
                <img src={logo} alt="CSE Department Logo" style={{ width: '150px' }} />
            </header>

            <div className="d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 py-3">
                <h2>Faculty Sign Up</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Error message display */}
                <form onSubmit={handleSubmit} className="w-50">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
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
                        <select
                            className="form-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
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
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-100" style={{ backgroundColor: '#ff7e39', color: 'white' }} disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>

            <footer className="bg-white py-3 text-center">
                <small>© 2024 CSE Department | All Rights Reserved</small>
            </footer>
        </div>
    );
}

export default FacultySignUp;
