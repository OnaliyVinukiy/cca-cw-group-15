import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuthToken, clearAuthToken } from './services/api';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import SalaryForm from './components/SalaryForm';
import SearchSalaries from './components/SearchSalaries';
import Statistics from './components/Statistics';
import VoteSubmission from './components/VoteSubmission';
import './styles/index.css';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is still logged in
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    clearAuthToken();
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      <nav>
        <Link to="/" style={{ marginRight: '20px' }}>
          💰 Tech Salary Scale
        </Link>

        {/* Always visible */}
        <Link to="/dashboard" style={{ marginRight: '20px' }}>
          Dashboard
        </Link>
        <Link to="/submit" style={{ marginRight: '20px' }}>
          Submit Salary
        </Link>
        <Link to="/search" style={{ marginRight: '20px' }}>
          Search Salaries
        </Link>
        <Link to="/stats" style={{ marginRight: '20px' }}>
          Statistics
        </Link>

        {/* Conditional */}
        {isLoggedIn ? (
          <>
            <Link to="/vote" style={{ marginRight: '20px' }}>
              Vote
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '20px' }}>
              Login
            </Link>
            <Link to="/signup" style={{ marginRight: '20px' }}>
              Sign Up
            </Link>
          </>
        )}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit" element={<SalaryForm />} />
          <Route path="/search" element={<SearchSalaries />} />
          <Route path="/stats" element={<Statistics />} />

          {/* Protected route */}
          <Route
            path="/vote"
            element={isLoggedIn ? <VoteSubmission /> : <Login />}
          />
        </Routes>
      </main>

      <footer style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        marginTop: '50px',
        borderTop: '1px solid #ddd'
      }}>
        <p>© 2026 Tech Salary Scale - Building Salary Transparency Together</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
