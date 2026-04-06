import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home({ isLoggedIn }) {
  const [animateStats, setAnimateStats] = useState(false);
  const [displayedStats, setDisplayedStats] = useState({ submissions: 0, countries: 0, companies: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const finalStats = { submissions: 1000, countries: 45, companies: 500 };

  useEffect(() => {
    setAnimateStats(true);
  }, []);

  useEffect(() => {
    if (!animateStats) return;

    const intervals = {
      submissions: setInterval(() => {
        setDisplayedStats(prev => ({
          ...prev,
          submissions: Math.min(prev.submissions + 50, finalStats.submissions)
        }));
      }, 30),
      countries: setInterval(() => {
        setDisplayedStats(prev => ({
          ...prev,
          countries: Math.min(prev.countries + 2, finalStats.countries)
        }));
      }, 50),
      companies: setInterval(() => {
        setDisplayedStats(prev => ({
          ...prev,
          companies: Math.min(prev.companies + 25, finalStats.companies)
        }));
      }, 30)
    };

    return () => {
      clearInterval(intervals.submissions);
      clearInterval(intervals.countries);
      clearInterval(intervals.companies);
    };
  }, [animateStats]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero" onMouseMove={handleMouseMove}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-word">Transparent</span>
            <span className="title-word">Salaries</span>
            <span className="title-word">Empower</span>
            <span className="title-word">Everyone</span>
          </h1>
          
          <p className="hero-subtitle">
            A community-driven platform for salary transparency in the tech industry.
            Share your salary anonymously, discover market rates, and help build a more transparent future.
          </p>

          {!isLoggedIn && (
            <div className="hero-buttons">
              <Link to="/signup" className="btn-hero btn-primary-hero">
                🚀 Get Started Free
              </Link>
              <Link to="/login" className="btn-hero btn-secondary-hero">
                👤 Sign In
              </Link>
            </div>
          )}

          <div className="scroll-indicator">
            <div className="scroll-dot"></div>
          </div>
        </div>

        {/* Animated Grid Background */}
        <div className="hero-grid"></div>
      </section>

      {/* Animated Stats Section */}
      <section className="stats-showcase">
        <div className="stats-title">
          <h2>Trusted by Tech Professionals Worldwide</h2>
          <p>Real data. Real transparency. Real impact.</p>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number" style={{ fontSize: displayedStats.submissions > 500 ? '48px' : '36px' }}>
              {displayedStats.submissions.toLocaleString()}
              <span className="plus">+</span>
            </div>
            <div className="stat-label">Salary Submissions</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${(displayedStats.submissions / finalStats.submissions) * 100}%` }}></div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-number">
              {displayedStats.countries.toLocaleString()}
              <span className="plus">+</span>
            </div>
            <div className="stat-label">Countries Represented</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${(displayedStats.countries / finalStats.countries) * 100}%` }}></div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-number">
              {displayedStats.companies.toLocaleString()}
              <span className="plus">+</span>
            </div>
            <div className="stat-label">Tech Companies</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${(displayedStats.companies / finalStats.companies) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-showcase">
        <h2>Why Choose Tech Salary Scale?</h2>
        <div className="features-flex">
          <div className="feature-item feature-1">
            <div className="feature-icon">🔒</div>
            <h3>100% Anonymous</h3>
            <p>Your identity is never disclosed. Share honestly without worry.</p>
          </div>

          <div className="feature-item feature-2">
            <div className="feature-icon">👥</div>
            <h3>Community Verified</h3>
            <p>Moderated by real users. Only legitimate salaries make it public.</p>
          </div>

          <div className="feature-item feature-3">
            <div className="feature-icon">🌍</div>
            <h3>Global Coverage</h3>
            <p>Salary data from tech companies worldwide, not just one region.</p>
          </div>

          <div className="feature-item feature-4">
            <div className="feature-icon">📊</div>
            <h3>Deep Analytics</h3>
            <p>Advanced filtering and statistics to understand market rates.</p>
          </div>

          <div className="feature-item feature-5">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Data</h3>
            <p>Up-to-date salary information from the latest submissions.</p>
          </div>

          <div className="feature-item feature-6">
            <div className="feature-icon">🎯</div>
            <h3>Negotiate Better</h3>
            <p>Armed with real data, negotiate your salary with confidence.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">1️⃣</div>
            <h3>Sign Up</h3>
            <p>Create your free account in seconds</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-icon">2️⃣</div>
            <h3>Submit</h3>
            <p>Share your salary anonymously</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-icon">3️⃣</div>
            <h3>Vote</h3>
            <p>Help verify other submissions</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-icon">4️⃣</div>
            <h3>Explore</h3>
            <p>Discover salary insights & data</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Transform Salary Transparency?</h2>
          <p>Join thousands of tech professionals building a fairer industry</p>
          {!isLoggedIn && (
            <Link to="/signup" className="btn-large">
              Start Sharing Today 🚀
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
