import { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import '../styles/Statistics.css';

export default function Statistics() {
  const [filters, setFilters] = useState({
    role: '',
    company: '',
    country: '',
    level: '',
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await getStats(filters);
      setStats(response.stats);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch statistics. Please try again.');
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="stats-container">
      <h1>Salary Statistics</h1>
      <p className="stats-subtitle">Analyze salary trends with real community data</p>

      <div className="filter-section">
        <form onSubmit={handleSearch} className="stats-filter-form">
          <div className="filter-group">
            <input
              type="text"
              name="role"
              placeholder="Job Role (e.g., Software Engineer)"
              value={filters.role}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={filters.company}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={filters.country}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Any Experience Level</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Loading...' : 'Get Statistics'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {searched && stats && (
        <div className="stats-results">
          <div className="stats-overview">
            <h2>Statistics</h2>
            <p className="result-count">Based on {stats.count} salary submissions</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card highlight">
              <div className="stat-label">Average Salary</div>
              <div className="stat-value">{formatCurrency(stats.avg_salary)}</div>
              <div className="stat-description">Mean of all submissions</div>
            </div>

            <div className="stat-card highlight">
              <div className="stat-label">Median Salary</div>
              <div className="stat-value">{formatCurrency(stats.median_salary)}</div>
              <div className="stat-description">50th percentile</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Minimum Salary</div>
              <div className="stat-value">{formatCurrency(stats.min_salary)}</div>
              <div className="stat-description">Lowest submission</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Maximum Salary</div>
              <div className="stat-value">{formatCurrency(stats.max_salary)}</div>
              <div className="stat-description">Highest submission</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">25th Percentile</div>
              <div className="stat-value">{formatCurrency(stats.p25_salary)}</div>
              <div className="stat-description">Lower quartile</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">75th Percentile</div>
              <div className="stat-value">{formatCurrency(stats.p75_salary)}</div>
              <div className="stat-description">Upper quartile</div>
            </div>
          </div>

          <div className="salary-range">
            <h3>Salary Range Distribution</h3>
            <div className="range-bar">
              <div className="range-segment">
                <span className="range-label">Min</span>
                <div className="range-value">{formatCurrency(stats.min_salary)}</div>
              </div>
              <div className="range-segment">
                <span className="range-label">Q1</span>
                <div className="range-value">{formatCurrency(stats.p25_salary)}</div>
              </div>
              <div className="range-segment">
                <span className="range-label">Median</span>
                <div className="range-value">{formatCurrency(stats.median_salary)}</div>
              </div>
              <div className="range-segment">
                <span className="range-label">Q3</span>
                <div className="range-value">{formatCurrency(stats.p75_salary)}</div>
              </div>
              <div className="range-segment">
                <span className="range-label">Max</span>
                <div className="range-value">{formatCurrency(stats.max_salary)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && !stats && (
        <div className="no-data-message">
          <p>No data available for the selected filters. Try adjusting your search criteria.</p>
        </div>
      )}

      {!searched && (
        <div className="initial-state">
          <p>👆 Use the filters above to analyze salary statistics</p>
        </div>
      )}
    </div>
  );
}
