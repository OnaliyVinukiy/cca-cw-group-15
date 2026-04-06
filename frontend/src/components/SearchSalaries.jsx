import { useState } from 'react';
import { searchSalaries } from '../services/api';
import '../styles/SearchSalaries.css';

export default function SearchSalaries() {
  const [filters, setFilters] = useState({
    role: '',
    company: '',
    country: '',
    level: '',
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await searchSalaries(filters);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError('Failed to search salaries. Please try again.');
      console.error('Search error:', err);
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
    <div className="search-container">
      <h1>Search Approved Salaries</h1>
      <p className="search-subtitle">Browse real salary data from verified submissions</p>

      <form onSubmit={handleSearch} className="search-filter-form">
        <input
          type="text"
          name="role"
          placeholder="Job Role"
          value={filters.role}
          onChange={handleFilterChange}
          disabled={loading}
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={filters.company}
          onChange={handleFilterChange}
          disabled={loading}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={filters.country}
          onChange={handleFilterChange}
          disabled={loading}
        />
        <select name="level" value={filters.level} onChange={handleFilterChange} disabled={loading}>
          <option value="">Any Experience Level</option>
          <option value="Junior">Junior</option>
          <option value="Mid">Mid-Level</option>
          <option value="Senior">Senior</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {loading && <div className="loading">Loading results...</div>}

      {searched && (
        <div className="search-results">
          <div className="results-header">
            <h2>Results</h2>
            <p className="results-count">
              Found {results.length} {results.length === 1 ? 'salary' : 'salaries'}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="no-results">
              <p>No salaries found matching your criteria. Try adjusting your filters!</p>
            </div>
          ) : (
            <div className="salary-list">
              {results.map((salary) => (
                <div key={salary.id} className="salary-card">
                  <div className="salary-header">
                    <div>
                      <h3>{salary.role}</h3>
                      <p className="company-name">{salary.company}</p>
                    </div>
                    <div className="salary-amount">{formatCurrency(salary.amount)}</div>
                  </div>

                  <div className="salary-details">
                    <div className="detail-item">
                      <span className="detail-label">Experience Level</span>
                      <span className="experience-badge">{salary.experience_level}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Country</span>
                      <span className="country-badge">{salary.country}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Submitted</span>
                      <span className="detail-value">
                        {new Date(salary.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {salary.status && (
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span className="detail-value">{salary.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!searched && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <p>👆 Use the filters above to search salaries</p>
        </div>
      )}
    </div>
  );
}
