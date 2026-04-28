import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const isLoggedIn = !!getAuthToken();

  const testimonials = [
    {
      text: "Finally! A transparent way to know if I'm being paid fairly.",
      author: "Sarah Chen",
      role: "Senior Developer",
      company: "Tech Corp",
      avatar: "👩‍💼",
      color: "#FF6B6B"
    },
    {
      text: "Helped me negotiate a 20% salary increase with real data.",
      author: "Marcus Rodriguez",
      role: "Product Manager",
      company: "StartupXYZ",
      avatar: "👨‍💻",
      color: "#4ECDC4"
    },
    {
      text: "The community voting system ensures data accuracy and trust.",
      author: "Emma Watson",
      role: "Data Engineer",
      company: "DataFlow Inc",
      avatar: "👩‍🔬",
      color: "#FFE66D"
    },
    {
      text: "Anonymous submissions give me confidence to share honestly.",
      author: "James Kim",
      role: "Full Stack Developer",
      company: "CloudTech",
      avatar: "👨‍🚀",
      color: "#95E1D3"
    }
  ];

  const features = [
    { icon: '🔒', title: 'Anonymous', desc: 'Your identity is always protected' },
    { icon: '👥', title: 'Community', desc: 'Moderated by community votes' },
    { icon: '🌍', title: 'Global', desc: 'Salary data from worldwide tech companies' },
    { icon: '📊', title: 'Analytics', desc: 'Deep insights and statistics' }
  ];

  const quickStats = [
    { label: 'Submissions', value: '1000+', icon: '📝' },
    { label: 'Countries', value: '45+', icon: '🌎' },
    { label: 'Companies', value: '500+', icon: '🏢' },
    { label: 'Active Users', value: '5K+', icon: '👤' }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);


  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="dashboard-container">
      {/* Hero Slider */}
      <div className="hero-slider">
        <div className="slider-container">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-content">
                <div className="avatar-container" style={{ backgroundColor: testimonial.color }}>
                  <div className="avatar-emoji">{testimonial.avatar}</div>
                </div>
                <blockquote>{`"${testimonial.text}"`}</blockquote>
                <div className="slide-author">
                  <p className="author-name">— {testimonial.author}</p>
                  <p className="author-role">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-btn prev" onClick={prevSlide}>❮</button>
        <button className="slider-btn next" onClick={nextSlide}>❯</button>
        <div className="slider-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* User Welcome */}
      {userInfo && (
        <div className="user-welcome">
          <span className="welcome-icon">👋</span>
          <p>Welcome back, <strong>{userInfo.username}</strong>!</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="quick-stats">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-badge">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Features */}
      <div className="dashboard-header">
        <h1>What You Can Do</h1>
        <p className="subtitle">Explore salary transparency with powerful tools</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card card-submit">
          <h2>📊 Submit Salary</h2>
          <p>Share your salary information anonymously to help build transparency in the tech industry.</p>
          <button onClick={() => navigate('/submit')} className="btn-primary">
            → Submit Now
          </button>
        </div>

        <div className="dashboard-card card-search">
          <h2>🔍 Search Salaries</h2>
          <p>Browse salary submissions filtered by role, company, country, and experience level.</p>
          <button onClick={() => navigate('/search')} className="btn-primary">
            → Explore Data
          </button>
        </div>

        <div className="dashboard-card card-stats">
          <h2>📈 Statistics</h2>
          <p>Explore aggregated salary statistics including averages, medians, and percentiles.</p>
          <button onClick={() => navigate('/stats')} className="btn-primary">
            → View Analysis
          </button>
        </div>

        <div className="dashboard-card card-vote">
          <h2>🗳️ Vote & Moderate</h2>
          <p>Help moderate submissions by voting. Upvotes approve entries to the public database.</p>
          <button
            onClick={() => navigate(isLoggedIn ? '/vote' : '/login')}
            className="btn-primary"
          >
            → Start Voting {!isLoggedIn && '(Login Required)'}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Tech Salary Scale?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="info-section">
        <h3>🚀 How It Works</h3>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Submit</h4>
            <p>Share your salary details (anonymously by default)</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Vote</h4>
            <p>Community members vote to approve submissions</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Publish</h4>
            <p>After upvotes, submissions appear in search</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Explore</h4>
            <p>Users analyze approved salary data freely</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Ready to Make an Impact?</h2>
        <p>Start sharing salary data and help create a more transparent tech industry</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/submit')} className="btn-primary btn-lg">
            Submit Your Salary
          </button>
          <button onClick={() => navigate('/search')} className="btn-secondary btn-lg">
            Browse Salaries
          </button>
        </div>
      </div>
    </div>
  );
}
